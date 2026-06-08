const router = require('express').Router();
const Transport = require('../models/Transport');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

router.get('/', async (req, res, next) => {
    try {
        const routes = await Transport.find().sort({ routeNumber: 1 });
        res.json({ success: true, count: routes.length, data: routes });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const route = await Transport.findById(req.params.id);
        if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, data: route });
    } catch (err) { next(err); }
});

router.post('/', log('Added transport route', 'Transport'), async (req, res, next) => {
    try {
        const route = await Transport.create(req.body);
        res.status(201).json({ success: true, data: route, message: 'Route added' });
    } catch (err) { next(err); }
});

router.put('/:id', log('Updated transport route', 'Transport'), async (req, res, next) => {
    try {
        const route = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, data: route });
    } catch (err) { next(err); }
});

router.delete('/:id', log('Deleted transport route', 'Transport'), async (req, res, next) => {
    try {
        await Transport.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Route deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
