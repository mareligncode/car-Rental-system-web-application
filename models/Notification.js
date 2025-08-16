const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);