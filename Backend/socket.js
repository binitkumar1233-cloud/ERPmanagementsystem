const Student    = require('./models/Student');
const Teacher    = require('./models/Teacher');
const { FeeRecord } = require('./models/Fee');
const Attendance = require('./models/Attendance');

let io = null;

function initSocket(httpServer) {
    const { Server } = require('socket.io');

    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);

        // Send full stats snapshot on connect
        sendStats(socket);

        socket.on('request:stats', () => sendStats(socket));

        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

async function sendStats(socket) {
    try {
        const [
            totalStudents,
            totalTeachers,
            feeRecords,
            attendanceToday,
        ] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            FeeRecord.find({}, 'amount status'),
            Attendance.find({ date: { $gte: todayStart() } }, 'status'),
        ]);

        const totalFeeCollected = feeRecords
            .filter(f => f.status === 'Paid')
            .reduce((sum, f) => sum + (f.amount || 0), 0);

        const totalFeePending = feeRecords
            .filter(f => f.status === 'Pending')
            .reduce((sum, f) => sum + (f.amount || 0), 0);

        const presentToday  = attendanceToday.filter(a => a.status === 'present').length;
        const totalToday    = attendanceToday.length;
        const attendancePct = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

        const stats = {
            totalStudents,
            totalTeachers,
            totalFeeCollected,
            totalFeePending,
            presentToday,
            totalToday,
            attendancePct,
            timestamp: new Date(),
        };

        socket.emit('stats:update', stats);
    } catch (err) {
        console.error('[Socket] sendStats error:', err.message);
    }
}

// Broadcast updated stats to ALL connected clients
async function broadcastStats() {
    if (!io) return;
    try {
        const [
            totalStudents,
            totalTeachers,
            feeRecords,
            attendanceToday,
        ] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            FeeRecord.find({}, 'amount status'),
            Attendance.find({ date: { $gte: todayStart() } }, 'status'),
        ]);

        const totalFeeCollected = feeRecords
            .filter(f => f.status === 'Paid')
            .reduce((sum, f) => sum + (f.amount || 0), 0);

        const totalFeePending = feeRecords
            .filter(f => f.status === 'Pending')
            .reduce((sum, f) => sum + (f.amount || 0), 0);

        const presentToday  = attendanceToday.filter(a => a.status === 'present').length;
        const totalToday    = attendanceToday.length;
        const attendancePct = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

        io.emit('stats:update', {
            totalStudents,
            totalTeachers,
            totalFeeCollected,
            totalFeePending,
            presentToday,
            totalToday,
            attendancePct,
            timestamp: new Date(),
        });
    } catch (err) {
        console.error('[Socket] broadcastStats error:', err.message);
    }
}

// Broadcast a notification to all clients
function broadcastNotification(type, message, data = {}) {
    if (!io) return;
    io.emit('notification', { type, message, data, timestamp: new Date() });
}

function todayStart() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

function getIO() { return io; }

module.exports = { initSocket, broadcastStats, broadcastNotification, getIO };
