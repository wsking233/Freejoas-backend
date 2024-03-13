const express = require('express');
const freejoasController = require('../controllers/freejoasController');
const { verifyToken, checkPermission } = require('../server/auth');
const router = express.Router();

// upload a freejoa
router.post('/upload', verifyToken, freejoasController.uploadFreejoa);   //test passed

// get all freejoas
router.get('/all',verifyToken, freejoasController.getAllFreejoas);  //test passed

// get freejoa by ID
router.get('/find',verifyToken, freejoasController.getFreejoaByID);   //test passed

// update a freejoa
router.patch('/update',verifyToken, freejoasController.updateFreejoa);  //test passed

// delete a freejoa with a specific ID
router.delete('/delete',verifyToken, checkPermission(["admin"]), freejoasController.deleteFreejoa); //test passed


module.exports = router;