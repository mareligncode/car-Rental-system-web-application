const User = require('../models/User')
const admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error during admin check' });
    }
};

module.exports = admin;