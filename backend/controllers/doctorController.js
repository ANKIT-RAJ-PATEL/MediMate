const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');
const User = require('../models/User');

exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email avatar phone');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate({ user: req.user._id }, req.body, { new: true, runValidators: true });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorPatients = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    const appointments = await Appointment.find({ doctor: doctor._id }).populate('patient', 'name email phone avatar');
    const uniquePatients = [...new Map(appointments.map(a => [a.patient._id.toString(), a.patient])).values()];
    res.json({ success: true, patients: uniquePatients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.params.patientId, isDeleted: false })
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSlotAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    doctor.availableSlots = req.body.slots;
    await doctor.save();
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
