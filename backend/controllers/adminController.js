const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Report = require('../models/Report');
const Appointment = require('../models/Appointment');
const Prediction = require('../models/Prediction');

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalReports = await Report.countDocuments({ isDeleted: false });
    const totalAppointments = await Appointment.countDocuments();
    const pendingDoctors = await Doctor.countDocuments({ isApproved: false });

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);
    const monthlyStats = await Appointment.aggregate([
      { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true, stats: { totalUsers, totalDoctors, totalPatients, totalReports, totalAppointments, pendingDoctors },
      recentUsers, monthlyStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const users = await User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: true, isVerified: true }, { new: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false }).populate('user', 'name email avatar');
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDiseaseStats = async (req, res) => {
  try {
    const predictions = await Prediction.aggregate([
      { $group: { _id: '$modelType', count: { $sum: 1 }, avgRisk: { $avg: '$result.riskPercentage' } } }
    ]);
    res.json({ success: true, stats: predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
