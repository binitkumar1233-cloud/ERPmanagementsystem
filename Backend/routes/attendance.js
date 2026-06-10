const router = require('express').Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');
const { broadcastStats, broadcastNotification, broadcastActivity } = require('../socket');

router.use(protect);

/* POST /api/attendance/bulk — mark attendance for a class */
router.post('/bulk', log('Marked attendance', 'Attendance'), async (req, res, next) => {
    try {
        const { records } = req.body; // [{ student, course, subject, date, status }]
        if (!Array.isArray(records) || !records.length)
            return res.status(400).json({ success: false, message: 'Records array is required' });

        const enriched = records.map(r => ({ ...r, markedBy: req.user._id }));
        const result = await Attendance.insertMany(enriched, { ordered: false });
        broadcastStats();
        broadcastNotification('attendance_marked', `Attendance marked for ${result.length} student(s)`, { count: result.length });
        broadcastActivity('attendance', `Attendance marked for ${result.length} student(s)`);
        res.status(201).json({ success: true, count: result.length, message: 'Attendance marked' });
    } catch (err) { next(err); }
});

/* GET /api/attendance?student=&course=&from=&to= */
router.get('/', async (req, res, next) => {
    try {
        const { student, course, from, to, date } = req.query;
        const filter = {};
        if (student) filter.student = student;
        if (course)  filter.course = course;
        if (date)    filter.date = new Date(date);
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to)   filter.date.$lte = new Date(to);
        }
        const records = await Attendance.find(filter)
            .populate('student', 'name studentId')
            .sort({ date: -1 })
            .limit(500);
        res.json({ success: true, count: records.length, data: records });
    } catch (err) { next(err); }
});

/* GET /api/attendance/report/:studentId */
router.get('/report/:studentId', async (req, res, next) => {
    try {
        const { course, from, to } = req.query;
        const filter = { student: req.params.studentId };
        if (course) filter.course = course;
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to)   filter.date.$lte = new Date(to);
        }
        const records = await Attendance.find(filter).sort({ date: 1 });
        const total   = records.length;
        const present = records.filter(r => r.status === 'Present').length;
        const absent  = records.filter(r => r.status === 'Absent').length;
        const late    = records.filter(r => r.status === 'Late').length;
        const percentage = total ? parseFloat(((present / total) * 100).toFixed(2)) : 0;

        res.json({ success: true, data: { total, present, absent, late, percentage, records } });
    } catch (err) { next(err); }
});

/* DELETE /api/attendance/:id */
router.delete('/:id', log('Deleted attendance record', 'Attendance'), async (req, res, next) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Record deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
