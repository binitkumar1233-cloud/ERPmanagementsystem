const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeNumber: { type: String, required: true, unique: true },
    routeName:   { type: String, required: true },
    stops:       [{ stopName: String, time: String, fare: Number }],
    driver:      { name: String, phone: String, license: String },
    vehicle:     { number: String, type: String, capacity: Number },
    status:      { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Transport', routeSchema);
