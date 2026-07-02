const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true }
    );
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, { isActive: false }, { new: true }
    );
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.json({ success: true, message: 'Medicine removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markTaken = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    medicine.history.push({ action: 'taken', scheduledTime: new Date(), actualTime: new Date() });
    await medicine.save();
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDueReminders = async (req, res) => {
  try {
    const now = new Date();
    const medicines = await Medicine.find({
      user: req.user._id, isActive: true,
      times: { $elemMatch: { $gte: `${now.getHours()}:${now.getMinutes()}` } }
    });
    res.json({ success: true, medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
