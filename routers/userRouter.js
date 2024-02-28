const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// login a user
router.post('/login', userController.login);

module.exports = router;