const express = require('express');
const freejoasController = require('../controllers/freejoasController');
const router = express.Router();

// create a freejoa
router.post('/newfreejoa', freejoasController.createFreejoa);

// get all freejoas
router.get('/all', freejoasController.getAllFreejoas);

// get freejoa by ID
router.get('/:freejoaID', freejoasController.getFreejoaByID);

// update a freejoa
router.put('/:freejoaID', freejoasController.updateFreejoa);

// delete a freejoa with a specific ID
router.delete('/:freejoaID', freejoasController.deleteFreejoa);


module.exports = router;