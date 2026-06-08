const router = require('express').Router();
const Hostel = require('../models/Hostel');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

router.get('/stats', async (req, res, next) => {
    try {
        const rooms = await Hostel.find();
        const total    = rooms.reduce((s, r) => s + r.capacity, 0);
        const occupied = rooms.reduce((s, r) => s + r.occupied, 0);
        res.json({ success: true, data: { totalRooms: rooms.length, totalBeds: total, occupied, available: total - occupied } });
    } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
    try {
        const { status, block } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (block)  filter.block = block;
        const rooms = await Hostel.find(filter).populate('students', 'name studentId').sort({ block: 1, roomNumber: 1 });
        res.json({ success: true, count: rooms.length, data: rooms });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const room = await Hostel.findById(req.params.id).populate('students', 'name studentId course');
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, data: room });
    } catch (err) { next(err); }
});

router.post('/', log('Added hostel room', 'Hostel'), async (req, res, next) => {
    try {
        const room = await Hostel.create(req.body);
        res.status(201).json({ success: true, data: room });
    } catch (err) { next(err); }
});

router.put('/:id', log('Updated hostel room', 'Hostel'), async (req, res, next) => {
    try {
        const room = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
        res.json({ success: true, data: room });
    } catch (err) { next(err); }
});

router.delete('/:id', log('Deleted hostel room', 'Hostel'), async (req, res, next) => {
    try {
        await Hostel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Room deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
