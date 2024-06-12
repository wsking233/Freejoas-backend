const express = require('express');
const router = express.Router();
const {sendVerificationEmail, verifyEmail} = require('../controllers/verificationController');

//send verification email
router.post('/send', sendVerificationEmail);

//verify email
router.get('/verify', verifyEmail);

module.exports = router;