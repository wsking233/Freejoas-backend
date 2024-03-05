const express = require('express');
const freejoasController = require('../controllers/freejoasController');
const { verifyToken } = require('../server/auth');
const router = express.Router();

// upload a freejoa
router.post('/upload',verifyToken, freejoasController.uploadFreejoa);   //test passed

// get all freejoas
router.get('/all',verifyToken, freejoasController.getAllFreejoas);  //test passed

// get freejoa by ID
router.get('/:freejoaID',verifyToken, freejoasController.getFreejoaByID);   //test passed

// update a freejoa
router.patch('/:freejoaID',verifyToken, freejoasController.updateFreejoa);  //test passed


// admin user onlyi
// delete a freejoa with a specific ID
router.delete('/:freejoaID', freejoasController.deleteFreejoa); //test passed


module.exports = router;