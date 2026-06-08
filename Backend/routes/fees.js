const router = require('express').Router();
const { FeeStructure, FeeRecord } = require('../models/Fee');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');
const { broadcastStats, broadcastNotification } = require('../socket');

router.use(protect);

/* GET /api/fees/structures */
router.get('/structures', async (req, res, next) => {
    try {
        const structures = await FeeStructure.find().sort({ createdAt: -1 });
        res.json({ success: true, count: structures.length, data: structures });
    } catch (err) { next(err); }
});

/* POST /api/fees/structures */
router.post('/structures', log('Added fee structure', 'Fees'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.create(req.body);
        res.status(201).json({ success: true, data: structure, message: 'Fee structure added' });
    } catch (err) { next(err); }
});

/* PUT /api/fees/structures/:id */
router.put('/structures/:id', log('Updated fee structure', 'Fees'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
        res.json({ success: true, data: structure });
    } catch (err) { next(err); }
});

/* DELETE /api/fees/structures/:id */
router.delete('/structures/:id', log('Deleted fee structure', 'Fees'), async (req, res, next) => {
    try {
        const structure = await FeeStructure.findByIdAndDelete(req.params.id);
        if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
        res.json({ success: true, message: 'Fee structure deleted' });
    } catch (err) { next(err); }
});

/* GET /api/fees — fee records */
router.get('/', async (req, res, next) => {
    try {
        const { student, status, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (student) filter.student = student;
        if (status)  filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        const records = await FeeRecord.find(filter).populate('student', 'name studentId course').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
        res.json({ success: true, count: records.length, data: records });
    } catch (err) { next(err); }
});

/* POST /api/fees — collect fee */
router.post('/', log('Collected fee payment', 'Fees'), async (req, res, next) => {
    try {
        const record = await FeeRecord.create(req.body);
        if (req.body.student && req.body.status) {
            await Student.findByIdAndUpdate(req.body.student, { fees: req.body.status });
        }
        broadcastStats();
        broadcastNotification('fee_collected', `Fee payment recorded: ₹${record.amount}`, { amount: record.amount, status: record.status });
        res.status(201).json({ success: true, data: record, message: 'Fee recorded successfully' });
    } catch (err) { next(err); }
});

/* GET /api/fees/stats */
router.get('/stats', async (req, res, next) => {
    try {
        const [total, collected, pending] = await Promise.all([
            FeeRecord.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            FeeRecord.aggregate([{ $match: { status: 'Paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
            FeeRecord.countDocuments({ status: { $in: ['Pending', 'Overdue'] } }),
        ]);
        res.json({
            success: true,
            data: {
                totalAmount: total[0]?.total || 0,
                collected: collected[0]?.total || 0,
                pendingCount: pending,
            },
        });
    } catch (err) { next(err); }
});

module.exports = router;
