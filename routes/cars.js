const express = require('express');
const router = express.Router();
const {
    getAllCars,
    addCar,
    getCarById,
    updateCar,
    deleteCar
} = require('../controllers/carsController');
const authenticate = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const upload = require('../config/cloudinary'); 
router.get('/', getAllCars);
router.post('/', authenticate, admin, upload.single('image'), addCar);
router.put('/:id', authenticate, admin, upload.single('image'), updateCar);
router.get('/:id', getCarById);
router.delete('/:id', authenticate, admin, deleteCar);
module.exports = router;