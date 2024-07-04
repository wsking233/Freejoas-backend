/**
 * Auth Router
 * @version 2
 * 
 */

const express = require('express');
const router = express.Router();
const { checkPermission, ADMIN } = require('../server/auth');
const authController = require('../../controllers/version2/authController');


// user login
router.post('/auth/user/login', authController.userLogin);

// admin login
router.post('/auth/admin/login', checkPermission([ADMIN]), authController.adminLogin);


module.exports = router;