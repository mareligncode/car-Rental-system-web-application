const User = require('../models/User');
const employee = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && (user.role === 'employee' || user.role === 'admin')) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: Employee access required' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error during employee check' });
    }
};

module.exports = employee;