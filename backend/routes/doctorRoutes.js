const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { getDoctorProfile, updateDoctorProfile, getDoctorPatients, getDoctorAppointments, getPatientReports, updateSlotAvailability } = require('../controllers/doctorController');

router.get('/profile', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.get('/patients', protect, authorize('doctor'), getDoctorPatients);
router.get('/appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/patient/:patientId/reports', protect, authorize('doctor'), getPatientReports);
router.put('/slots', protect, authorize('doctor'), updateSlotAvailability);

module.exports = router;
