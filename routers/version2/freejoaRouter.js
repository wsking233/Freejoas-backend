/**
 *  freejoa Router
 * @version 2
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../../server/auth');
const freejoasController = require('../../controllers/freejoasController');

// create a new freejoa
router.post('', verifyToken, freejoasController.createFreejoa);


// get all freejoas or find freejoa by ID
router.get('', verifyToken, freejoasController.getAllFreejoas);


module.exports = router;