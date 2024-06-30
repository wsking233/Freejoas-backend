const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../server/auth');
const pendingFreejoaController = require('../controllers/pendingFreejoaController');


// get all pending freejoas
router.get('/pending/freejoa/all', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.getAllUploadRequest); // test passed

// approve pending freejoas
router.patch('/pending/freejoa/approve', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.approvePendingFreejoas); // test passed

// reject pending freejoas
router.delete('/pending/freejoa/reject', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.rejectPendingFreejoas);


module.exports = router;