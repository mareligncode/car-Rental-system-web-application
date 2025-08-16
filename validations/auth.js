const validator = require('validator');

exports.validateRegisterInput = (name, email, password) => {
    const errors = {};

    if (!name || name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (!email || !validator.isEmail(email)) {
        errors.email = 'Valid email is required';
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (!password) {
        errors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
        errors.password = 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character';
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

exports.validateLoginInput = (email, password) => {
    const errors = {};

    if (!email || !validator.isEmail(email)) {
        errors.email = 'Valid email is required';
    }

    if (!password || password === '') {
        errors.password = 'Password is required';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};