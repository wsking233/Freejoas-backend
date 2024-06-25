const express = require('express');
const router = express.Router();
const { verifyToken, checkPermission, ADMIN } = require('../server/auth');
const pendingFreejoaController = require('../controllers/pendingFreejoaController');


// get all pending freejoas
router.get('/pending/freejoas/all', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.getAllUploadRequest); //only admin can get all pending freejoas

// approve pending freejoas
router.patch('/pending/freejoas/approve', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.approvePendingFreejoas); //only admin can approve pending freejoas

// reject pending freejoas
router.delete('/pending/freejoas/reject', verifyToken, checkPermission([ADMIN]), pendingFreejoaController.rejectPendingFreejoas); //only admin can reject pending freejoas


module.exports = router;