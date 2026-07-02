const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const socketHandler = require('./services/socketService');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: { origin: CLIENT_URL, credentials: true }
});

app.set('io', io);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' });
app.use('/api/', limiter);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

socketHandler(io);

const { startCronJobs } = require('./services/cronService');
startCronJobs(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server, io };
