const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment, initializeExtensionPayment, verifyExtensionPayment } =
    require('../controllers/paymentController');

const authenticate = require('../middlewares/auth');
router.post('/initialize', authenticate, initializePayment);
router.get('/verify/:tx_ref', verifyPayment);
router.post('/initialize-extension/:bookingId', authenticate, initializeExtensionPayment);
router.get('/verify-extension/:bookingId/:tx_ref', verifyExtensionPayment);
module.exports = router;