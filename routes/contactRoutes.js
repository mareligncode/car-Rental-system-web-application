// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { createContact } = require('../controllers/contactController');

router.post('/', createContact); // <-- no extra "/contact"

module.exports = router;
