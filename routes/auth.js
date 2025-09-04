const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth');
const authenticate = require('../middlewares/auth'); 

// POST /api/auth/register
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
