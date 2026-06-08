const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    roomNumber:   { type: String, required: true, unique: true },
    block:        { type: String, required: true },
    floor:        { type: Number },
    type:         { type: String, enum: ['Single', 'Double', 'Triple', 'Dormitory'], default: 'Double' },
    capacity:     { type: Number, default: 2 },
    occupied:     { type: Number, default: 0 },
    monthlyRent:  { type: Number },
    amenities:    [{ type: String }],
    students:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    warden:       { name: String, phone: String },
    status:       { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' },
}, { timestamps: true });

hostelSchema.virtual('available').get(function () {
    return this.capacity - this.occupied;
});

module.exports = mongoose.model('Hostel', hostelSchema);
