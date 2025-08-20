const User = require('../models/User');
exports.getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err.message);
        res.status(500).send('Server Error');
    }
};
exports.addEmployee = async (req, res) => {
    const { name, email, password, workplace } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'An employee with this email already exists.' });
        }

        user = new User({
            name,
            email,
            password,
            workplace, 
            role: 'employee'
        });

        await user.save();

        const savedUser = user.toObject();
        delete savedUser.password;

        res.status(201).json(savedUser);

    } catch (err) {
        console.error("Error adding employee:", err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found.' });
        }

        res.status(200).json({ msg: 'Employee removed successfully.' });
    } catch (err) {
        console.error("Error deleting employee:", err.message);
        res.status(500).send('Server Error');
    }
};