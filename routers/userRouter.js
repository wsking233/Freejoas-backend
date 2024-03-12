const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { verifyToken, checkPermission } = require('../server/auth');

//get all users
router.get('/all', userController.getAllUsers); //test passed

// login a user
router.post('/login', userController.login);    //test passed

// create a new user
router.post('/create', userController.createUser);  //test passed

// update a user with a specific ID
router.patch('/update', verifyToken, checkPermission(["user"]), userController.updateUser);    //test passed

// delete a user with a specific ID
router.delete('/:userID', userController.deleteUser);   //test passed

module.exports = router;