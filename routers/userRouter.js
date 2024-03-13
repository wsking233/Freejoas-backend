const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { verifyToken, checkPermission } = require('../server/auth');

//get all users
router.get('/all',verifyToken, checkPermission(["admin"]), userController.getAllUsers); //only admin can get all users

//get user by ID
router.get('/profile', verifyToken, userController.getUserByID);   //all users can get their own information

// login a user
router.post('/login', userController.login);   //create a token and send it to the user

// create a new user
router.post('/create', userController.createUser);  //no need to verify token

// update a user with a specific ID
router.patch('/update', verifyToken, userController.updateUser);    //all user can update their own information

// update user account type
router.patch('/accounttype', verifyToken, checkPermission(["admin"]), userController.updateAccountType);  //only admin can update account type

// delete a user with a specific ID
router.delete('/delete', verifyToken, checkPermission(["admin"]), userController.deleteUser); 

module.exports = router;