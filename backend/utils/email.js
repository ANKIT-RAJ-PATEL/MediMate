const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html });
  } catch (error) {
    console.error('Email send error (non-critical):', error.message);
  }
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: email, subject: 'Verify Your MediMind Account',
    html: `<h1>Welcome to MediMind AI</h1><p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email, subject: 'Reset Your Password',
    html: `<h1>Password Reset</h1><p>Click <a href="${url}">here</a> to reset your password. Valid for 1 hour.</p>`
  });
};

const sendAppointmentEmail = async (email, doctorName, date, status) => {
  await sendEmail({
    to: email, subject: `Appointment ${status}`,
    html: `<h1>Appointment ${status}</h1><p>Your appointment with Dr. ${doctorName} on ${date} has been ${status}.</p>`
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendAppointmentEmail };
