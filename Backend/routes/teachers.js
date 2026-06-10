const router = require('express').Router();
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');
const { broadcastStats, broadcastNotification, broadcastActivity } = require('../socket');

router.use(protect);

/* GET /api/teachers/stats */
router.get('/stats', async (req, res, next) => {
    try {
        const [total, active, byDept, byDesignation] = await Promise.all([
            Teacher.countDocuments(),
            Teacher.countDocuments({ status: 'Active' }),
            Teacher.aggregate([{ $group: { _id: '$dept', count: { $sum: 1 } } }]),
            Teacher.aggregate([{ $group: { _id: '$designation', count: { $sum: 1 } } }]),
        ]);
        res.json({ success: true, data: { total, active, byDept, byDesignation } });
    } catch (err) { next(err); }
});

/* GET /api/teachers */
router.get('/', async (req, res, next) => {
    try {
        const { status, dept, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (dept)   filter.dept = dept;

        const skip = (Number(page) - 1) * Number(limit);
        const [teachers, total] = await Promise.all([
            Teacher.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Teacher.countDocuments(filter),
        ]);
        res.json({ success: true, count: teachers.length, total, data: teachers });
    } catch (err) { next(err); }
});

/* GET /api/teachers/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
        res.json({ success: true, data: teacher });
    } catch (err) { next(err); }
});

/* POST /api/teachers */
router.post('/', log('Added new teacher', 'Teachers'), async (req, res, next) => {
    try {
        const teacher = await Teacher.create(req.body);
        broadcastStats();
        broadcastNotification('teacher_added', `New teacher added: ${teacher.name}`, { id: teacher._id, name: teacher.name });
        broadcastActivity('teacher', `${teacher.name} joined as ${teacher.designation || 'Faculty'} — ${teacher.dept || 'Dept'}`);
        res.status(201).json({ success: true, data: teacher, message: 'Teacher added successfully' });
    } catch (err) { next(err); }
});

/* PUT /api/teachers/:id */
router.put('/:id', log('Updated teacher record', 'Teachers'), async (req, res, next) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
        broadcastStats();
        broadcastNotification('teacher_updated', `Teacher record updated: ${teacher.name}`, { id: teacher._id });
        broadcastActivity('teacher', `Teacher profile updated: ${teacher.name}`);
        res.json({ success: true, data: teacher, message: 'Teacher updated successfully' });
    } catch (err) { next(err); }
});

/* DELETE /api/teachers/:id */
router.delete('/:id', log('Deleted teacher record', 'Teachers'), async (req, res, next) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
        broadcastStats();
        broadcastNotification('teacher_deleted', `Teacher removed: ${teacher.name}`, { id: teacher._id });
        broadcastActivity('teacher', `Teacher record removed: ${teacher.name}`);
        res.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (err) { next(err); }
});

module.exports = router;
