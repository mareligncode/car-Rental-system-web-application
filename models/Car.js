const mongoose = require('mongoose');
const CarSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    transmission: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    fuelType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true
    },
    features: { type: [String], default: [] }
});

module.exports = mongoose.model('Car', CarSchema);