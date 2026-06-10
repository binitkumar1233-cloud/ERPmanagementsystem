const router = require('express').Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');
const { broadcastStats, broadcastNotification, broadcastActivity } = require('../socket');

router.use(protect);

/* GET /api/students/stats */
router.get('/stats', async (req, res, next) => {
    try {
        const [total, active, byFees, byCourse] = await Promise.all([
            Student.countDocuments(),
            Student.countDocuments({ status: 'Active' }),
            Student.aggregate([{ $group: { _id: '$fees', count: { $sum: 1 } } }]),
            Student.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]),
        ]);
        res.json({ success: true, data: { total, active, byFees, byCourse } });
    } catch (err) { next(err); }
});

/* GET /api/students/search?q= */
router.get('/search', async (req, res, next) => {
    try {
        const q = req.query.q || '';
        const regex = new RegExp(q, 'i');
        const students = await Student.find({
            $or: [{ name: regex }, { email: regex }, { studentId: regex }, { course: regex }],
        }).limit(20).select('-password');
        res.json({ success: true, count: students.length, data: students });
    } catch (err) { next(err); }
});

/* GET /api/students */
router.get('/', async (req, res, next) => {
    try {
        const { status, course, year, fees, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (course)  filter.course = course;
        if (year)    filter.year = year;
        if (fees)    filter.fees = fees;

        const skip = (Number(page) - 1) * Number(limit);
        const [students, total] = await Promise.all([
            Student.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Student.countDocuments(filter),
        ]);
        res.json({ success: true, count: students.length, total, page: Number(page), data: students });
    } catch (err) { next(err); }
});

/* GET /api/students/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).select('-password');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, data: student });
    } catch (err) { next(err); }
});

/* POST /api/students */
router.post('/', log('Added new student', 'Students'), async (req, res, next) => {
    try {
        const student = await Student.create(req.body);
        broadcastStats();
        broadcastNotification('student_added', `New student added: ${student.name}`, { id: student._id, name: student.name });
        broadcastActivity('student', `${student.name} enrolled in ${student.course || 'a course'}`);
        res.status(201).json({ success: true, data: student, message: 'Student added successfully' });
    } catch (err) { next(err); }
});

/* PUT /api/students/:id */
router.put('/:id', log('Updated student record', 'Students'), async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        broadcastStats();
        broadcastNotification('student_updated', `Student record updated: ${student.name}`, { id: student._id });
        broadcastActivity('student', `Student record updated: ${student.name}`);
        res.json({ success: true, data: student, message: 'Student updated successfully' });
    } catch (err) { next(err); }
});

/* DELETE /api/students/:id */
router.delete('/:id', log('Deleted student record', 'Students'), async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
        broadcastStats();
        broadcastNotification('student_deleted', `Student removed: ${student.name}`, { id: student._id });
        broadcastActivity('student', `Student removed from records: ${student.name}`);
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (err) { next(err); }
});

module.exports = router;
