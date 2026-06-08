const router = require('express').Router();
const LMS = require('../models/LMS');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

router.get('/', async (req, res, next) => {
    try {
        const { course, status } = req.query;
        const filter = {};
        if (course) filter.course = course;
        if (status) filter.status = status;
        const modules = await LMS.find(filter).populate('teacher', 'name dept').sort({ createdAt: -1 });
        res.json({ success: true, count: modules.length, data: modules });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const module = await LMS.findById(req.params.id).populate('teacher', 'name');
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
        res.json({ success: true, data: module });
    } catch (err) { next(err); }
});

router.post('/', log('Created LMS module', 'LMS'), async (req, res, next) => {
    try {
        const module = await LMS.create(req.body);
        res.status(201).json({ success: true, data: module, message: 'Module created' });
    } catch (err) { next(err); }
});

router.put('/:id', log('Updated LMS module', 'LMS'), async (req, res, next) => {
    try {
        const module = await LMS.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
        res.json({ success: true, data: module });
    } catch (err) { next(err); }
});

/* POST /api/lms/:id/materials — add study material */
router.post('/:id/materials', log('Added study material', 'LMS'), async (req, res, next) => {
    try {
        const module = await LMS.findByIdAndUpdate(
            req.params.id,
            { $push: { materials: { ...req.body, uploadedBy: req.user._id } } },
            { new: true }
        );
        if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
        res.json({ success: true, data: module });
    } catch (err) { next(err); }
});

router.delete('/:id', log('Deleted LMS module', 'LMS'), async (req, res, next) => {
    try {
        await LMS.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Module deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
