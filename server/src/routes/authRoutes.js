const express = require('express');
const router = express.Router();
const path = require('path');

// This forces Node to find authController accurately from the absolute path
const { register, login } = require(path.join(__dirname, '../controllers/authController'));

router.post('/register', register);
router.post('/login', login);

module.exports = router;