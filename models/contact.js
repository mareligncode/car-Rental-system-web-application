const mongoose = require('mongoose');
const validator = require('validator');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required to fill contact'],
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        },
        required: [true, 'Email is required']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: (v) => {
                const cleaned = v.replace(/\D/g, '');
                return cleaned.length >= 4 && cleaned.length <= 13;
            },
            message: 'Phone must be 10 to 13 digits'
        },
        required: [true, 'Phone is required']
    },
    // ADD THIS ENTIRE BLOCK FOR THE MESSAGE
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    }
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;