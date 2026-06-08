const mongoose = require('mongoose');

// Fee structure per course
const feeStructureSchema = new mongoose.Schema({
    course:    { type: String, required: true },
    tuition:   { type: Number, default: 0 },
    lab:       { type: Number, default: 0 },
    library:   { type: Number, default: 0 },
    sports:    { type: Number, default: 0 },
    total:     { type: Number, default: 0 },
    year:      { type: String, required: true },
    status:    { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

feeStructureSchema.pre('save', function (next) {
    this.total = (this.tuition || 0) + (this.lab || 0) + (this.library || 0) + (this.sports || 0);
    next();
});

// Fee collection record per student
const feeRecordSchema = new mongoose.Schema({
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course:      { type: String },
    amount:      { type: Number, required: true },
    type:        { type: String, enum: ['Tuition', 'Lab', 'Library', 'Sports', 'Full', 'Partial'], default: 'Full' },
    paymentMode: { type: String, enum: ['Cash', 'Online', 'Cheque', 'DD'], default: 'Online' },
    transactionId: { type: String },
    academicYear:{ type: String },
    semester:    { type: String },
    status:      { type: String, enum: ['Paid', 'Pending', 'Partial', 'Overdue'], default: 'Pending' },
    dueDate:     { type: Date },
    paidDate:    { type: Date },
    remarks:     { type: String },
}, { timestamps: true });

module.exports = {
    FeeStructure: mongoose.model('FeeStructure', feeStructureSchema),
    FeeRecord:    mongoose.model('FeeRecord', feeRecordSchema),
};
