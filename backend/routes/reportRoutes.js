const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { uploadReport, getUserReports, getReportById, deleteReport } = require('../controllers/reportController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, PNG files are allowed'));
    }
  }
});

router.post('/upload', protect, upload.single('file'), uploadReport);
router.get('/', protect, getUserReports);
router.get('/:id', protect, getReportById);
router.delete('/:id', protect, deleteReport);

module.exports = router;
