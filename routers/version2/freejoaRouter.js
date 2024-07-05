/**
 * Router for handling freejoa related routes.
 * @module freejoaRouter
 * @version 2
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../server/auth');
const freejoaController = require('../../controllers/version2/freejoaController');

/**
 * Route for creating a new freejoa.
 * @name POST /
 * @function
 * @memberof module:freejoaRouter
 * @inner
 * @param {string} path - Express route path
 * @param {function} middleware - Middleware function for verifying token
 * @param {function} controller - Controller function for creating a freejoa
 */
router.post('', verifyToken, freejoaController.uploadFreejoa);

/**
 * Route for getting all freejoas or finding a freejoa by ID.
 * @name GET /
 * @function
 * @memberof module:freejoaRouter
 * @inner
 * @param {string} path - Express route path
 * @param {function} middleware - Middleware function for verifying token
 * @param {function} controller - Controller function for getting all freejoas or finding a freejoa by ID
 */
router.get('', verifyToken, freejoaController.getFreejoasByIdOrAll);

module.exports = router;