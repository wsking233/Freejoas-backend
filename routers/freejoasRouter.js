const express = require('express');
const freejoasController = require('../controllers/freejoasController');
const router = express.Router();

// upload a freejoa
router.post('/upload', freejoasController.uploadFreejoa);   //test passed

// get all freejoas
router.get('/all', freejoasController.getAllFreejoas);  //test passed

// get freejoa by ID
router.get('/:freejoaID', freejoasController.getFreejoaByID);   //test passed

// update a freejoa
router.patch('/:freejoaID', freejoasController.updateFreejoa);  //test passed

// delete a freejoa with a specific ID
router.delete('/:freejoaID', freejoasController.deleteFreejoa); //test passed


module.exports = router;