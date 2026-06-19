const http   = require('http');
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initSocket } = require('./socket');

const authRoutes       = require('./routes/auth');
const studentRoutes    = require('./routes/students');
const teacherRoutes    = require('./routes/teachers');
const courseRoutes     = require('./routes/courses');
const feeRoutes        = require('./routes/fees');
const attendanceRoutes = require('./routes/attendance');
const resultRoutes     = require('./routes/results');
const admissionRoutes  = require('./routes/admissions');
const transportRoutes  = require('./routes/transport');
const hostelRoutes     = require('./routes/hostel');
const inventoryRoutes  = require('./routes/inventory');
const lmsRoutes        = require('./routes/lms');
const examRoutes       = require('./routes/exams');
const adminRoutes      = require('./routes/admin');
const supportRoutes    = require('./routes/support');
const paymentRoutes    = require('./routes/payments');

connectDB();

const app = express();

/* ── Core Middleware ── */
app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (curl, Postman, mobile apps)
        if (!origin) return cb(null, true);
        // Allow any localhost port for local development
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
        // Allow Firebase Hosting domains (*.web.app, *.firebaseapp.com)
        if (/^https:\/\/[a-zA-Z0-9-]+\.web\.app$/.test(origin)) return cb(null, true);
        if (/^https:\/\/[a-zA-Z0-9-]+\.firebaseapp\.com$/.test(origin)) return cb(null, true);
        // Allow configured production CLIENT_URL(s)
        const allowed = (process.env.CLIENT_URL || '').split(',').map(s => s.trim()).filter(Boolean);
        if (allowed.some(o => origin.startsWith(o))) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

/* ── Routes ── */
app.use('/api/auth',       authRoutes);
app.use('/api/students',   studentRoutes);
app.use('/api/teachers',   teacherRoutes);
app.use('/api/courses',    courseRoutes);
app.use('/api/fees',       feeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/results',    resultRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/transport',  transportRoutes);
app.use('/api/hostel',     hostelRoutes);
app.use('/api/inventory',  inventoryRoutes);
app.use('/api/lms',        lmsRoutes);
app.use('/api/exams',      examRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/support',    supportRoutes);
app.use('/api/payments',   paymentRoutes);

/* ── Health Check ── */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'EduManage API is running',
        version: '2.0.0',
        timestamp: new Date(),
    });
});

/* ── 404 handler ── */
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

/* ── Global Error Handler ── */
app.use(errorHandler);

/* ── HTTP server + Socket.io ── */
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`\n🚀  EduManage API running on http://localhost:${PORT}`);
    console.log(`⚡  Socket.io real-time enabled`);
    console.log(`    Env: ${process.env.NODE_ENV}`);
    console.log(`    DB:  ${process.env.MONGO_URI}\n`);
});
