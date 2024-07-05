const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../server/auth');
const userController = require('../../controllers/version2/usersController');
const freejoaController = require('../../controllers/version2/freejoaController');

/**
 *  user related routes
 */

// checked
// get all users or find user by ID
router.get('/users', verifyToken, checkPermission([ADMIN]), userController.getUsersByIdsOrAll);

// checked
// update user account type
router.patch('/users/:userId/account-type', verifyToken, checkPermission([ADMIN]), userController.updateAccountType);

// checked
// delete a user
router.delete('/users', verifyToken, checkPermission([ADMIN]), userController.deleteUser);

/**
 * freejoa related routes
 */

// update a freejoa
// router.patch('/freejoas/:freejoaId/update', verifyToken, checkPermission([ADMIN]), freejoaController.updateFreejoa);

// delete a freejoa
router.delete('/freejoas/delete', verifyToken, checkPermission([ADMIN]), freejoaController.deleteFreejoa);


/**
 * admin related routes
 */


module.exports = router;