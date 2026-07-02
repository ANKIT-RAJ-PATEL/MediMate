const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { bookAppointment, getAppointments, updateAppointmentStatus, addPrescription, getAvailableDoctors } = require('../controllers/appointmentController');

router.post('/book', protect, bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/prescription', protect, authorize('doctor'), addPrescription);
router.get('/doctors', protect, getAvailableDoctors);

module.exports = router;
