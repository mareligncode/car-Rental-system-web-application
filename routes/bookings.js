const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, extendBooking } = require('../controllers/bookingsController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate, createBooking);
router.get('/my-bookings', authenticate, getMyBookings);
router.patch('/:bookingId/cancel', authenticate, cancelBooking);
router.patch('/:bookingId/extend', authenticate, extendBooking);

module.exports = router;