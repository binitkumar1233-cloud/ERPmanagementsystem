const router = require('express').Router();
const Admission = require('../models/Admission');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

/* POST /api/admissions — public, no auth required */
router.post('/', async (req, res, next) => {
    try {
        const admission = await Admission.create(req.body);
        res.status(201).json({
            success: true,
            data: { applicationId: admission.applicationId, status: admission.status },
            message: 'Application submitted successfully',
        });
    } catch (err) { next(err); }
});

router.use(protect);

/* GET /api/admissions */
router.get('/', async (req, res, next) => {
    try {
        const { status, course, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (course) filter.course = course;
        const skip = (Number(page) - 1) * Number(limit);
        const [admissions, total] = await Promise.all([
            Admission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            Admission.countDocuments(filter),
        ]);
        res.json({ success: true, count: admissions.length, total, data: admissions });
    } catch (err) { next(err); }
});

/* GET /api/admissions/:id */
router.get('/:id', async (req, res, next) => {
    try {
        const admission = await Admission.findById(req.params.id);
        if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, data: admission });
    } catch (err) { next(err); }
});

/* PATCH /api/admissions/:id/status */
router.patch('/:id/status', log('Updated admission status', 'Admissions'), async (req, res, next) => {
    try {
        const { status, remarks } = req.body;
        const admission = await Admission.findByIdAndUpdate(
            req.params.id,
            { status, remarks, reviewedBy: req.user._id, reviewedAt: new Date() },
            { new: true }
        );
        if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, data: admission, message: `Application ${status.toLowerCase()}` });
    } catch (err) { next(err); }
});

/* DELETE /api/admissions/:id */
router.delete('/:id', log('Deleted admission application', 'Admissions'), async (req, res, next) => {
    try {
        await Admission.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Application deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
