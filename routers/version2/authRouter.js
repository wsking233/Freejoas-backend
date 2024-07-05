const express = require('express');
const router = express.Router();
const { checkPermission, ADMIN } = require('../../server/auth');
const authController = require('../../controllers/version2/authController');
/**
 * Auth Router
 * @version 2
 * 
 * This router handles authentication-related routes.
 */


/**
 * User Login
 * 
 * Route: POST /auth/user/login
 * Controller: authController.userLogin
 * 
 * Handles user login requests.
 */
router.post('/user/login', authController.userLogin);

/**
 * Admin Login
 * 
 * Route: POST /auth/admin/login
 * Middleware: checkPermission([ADMIN])
 * Controller: authController.adminLogin
 * 
 * Handles admin login requests. Requires admin permission.
 */
router.post('/admin/login', authController.adminLogin);

module.exports = router;