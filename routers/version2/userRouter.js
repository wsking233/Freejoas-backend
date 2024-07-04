/**
 *  user router
 *  @version 2
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../server/auth');
const userController = require('../../controllers/version2/usersController');
const verificationController = require('../../controllers/verificationController');


// checked
// create a new user
router.post('', userController.createUser);

// checked
// update a user
router.patch('/:userId/update', verifyToken, userController.updateUser);

// checked
// update user password
router.patch('/:userId/password', verifyToken, userController.updatePassword);

// checked
// send email verification
router.post('/send-email-verification', verificationController.sendVerificationEmail);

// checked
// verify email
router.get('/verify-email', verificationController.verifyEmail);


module.exports = router;