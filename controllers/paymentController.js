const axios = require('axios');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const Notification = require('../models/Notification');


exports.initializePayment = async (req, res) => {
    try {
        const { carId, startDate, endDate, phone, address, gender } = req.body;
        const userId = req.userId;
        if (!carId || !startDate || !endDate || !phone || !address) {
            return res.status(400).json({ error: 'Please provide all required booking details.' });
        }
        const car = await Car.findById(carId);
        const user = await User.findById(userId);
        if (!car || !user) {
            return res.status(404).json({ error: 'Car or User not found.' });
        }
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const timeDifference = eDate.getTime() - sDate.getTime();
        const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if (totalDays <= 0) {
            return res.status(400).json({ error: 'End date must be after the start date.' });
        }
        const totalPrice = totalDays * car.price;
        const tx_ref = `car-rental-${Date.now()}`;
        const newBooking = new Booking({
            car: carId,
            user: userId,
            startDate,
            endDate,
            phone,
            address,
            gender,
            totalDays,
            totalPrice,
            tx_ref,
            status: 'Pending'
        });
        await newBooking.save();
        const chapaData = {
            amount: totalPrice,
            currency: 'ETB',
            email: user.email,
            first_name: user.name.split(' ')[0],
            last_name: user.name.split(' ').slice(1).join(' ') || user.name.split(' ')[0],
            tx_ref: tx_ref,
            callback_url: `http://localhost:5000/api/payment/verify/${tx_ref}`,
            return_url: `http://localhost:5173/my-bookings?tx_ref=${tx_ref}`,
            "customization[title]": "Car Rental Payment",
            "customization[description]": `Booking for ${car.make} ${car.model}`
        };
        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaData, {
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.status === 'success') {
            res.status(200).json({ checkout_url: response.data.data.checkout_url });
        } else {
            res.status(400).json({ error: 'Failed to initialize payment.' });
        }
    } catch (error) {
        console.error("PAYMENT INITIALIZATION ERROR:", error);
        res.status(500).json({ error: 'Server error while initializing payment.' });
    }
};


exports.initializeExtensionPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { newEndDate } = req.body;
        const userId = req.userId;

        const booking = await Booking.findById(bookingId).populate('car');
        const user = await User.findById(userId);

        if (!booking || !user || booking.user.toString() !== userId) {
            return res.status(404).json({ error: 'Booking not found or unauthorized.' });
        }

        const originalEndDate = booking.isExtended ? new Date(booking.extendedEndDate) : new Date(booking.endDate);
        const requestedEndDate = new Date(newEndDate);

        const maxExtensionDate = new Date(originalEndDate);
        maxExtensionDate.setDate(maxExtensionDate.getDate() + 20);
        if (requestedEndDate > maxExtensionDate) {
            return res.status(400).json({ error: 'Cannot extend beyond 20 days.' });
        }

        const additionalDays = Math.ceil((requestedEndDate - originalEndDate) / (1000 * 3600 * 24));
        if (additionalDays <= 0) {
            return res.status(400).json({ error: 'New end date must be later than the current one.' });
        }

        // Calculate additional cost with 5% daily penalty
        const additionalCost = additionalDays * booking.car.price * 1.05;
        const extension_tx_ref = `ext-${bookingId}-${Date.now()}`;

        const chapaData = {
            amount: additionalCost.toFixed(2),
            currency: 'ETB',
            email: user.email,
            first_name: user.name,
            last_name: 'Booking Extension',
            tx_ref: extension_tx_ref,
            // IMPORTANT: The callback URL now includes the booking ID
            callback_url: `http://localhost:5000/api/payment/verify-extension/${bookingId}/${extension_tx_ref}`,
            return_url: `http://localhost:5173/my-bookings`,
            "customization[title]": "Booking Extension Payment",
            "customization[description]": `Extending booking for ${booking.car.make}`
        };

        const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', chapaData, {
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.status === 'success') {
            res.status(200).json({ checkout_url: response.data.data.checkout_url });
        } else {
            res.status(400).json({ error: 'Failed to initialize extension payment.' });
        }

    } catch (error) {
        console.error("EXTENSION PAYMENT ERROR:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Server error while initializing extension payment.' });
    }
};

exports.verifyExtensionPayment = async (req, res) => {
    try {
        const { bookingId, tx_ref } = req.params;

        const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            headers: { 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}` }
        });

        if (response.data.status === 'success') {
            // 1. Populate user and car to get names for the message
            const booking = await Booking.findById(bookingId)
                .populate('user', 'name')
                .populate('car', 'make model');

            if (booking) {
                const additionalCost = parseFloat(response.data.data.amount);
                const previousEndDate = booking.isExtended ? booking.extendedEndDate : booking.endDate;

                const dailyRate = booking.totalPrice / booking.totalDays;
                const additionalDays = Math.round(additionalCost / (dailyRate * 1.05));
                const newEndDate = new Date(previousEndDate);
                newEndDate.setDate(newEndDate.getDate() + additionalDays);

                booking.isExtended = true;
                booking.status = 'Extended';
                booking.totalPrice += additionalCost;
                booking.extendedEndDate = newEndDate;
                booking.extensionHistory.push({
                    extendedOn: new Date(),
                    previousEndDate,
                    newEndDate,
                    additionalCost,
                    extension_tx_ref: tx_ref
                });

                await booking.save();

                // --- 2. START: ADD NOTIFICATION LOGIC ---
                const message = `Booking by ${booking.user.name} for the ${booking.car.make} ${booking.car.model} was extended. Payment of $${additionalCost.toFixed(2)} received.`;

                const newNotification = new Notification({
                    message: message,
                    link: `/admin/bookings/${booking._id}`
                });

                const savedNotification = await newNotification.save();

                // Emit to all connected admins
                req.io.to('admins').emit('new_notification', savedNotification);
                // --- END: ADD NOTIFICATION LOGIC ---
            }
        }

        res.status(200).send('Extension verification webhook received.');
    } catch (error) {
        console.error("VERIFY EXTENSION ERROR:", error);
        res.status(500).send('Server error during extension verification.');
    }
};

// exports.verifyPayment = async (req, res) => {
//     try {
//         const { tx_ref } = req.params;
//         const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
//             }
//         });

//         if (response.data.status === 'success') {
//             const booking = await Booking.findOne({ tx_ref }).populate('car').populate('user');

//             if (booking) {
//                 booking.status = 'Confirmed';
//                 await booking.save();

//                 const newNotification = new Notification({
//                     message: `New booking for ${booking.user?.name || 'Unknown'} — ${booking.car.make} ${booking.car.model} (ID: ${booking._id.toString().slice(-6)}).`,
//                     link: `/admin/bookings/${booking._id}`
//                 });

//                 const savedNotification = await newNotification.save();
//                 req.io.to('admins').emit('new_notification', savedNotification);
//             }
//         }

//         res.status(200).send('Payment verification webhook received.');
//     } catch (error) {
//         console.error("PAYMENT VERIFICATION ERROR:", error);
//         res.status(500).send('Server error during payment verification.');
//     }
// };

exports.verifyPayment = async (req, res) => {
    try {
        const { tx_ref } = req.params;
        const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
            }
        });

        if (response.data.status === 'success') {
            const booking = await Booking.findOne({ tx_ref }).populate('car').populate('user');

            if (booking && booking.status !== 'Confirmed') { // Check to prevent duplicate updates
                booking.status = 'Confirmed';
                await booking.save();

                // After confirming the booking, set the car's availability to false.
                await Car.findByIdAndUpdate(booking.car._id, { available: false });
                // --- END: THIS IS THE NEW CODE TO ADD ---

                const newNotification = new Notification({
                    message: `New booking for ${booking.user?.name || 'Unknown'} — ${booking.car.make} ${booking.car.model} (ID: ${booking._id.toString().slice(-6)}).`,
                    link: `/admin/bookings/${booking._id}`
                });

                const savedNotification = await newNotification.save();
                req.io.to('admins').emit('new_notification', savedNotification);
            }
        }

        res.status(200).send('Payment verification webhook received.');
    } catch (error) {
        console.error("PAYMENT VERIFICATION ERROR:", error);
        res.status(500).send('Server error during payment verification.');
    }
};
