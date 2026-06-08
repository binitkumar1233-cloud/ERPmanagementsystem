const router = require('express').Router();
const Result = require('../models/Result');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

/* GET /api/results */
router.get('/', async (req, res, next) => {
    try {
        const { student, course, semester, academicYear, examType } = req.query;
        const filter = {};
        if (student)      filter.student = student;
        if (course)       filter.course = course;
        if (semester)     filter.semester = semester;
        if (academicYear) filter.academicYear = academicYear;
        if (examType)     filter.examType = examType;

        const results = await Result.find(filter)
            .populate('student', 'name studentId course year')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: results.length, data: results });
    } catch (err) { next(err); }
});

/* GET /api/results/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const result = await Result.findById(req.params.id).populate('student', 'name studentId');
        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
});

/* POST /api/results */
router.post('/', log('Published result', 'Results'), async (req, res, next) => {
    try {
        const result = await Result.create({ ...req.body, publishedAt: new Date() });
        res.status(201).json({ success: true, data: result, message: 'Result published' });
    } catch (err) { next(err); }
});

/* PUT /api/results/:id */
router.put('/:id', log('Updated result', 'Results'), async (req, res, next) => {
    try {
        const result = await Result.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
        res.json({ success: true, data: result });
    } catch (err) { next(err); }
});

/* DELETE /api/results/:id */
router.delete('/:id', log('Deleted result', 'Results'), async (req, res, next) => {
    try {
        await Result.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Result deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
