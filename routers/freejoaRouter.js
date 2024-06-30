const express = require('express');
const freejoasController = require('../controllers/freejoasController');
const { verifyToken, checkPermission, ADMIN } = require('../server/auth');
const router = express.Router();


// get all freejoas
router.get('/all',verifyToken, freejoasController.getAllFreejoas);  //test passed

// get freejoa by ID
router.get('/find/:freejoaId',verifyToken, freejoasController.getFreejoaByID);   //test passed

// upload a freejoa
router.post('/upload', verifyToken, freejoasController.uploadFreejoa);   //test passed

// update a freejoa
router.patch('/update', verifyToken, checkPermission([ADMIN]), freejoasController.updateFreejoa);  //test passed

// delete a freejoa with a specific ID
router.delete('/delete',verifyToken, checkPermission([ADMIN]), freejoasController.deleteFreejoa); //test passed


module.exports = router;