const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { getAdminStats, getAllUsers, updateUserStatus, approveDoctor, rejectDoctor, getPendingDoctors, getDiseaseStats } = require('../controllers/adminController');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);
router.get('/doctors/pending', protect, authorize('admin'), getPendingDoctors);
router.put('/doctors/:id/approve', protect, authorize('admin'), approveDoctor);
router.put('/doctors/:id/reject', protect, authorize('admin'), rejectDoctor);
router.get('/disease-stats', protect, authorize('admin'), getDiseaseStats);

module.exports = router;
