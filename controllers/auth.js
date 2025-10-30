const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const {
    validateRegisterInput,
    validateLoginInput
} = require('../validations/auth');
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const { errors, valid } = validateRegisterInput(name, email, password);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }
        const user = await User.create({ name, email, password, role: 'user' });
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // <-- FIXED
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role // <-- FIXED
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const { errors, valid } = validateLoginInput(email, password);
    if (!valid) {
        return res.status(400).json({ errors });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials password donot match' });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).json({ message: 'If a user with this email exists, we will send a link to reset.' });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `https://car-rental-system-web-application-2.onrender.com/reset-password/${resetToken}`;
        const message = `Hello, forgot your password? Submit a PATCH request with your new password to: ${resetURL}.`;

        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });

        return res.status(200).json({ status: 'success', message: 'Token sent to email!' });
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR: ", err);
        res.status(500).json({ error: 'There was an error sending the email. Try again later.' });
    }
};
// exports.forgotPassword = async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email });
//         if (!user) {
//             return res.status(200).json({ message: 'if user  with this email  exists we will send link to reset' });
//         }
//         const resetToken = user.createPasswordResetToken();
//         await user.save({ validateBeforeSave: false });
//          const resetURL = `https://car-rental-system-web-application-2.onrender.com/reset-password/${resetToken}`;
//         //const resetURL = `https://car-rental-system-web-application-2.onrender.com`;

//         const message = `hello $Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
//         await sendEmail({
//             email: user.email,
//             subject: 'Your password reset token (valid for 10 min)',
//             message,
//         });
//         res.status(200).json({
//             status: 'success',
//             message: 'Token sent to email!',
//         });
//     } catch (err) {
//         const user = await User.findOne({ email: req.body.email });
//         if (user) {
//             user.passwordResetToken = undefined;
//             user.passwordResetExpires = undefined;
//             await user.save({ validateBeforeSave: false });
//         }
//         console.error("FORGOT PASSWORD ERROR: ", err);
//         res.status(500).json({ error: 'There was an error sending the email. Try again later.' });
//     }
  

// };


exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256') // <-- CORRECTED TYPO HERE
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Token is invalid or has expired.' });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        // This fix handles the original Mongoose validation error
        await user.save({ validateBeforeSave: false });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err) {
        console.error("RESET PASSWORD ERROR: ", err);
        res.status(500).json({ error: 'Server error while resetting password.' });
    }
};
