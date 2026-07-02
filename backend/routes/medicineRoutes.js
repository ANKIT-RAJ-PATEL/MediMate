const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { addMedicine, getMedicines, updateMedicine, deleteMedicine, markTaken, getDueReminders } = require('../controllers/medicineController');

router.post('/', protect, addMedicine);
router.get('/', protect, getMedicines);
router.put('/:id', protect, updateMedicine);
router.delete('/:id', protect, deleteMedicine);
router.post('/:id/taken', protect, markTaken);
router.get('/reminders/due', protect, getDueReminders);

module.exports = router;
