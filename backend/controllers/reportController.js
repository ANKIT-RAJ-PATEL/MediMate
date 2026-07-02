const cloudinary = require('cloudinary').v2;
const Report = require('../models/Report');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, { folder: 'medimind/reports' });

    const report = await Report.create({
      user: req.user._id,
      title: req.body.title || 'Medical Report',
      reportType: req.body.reportType || 'other',
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype.split('/')[1],
      ocrStatus: 'pending'
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { user: req.user._id, isDeleted: false };

    if (req.query.reportType) filter.reportType = req.query.reportType;

    const reports = await Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Report.countDocuments(filter);

    res.json({ success: true, reports, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDeleted: true }, { new: true }
    );
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExtractedData = async (reportId, extractedText, structuredData) => {
  return await Report.findByIdAndUpdate(reportId, {
    extractedText, structuredData, ocrStatus: 'completed'
  }, { new: true });
};

exports.updateAIAnalysis = async (reportId, aiAnalysis) => {
  return await Report.findByIdAndUpdate(reportId, {
    aiAnalysis, analysisStatus: 'completed'
  }, { new: true });
};
