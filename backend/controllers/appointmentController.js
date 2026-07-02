const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, timeSlot, reason, consultationType } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const appointment = await Appointment.create({
      patient: req.user._id, doctor: doctorId, appointmentDate, timeSlot,
      reason, consultationType, amount: doctor.consultationFee
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'patient') filter.patient = req.user._id;
    else if (req.user.role === 'doctor') {
      const doc = await Doctor.findOne({ user: req.user._id });
      filter.doctor = doc?._id;
    }
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email avatar' } })
      .sort({ appointmentDate: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, { status, cancellationReason }, { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, { prescription: req.body, status: 'completed' }, { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableDoctors = async (req, res) => {
  try {
    const { specialization, city, experience, page = 1, limit = 10 } = req.query;
    const filter = { isApproved: true, isVerified: true };
    if (specialization) filter.specialization = specialization;

    let query = Doctor.find(filter).populate('user', 'name email avatar');
    if (city) query = query.where('hospital').regex(new RegExp(city, 'i'));
    if (experience) query = query.where('experience').gte(parseInt(experience));

    const doctors = await query.skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Doctor.countDocuments(filter);

    res.json({ success: true, doctors, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
