/**
 * @module adminRouter
 * @description Router for admin-related routes.
 * @version 2
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../../server/auth');
const userController = require('../../controllers/version2/usersController');
const freejoaController = require('../../controllers/version2/freejoaController');

/**
 * @name GET /users
 * @function
 * @description Get all users or find user by ID.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.get('/users', verifyToken, checkPermission([ADMIN]), userController.getUsersByIdsOrAll);

/**
 * @name PATCH /users/:userId/account-type
 * @function
 * @description Update user account type.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.patch('/users/:userId/account-type', verifyToken, checkPermission([ADMIN]), userController.updateAccountType);

/**
 * @name DELETE /users
 * @function
 * @description Delete a user.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.delete('/users', verifyToken, checkPermission([ADMIN]), userController.deleteUser);

/**
 * @name DELETE /freejoas/delete
 * @function
 * @description Delete a freejoa.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.delete('/freejoas/delete', verifyToken, checkPermission([ADMIN]), freejoaController.deleteFreejoa);

/**
 * @name GET /freejoas/pending
 * @function
 * @description Get all pending freejoas.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.get('/freejoas/pending', verifyToken, checkPermission([ADMIN]), freejoaController.getAllPendingFreejoas);

/**
 * @name PATCH /freejoas/pending/approve
 * @function
 * @description Approve pending freejoas.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.patch('/freejoas/pending/approve', verifyToken, checkPermission([ADMIN]), freejoaController.approvePendingFreejoas);

/**
 * @name DELETE /freejoas/pending/reject
 * @function
 * @description Reject pending freejoas.
 * @memberof module:adminRouter
 * @inner
 * @param {string} path - The URL path.
 * @param {function} middleware - Middleware function(s) to be executed.
 * @param {function} handler - Request handler function.
 */
router.delete('/freejoas/pending/reject', verifyToken, checkPermission([ADMIN]), freejoaController.rejectPendingFreejoas);

module.exports = router;