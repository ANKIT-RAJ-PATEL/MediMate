const { CronJob } = require('cron');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/email');
const User = require('../models/User');

const checkMedicineReminders = async (io) => {
  try {
    const now = new Date();
    const currentHour = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];

    const medicines = await Medicine.find({
      isActive: true,
      days: currentDay,
      times: currentHour
    }).populate('user');

    for (const med of medicines) {
      if (!med.user) continue;
      const takenToday = med.history?.some(h => {
        const hDate = new Date(h.scheduledTime);
        return hDate.toDateString() === now.toDateString() && h.action === 'taken';
      });

      if (!takenToday) {
        await Notification.create({
          user: med.user._id,
          type: 'medicine_reminder',
          title: `Time to take ${med.name}`,
          message: `Reminder: Take ${med.dosage} of ${med.name}`,
          link: '/medicines'
        });

        if (io) {
          io.to(med.user._id.toString()).emit('notification', {
            type: 'medicine_reminder',
            title: `Time to take ${med.name}`,
            message: `Take ${med.dosage} of ${med.name}`
          });
        }

        if (med.user.email) {
          await sendEmail({
            to: med.user.email,
            subject: `Medicine Reminder: ${med.name}`,
            html: `<h2>Medicine Reminder</h2><p>It's time to take <strong>${med.name}</strong> (${med.dosage}).</p><p>Instructions: ${med.instructions || 'None'}</p>`
          });
        }
      }
    }
  } catch (error) {
    console.error('Medicine reminder error:', error);
  }
};

const startCronJobs = (io) => {
  const medicineReminder = new CronJob('* * * * *', () => checkMedicineReminders(io));
  medicineReminder.start();
  console.log('Cron jobs started');
};

module.exports = { startCronJobs, checkMedicineReminders };
