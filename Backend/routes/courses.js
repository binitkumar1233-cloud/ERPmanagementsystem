const router = require('express').Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

/* GET /api/courses/stats */
router.get('/stats', async (req, res, next) => {
    try {
        const [total, active, byDept] = await Promise.all([
            Course.countDocuments(),
            Course.countDocuments({ status: 'Active' }),
            Course.aggregate([{ $group: { _id: '$dept', count: { $sum: 1 }, totalSeats: { $sum: '$seats' }, totalEnrolled: { $sum: '$enrolled' } } }]),
        ]);
        res.json({ success: true, data: { total, active, byDept } });
    } catch (err) { next(err); }
});

/* GET /api/courses */
router.get('/', async (req, res, next) => {
    try {
        const { status, dept } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (dept)   filter.dept = dept;
        const courses = await Course.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, count: courses.length, data: courses });
    } catch (err) { next(err); }
});

/* GET /api/courses/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate('headOfDept', 'name email');
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, data: course });
    } catch (err) { next(err); }
});

/* POST /api/courses */
router.post('/', log('Added new course', 'Courses'), async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course, message: 'Course added successfully' });
    } catch (err) { next(err); }
});

/* PUT /api/courses/:id */
router.put('/:id', log('Updated course', 'Courses'), async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, data: course, message: 'Course updated successfully' });
    } catch (err) { next(err); }
});

/* DELETE /api/courses/:id */
router.delete('/:id', log('Deleted course', 'Courses'), async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (err) { next(err); }
});

module.exports = router;
