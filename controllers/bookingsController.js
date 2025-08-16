const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Notification = require('../models/Notification');

exports.createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate, phone, address, gender } = req.body;
        const userId = req.userId;
        if (!carId || !startDate || !endDate || !phone || !address || !gender) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found.' });
        }
        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const timeDifference = eDate.getTime() - sDate.getTime();
        const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if (totalDays <= 0) {
            return res.status(400).json({ error: 'End date must be after the start date.' });
        }
        const totalPrice = totalDays * car.price;
        const newBooking = new Booking({
            car: carId,
            user: userId,
            startDate,
            endDate,
            phone,
            address,
            gender,
            totalDays,
            // tempo 
            Status,
            totalPrice
        });
        await newBooking.save();
        res.status(201).json({
            success: true,
            message: 'Booking confirmed successfully!',
            booking: newBooking
        });
    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);
        res.status(500).json({ error: 'Server error while creating booking.' });
    }
};
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .sort({ createdAt: -1 })
            //temp status
            .populate('car', 'make model image price Statust');

        res.status(200).json(bookings);

    } catch (error) {
        console.error("GET MY BOOKINGS ERROR:", error);
        res.status(500).json({ error: 'Server error while fetching bookings.' });
    }
};

// exports.cancelBooking = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
//         const booking = await Booking.findById(bookingId)
//             .populate('user', 'name')
//             .populate('car', 'make model');

//         if (!booking) {
//             return res.status(404).json({ error: 'Booking not found' });
//         }
//         if (booking.user._id.toString() !== req.userId) {
//             return res.status(403).json({ error: 'User not authorized' });
//         }
//         if (booking.status === 'Cancelled') {
//             return res.status(400).json({ error: 'Booking is already cancelled' });
//         }

//         const refundAmount = booking.totalPrice * 0.5;

//         booking.status = 'Cancelled';
//         booking.cancellationDetails = {
//             cancelledOn: new Date(),
//             refundAmount: refundAmount,
//             refundStatus: 'Pending'
//         };

//         await booking.save();

//         const message = `Booking for ${booking.car.make} ${booking.car.model} by ${booking.user.name} was cancelled. A refund of $${refundAmount.toFixed(2)} is pending.`;

//         const newNotification = new Notification({
//             message: message,
//             link: `/admin/bookings/${booking._id}`
//         });

//         const savedNotification = await newNotification.save();

//         // Emit to all connected admins
//         req.io.to('admins').emit('new_notification', savedNotification);

//         res.status(200).json({
//             message: 'Booking cancellation request received. Refund is pending processing.',
//             booking
//         });

//     } catch (error) {
//         console.error("CANCEL BOOKING ERROR:", error);
//         res.status(500).json({ error: 'Server error while cancelling booking' });
//     }
// };

// Paste this entire function into your bookingsController.js file, replacing the old one.

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const bookingToCheck = await Booking.findById(bookingId).populate('user', 'name');
        if (!bookingToCheck) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (bookingToCheck.user._id.toString() !== req.userId) {
            return res.status(403).json({ error: 'User not authorized' });
        }
        if (bookingToCheck.status === 'Cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }
        const refundAmount = bookingToCheck.totalPrice * 0.5;
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                $set: { // The $set operator is crucial.
                    status: 'Cancelled',
                    cancellationDetails: {
                        cancelledOn: new Date(),
                        refundAmount: refundAmount,
                        refundStatus: 'Pending'
                    }
                }
            },
            { new: true }
        ).populate('user', 'name').populate('car', 'make model'); // We populate here to get the details for the response.
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking could not be updated.' });
        }
        const message = `Booking for ${updatedBooking.car.make} ${updatedBooking.car.model} by ${updatedBooking.user.name} was cancelled. A refund of $${refundAmount.toFixed(2)} is pending.`;
        const newNotification = new Notification({
            message: message,
            link: `/admin/bookings/${updatedBooking._id}`
        });
        const savedNotification = await newNotification.save();
        req.io.to('admins').emit('new_notification', savedNotification);
        res.status(200).json({
            message: 'Booking cancellation request received. Refund is pending processing.',
            booking: updatedBooking
        });
    } catch (error) {
        console.error("CANCEL BOOKING ERROR:", error);
        res.status(500).json({ error: 'Server error while cancelling booking' });
    }
};
exports.extendBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { newEndDate } = req.body;
        const booking = await Booking.findById(bookingId).populate('car');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.user.toString() !== req.userId) {
            return res.status(403).json({ error: 'User not authorized to extend this booking' });
        }

        const originalEndDate = booking.isExtended ? new Date(booking.extendedEndDate) : new Date(booking.endDate);
        const requestedEndDate = new Date(newEndDate);
        const maxExtensionDate = new Date(originalEndDate);
        maxExtensionDate.setDate(maxExtensionDate.getDate() + 20);

        if (requestedEndDate > maxExtensionDate) {
            return res.status(400).json({ error: 'Booking cannot be extended beyond 20 days from the original end date.' });
        }

        const timeDifference = requestedEndDate.getTime() - originalEndDate.getTime();
        const additionalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (additionalDays <= 0) {
            return res.status(400).json({ error: 'New end date must be after the current end date.' });
        }

        const dailyRate = booking.car.price;
        const penaltyRate = 1.05; // 5% penalty
        const additionalCost = additionalDays * dailyRate * penaltyRate;

        booking.isExtended = true;
        booking.status = 'Extended';
        booking.extendedEndDate = requestedEndDate;
        booking.totalPrice += additionalCost;
        booking.extensionHistory.push({
            extendedOn: new Date(),
            previousEndDate: originalEndDate,
            newEndDate: requestedEndDate,
            additionalCost: additionalCost
        });

        await booking.save();

        res.status(200).json({ message: 'Booking extended successfully', booking });
    } catch (error) {
        console.error("EXTEND BOOKING ERROR:", error);
        res.status(500).json({ error: 'Server error while extending booking' });
    }
};