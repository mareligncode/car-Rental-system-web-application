const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        required: true
    },
    totalDays: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    tx_ref: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Extended'],
        default: 'Pending'
    },
    cancellationDetails: {
        cancelledOn: { type: Date },
        refundAmount: { type: Number },
        refundStatus: {
            type: String,
            enum: ['Pending', 'Processed', 'Failed'],
            default: 'Pending'
        }
    },

    isExtended: {
        type: Boolean,
        default: false
    },
    extendedEndDate: {
        type: Date
    },
    extensionHistory: [{
        extendedOn: { type: Date },
        previousEndDate: { type: Date },
        newEndDate: { type: Date },
        additionalCost: { type: Number },
        extension_tx_ref: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);