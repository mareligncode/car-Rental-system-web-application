const Task = require('../models/Task');
const User = require('../models/User'); 
exports.createTask = async (req, res) => {
    const { description, assignedTo, dueDate } = req.body;
    const adminId = req.userId; 

    try {
        const employee = await User.findById(assignedTo);
        if (!employee || employee.role !== 'employee') {
            return res.status(404).json({ msg: 'Assigned user is not a valid employee.' });
        }

        const task = new Task({
            description,
            assignedTo,
            dueDate,
            createdBy: adminId,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        console.error("Task Creation Error:", error);
        res.status(500).json({ msg: 'Server error while creating task.' });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('assignedTo', 'name') 
            .sort({ createdAt: -1 }); 
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
    }
};


exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.userId }).sort({ status: 1, dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
    }
};


exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found.' });
        }

        if (task.assignedTo.toString() !== req.userId) {
            return res.status(401).json({ msg: 'User not authorized.' });
        }
        
        task.status = 'Completed';
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
    }
};


exports.deleteTask = async (req, res) => {
     try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(200).json({ msg: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error.' });
    }
};