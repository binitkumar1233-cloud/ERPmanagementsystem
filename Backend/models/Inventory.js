const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemId:    { type: String, unique: true },
    name:      { type: String, required: [true, 'Item name is required'], trim: true },
    category:  { type: String, required: true, enum: ['Electronics', 'Furniture', 'Stationery', 'Sports', 'Lab Equipment', 'Books', 'Other'] },
    quantity:  { type: Number, required: true, min: 0, default: 0 },
    unit:      { type: String, default: 'pcs' },
    minStock:  { type: Number, default: 5 },
    location:  { type: String },
    supplier:  { type: String },
    unitPrice: { type: Number },
    totalValue:{ type: Number },
    purchaseDate: { type: Date },
    condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor'], default: 'Good' },
    status:    { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
}, { timestamps: true });

inventorySchema.pre('save', async function (next) {
    if (this.isNew && !this.itemId) {
        const count = await mongoose.model('Inventory').countDocuments();
        this.itemId = `INV${String(count + 1).padStart(4, '0')}`;
    }
    if (this.quantity !== undefined && this.unitPrice) {
        this.totalValue = this.quantity * this.unitPrice;
    }
    if (this.quantity === 0) this.status = 'Out of Stock';
    else if (this.quantity <= this.minStock) this.status = 'Low Stock';
    else this.status = 'In Stock';
    next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
