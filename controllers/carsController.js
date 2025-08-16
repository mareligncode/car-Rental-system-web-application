const Car = require('../models/Car');
const Booking = require('../models/Booking');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// exports.addCar = async (req, res) => {
//     try {
//         const newCar = new Car(req.body);
//         const car = await newCar.save();
//         res.status(201).json(car);
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to add car' });
//     }
// };

exports.updateCar = async (req, res) => {
    try {
        const carToUpdate = await Car.findById(req.params.id);
        if (!carToUpdate) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const updatedData = { ...req.body };

        if (req.file) {
            updatedData.image = req.file.path;
        }

        if (updatedData.features && typeof updatedData.features === 'string') {
            updatedData.features = updatedData.features.split(',').map(f => f.trim());
        }

        const car = await Car.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(car);
    } catch (error) {
        console.error("UPDATE CAR ERROR: ", error);
        res.status(400).json({ error: 'Failed to update car', details: error.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const carId = req.params.id;

        // --- CHECK FOR ASSOCIATED BOOKINGS ---
        const existingBooking = await Booking.findOne({ car: carId });

        if (existingBooking) {
            return res.status(400).json({
                error: 'Cannot delete this car because it has existing bookings associated with it.'
            });
        }
        // --- END CHECK ---

        const car = await Car.findByIdAndDelete(carId);
        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.status(200).json(car);
    } catch (error) {
        console.error('ERROR FETCHING CAR BY ID:', error);
        res.status(500).json({ error: 'Server Error or Invalid Car ID' });
    }
};
exports.addCar = async (req, res) => {
    const { make, model, year, type, transmission, seats, fuelType, price, features } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required.' });
    }
    const image = req.file.path;

    try {
        const newCar = new Car({
            make,
            model,
            year,
            type,
            transmission,
            seats,
            fuelType,
            price,
            image, 
            features: features ? features.split(',').map(f => f.trim()) : []
        });

        const car = await newCar.save();
        res.status(201).json(car);
    } catch (error) {
        console.error('ERROR ADDING CAR:', error);
        res.status(400).json({
            error: 'Failed to add car. Please ensure all required fields are filled correctly.',
            details: error.message
        });
    }
};