const Report = require('../models/Report');
const Prediction = require('../models/Prediction');
const Appointment = require('../models/Appointment');
const Medicine = require('../models/Medicine');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const reports = await Report.countDocuments({ user: userId, isDeleted: false });
    const predictions = await Prediction.countDocuments({ user: userId });
    const appointments = await Appointment.countDocuments({ patient: userId, status: { $in: ['pending', 'confirmed'] } });
    const medicines = await Medicine.countDocuments({ user: userId, isActive: true });

    const recentReports = await Report.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 }).limit(5);
    const upcomingAppointments = await Appointment.find({ patient: userId, status: { $in: ['pending', 'confirmed'] } })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .sort({ appointmentDate: 1 }).limit(5);
    const recentPredictions = await Prediction.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true, stats: { reports, predictions, appointments, medicines },
      recentReports, upcomingAppointments, recentPredictions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHealthTimeline = async (req, res) => {
  try {
    const userId = req.user._id;
    const reports = await Report.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 }).limit(20);
    const predictions = await Prediction.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
    const appointments = await Appointment.find({ patient: userId }).sort({ appointmentDate: -1 }).limit(20);
    const medicines = await Medicine.find({ user: userId }).sort({ createdAt: -1 }).limit(20);

    const timeline = [
      ...reports.map(r => ({ type: 'report', title: r.title, date: r.createdAt, data: r })),
      ...predictions.map(p => ({ type: 'prediction', title: `${p.modelType} prediction`, date: p.createdAt, data: p })),
      ...appointments.map(a => ({ type: 'appointment', title: 'Doctor Appointment', date: a.appointmentDate, data: a })),
      ...medicines.map(m => ({ type: 'medicine', title: m.name, date: m.createdAt, data: m }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, timeline });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHealthTrends = async (req, res) => {
  try {
    const userId = req.user._id;
    const reports = await Report.find({ user: userId, isDeleted: false }).sort({ createdAt: 1 });

    const trends = { bloodSugar: [], cholesterol: [], bloodPressure: [], weight: [], bmi: [] };
    reports.forEach(report => {
      if (report.structuredData?.parameters) {
        report.structuredData.parameters.forEach(param => {
          const val = parseFloat(param.value);
          if (!isNaN(val)) {
            const entry = { date: report.createdAt, value: val, name: param.name };
            if (param.name.toLowerCase().includes('glucose') || param.name.toLowerCase().includes('sugar'))
              trends.bloodSugar.push(entry);
            if (param.name.toLowerCase().includes('cholesterol'))
              trends.cholesterol.push(entry);
            if (param.name.toLowerCase().includes('blood pressure') || param.name.toLowerCase().includes('bp'))
              trends.bloodPressure.push(entry);
          }
        });
      }
    });

    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
