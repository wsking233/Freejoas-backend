const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../server/auth');
const pendingFreejoaController = require('../../controllers/pendingFreejoaController');
const UsersController = require('../../controllers/v2/usersController')
const freejoasController = require('../../controllers/freejoasController');


/**
 *  User Routes
 */

//get all users
router.get('/users',verifyToken, checkPermission([ADMIN]), UsersController.getUsersByIdsOrAll); //only admin can get all users

// update user account type
router.patch('/users', verifyToken, checkPermission([ADMIN]), UsersController.updateUser);  //only admin can update account type

// delete a user with a specific ID
router.delete('/delete', verifyToken, checkPermission([ADMIN]), UsersController.deleteUser); 


/**
 *  Freejoa Routes
 */
// update a freejoa
router.patch('/update', verifyToken, checkPermission([ADMIN]), freejoasController.updateFreejoa);  //test passed

// delete a freejoa with a specific ID
router.delete('/delete',verifyToken, checkPermission([ADMIN]), freejoasController.deleteFreejoa); //test passed

/**
 *  Pending Freejoa Routes
 */
// get all pending freejoas
router.get('/pending/freejoa/all', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.getAllUploadRequest); // test passed

// approve pending freejoas
router.patch('/pending/freejoa/approve', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.approvePendingFreejoas); // test passed

// reject pending freejoas
router.delete('/pending/freejoa/reject', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.rejectPendingFreejoas);


module.exports = router;