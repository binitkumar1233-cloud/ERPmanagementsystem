const router = require('express').Router();
const Exam = require('../models/Exam');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

router.get('/', async (req, res, next) => {
    try {
        const { course, status, examType } = req.query;
        const filter = {};
        if (course)   filter.course = course;
        if (status)   filter.status = status;
        if (examType) filter.examType = examType;
        const exams = await Exam.find(filter).populate('invigilator', 'name dept').sort({ date: 1 });
        res.json({ success: true, count: exams.length, data: exams });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const exam = await Exam.findById(req.params.id).populate('invigilator', 'name');
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (err) { next(err); }
});

router.post('/', log('Scheduled exam', 'Exams'), async (req, res, next) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json({ success: true, data: exam, message: 'Exam scheduled' });
    } catch (err) { next(err); }
});

router.put('/:id', log('Updated exam', 'Exams'), async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
        res.json({ success: true, data: exam });
    } catch (err) { next(err); }
});

router.delete('/:id', log('Deleted exam', 'Exams'), async (req, res, next) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Exam deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
