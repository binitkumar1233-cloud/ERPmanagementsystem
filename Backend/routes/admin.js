const router = require('express').Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Course = require('../models/Course');
const ActivityLog = require('../models/ActivityLog');
const { FeeStructure } = require('../models/Fee');
const { protect, adminOnly } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

/* GET /api/admin/dashboard — overview stats */
router.get('/dashboard', async (req, res, next) => {
    try {
        const [admins, students, teachers, courses, recentLogs] = await Promise.all([
            User.countDocuments({ status: 'Active' }),
            Student.countDocuments(),
            Teacher.countDocuments({ status: 'Active' }),
            Course.countDocuments({ status: 'Active' }),
            ActivityLog.find().sort({ createdAt: -1 }).limit(10),
        ]);
        res.json({ success: true, data: { admins, students, teachers, courses, recentLogs } });
    } catch (err) { next(err); }
});

/* ── Admin Users (Super Admin / Admin only) ── */

router.get('/users', adminOnly, async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) { next(err); }
});

router.get('/users/:id', adminOnly, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) { next(err); }
});

router.post('/users', adminOnly, log('Added admin user', 'Admin'), async (req, res, next) => {
    try {
        if (!req.body.password) req.body.password = 'Admin@123';
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user, message: 'Admin user created' });
    } catch (err) { next(err); }
});

router.put('/users/:id', adminOnly, log('Updated admin user', 'Admin'), async (req, res, next) => {
    try {
        delete req.body.password; // password change via /auth/change-password only
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err) { next(err); }
});

router.delete('/users/:id', adminOnly, log('Deleted admin user', 'Admin'), async (req, res, next) => {
    try {
        if (req.params.id === req.user._id.toString())
            return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) { next(err); }
});

/* ── Fee Structures ── */

router.get('/fee-structures', async (req, res, next) => {
    try {
        const structures = await FeeStructure.find().sort({ year: -1 });
        res.json({ success: true, count: structures.length, data: structures });
    } catch (err) { next(err); }
});

router.post('/fee-structures', adminOnly, log('Added fee structure', 'Fees'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.create(req.body);
        res.status(201).json({ success: true, data: structure });
    } catch (err) { next(err); }
});

router.put('/fee-structures/:id', adminOnly, log('Updated fee structure', 'Fees'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
        res.json({ success: true, data: structure });
    } catch (err) { next(err); }
});

router.delete('/fee-structures/:id', adminOnly, log('Deleted fee structure', 'Fees'), async (req, res, next) => {
    try {
        await FeeStructure.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Fee structure deleted' });
    } catch (err) { next(err); }
});

/* ── Activity Logs ── */

router.get('/logs', async (req, res, next) => {
    try {
        const { module, severity, user, from, to, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (module)   filter.module = module;
        if (severity) filter.severity = severity;
        if (user)     filter.userName = new RegExp(user, 'i');
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to)   filter.createdAt.$lte = new Date(to);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [logs, total] = await Promise.all([
            ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            ActivityLog.countDocuments(filter),
        ]);
        res.json({ success: true, count: logs.length, total, data: logs });
    } catch (err) { next(err); }
});

/* ── System info ── */

router.get('/system', adminOnly, (req, res) => {
    res.json({
        success: true,
        data: {
            version: 'EduManage v2.0.0',
            node: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            env: process.env.NODE_ENV,
        },
    });
});

module.exports = router;
