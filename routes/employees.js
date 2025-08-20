const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee, deleteEmployee } = require('../controllers/employeeController');
const authenticate = require('../middlewares/auth');
const admin = require('../middlewares/admin');
router.use(authenticate, admin);
router.route('/')
    .get(getEmployees)  
    .post(addEmployee); 
router.route('/:id')
  .delete(deleteEmployee);

module.exports = router;