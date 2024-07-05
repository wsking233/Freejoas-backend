/**
 * @fileoverview User router for version 2 of the API.
 * @version 2
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../server/auth');
const userController = require('../../controllers/version2/usersController');
const verificationController = require('../../controllers/verificationController');

/**
 * Create a new user.
 * @name POST /
 * @function
 * @memberof module:routers/version2/userRouter
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.post('', userController.createUser);

/**
 * Update a user.
 * @name PATCH /:userId/update
 * @function
 * @memberof module:routers/version2/userRouter
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.patch('/:userId/update', verifyToken, userController.updateUser);

/**
 * Update user password.
 * @name PATCH /:userId/password
 * @function
 * @memberof module:routers/version2/userRouter
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.patch('/:userId/password', verifyToken, userController.updatePassword);

/**
 * Send email verification.
 * @name POST /send-email-verification
 * @function
 * @memberof module:routers/version2/userRouter
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.post('/send-email-verification', verificationController.sendVerificationEmail);

/**
 * Verify email.
 * @name GET /verify-email
 * @function
 * @memberof module:routers/version2/userRouter
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Express response object.
 */
router.get('/verify-email', verificationController.verifyEmail);

module.exports = router;