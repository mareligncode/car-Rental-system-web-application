const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getMyTasks,
    completeTask,
    deleteTask
} = require('../controllers/taskController');
const authenticate = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const employee = require('../middlewares/employee'); 

// Admin-only routes
router.post('/', authenticate, admin, createTask);
router.get('/', authenticate, admin, getAllTasks);
router.delete('/:id', authenticate, admin, deleteTask);

// Employee-only routes
router.get('/mytasks', authenticate, employee, getMyTasks);
router.patch('/:id/complete', authenticate, employee, completeTask);

module.exports = router;