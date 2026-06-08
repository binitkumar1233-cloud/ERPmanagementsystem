const router = require('express').Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middleware/auth');
const log = require('../middleware/logger');

router.use(protect);

router.get('/stats', async (req, res, next) => {
    try {
        const [total, lowStock, outOfStock, byCategory] = await Promise.all([
            Inventory.countDocuments(),
            Inventory.countDocuments({ status: 'Low Stock' }),
            Inventory.countDocuments({ status: 'Out of Stock' }),
            Inventory.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$totalValue' } } }]),
        ]);
        res.json({ success: true, data: { total, lowStock, outOfStock, byCategory } });
    } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
    try {
        const { category, status } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (status)   filter.status = status;
        const items = await Inventory.find(filter).sort({ name: 1 });
        res.json({ success: true, count: items.length, data: items });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (err) { next(err); }
});

router.post('/', log('Added inventory item', 'Inventory'), async (req, res, next) => {
    try {
        const item = await Inventory.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) { next(err); }
});

router.put('/:id', log('Updated inventory item', 'Inventory'), async (req, res, next) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (err) { next(err); }
});

router.delete('/:id', log('Deleted inventory item', 'Inventory'), async (req, res, next) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Item deleted' });
    } catch (err) { next(err); }
});

module.exports = router;
