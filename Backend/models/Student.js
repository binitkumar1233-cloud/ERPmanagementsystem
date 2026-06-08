const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId:  { type: String, unique: true },
    name:       { type: String, required: [true, 'Name is required'], trim: true },
    email:      { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
    password:   { type: String, default: 'Student@123', select: false },
    phone:      { type: String, trim: true },
    course:     { type: String, required: [true, 'Course is required'] },
    year:       { type: String, enum: ['1st', '2nd', '3rd', '4th'], default: '1st' },
    section:    { type: String, default: 'A' },
    rollNumber: { type: String },
    dob:        { type: Date },
    gender:     { type: String, enum: ['Male', 'Female', 'Other'] },
    address:    { type: String },
    parentName: { type: String },
    parentPhone:{ type: String },
    fees:       { type: String, enum: ['Paid', 'Pending', 'Partial', 'Overdue'], default: 'Pending' },
    status:     { type: String, enum: ['Active', 'Inactive', 'Alumni'], default: 'Active' },
    photo:      { type: String },
    admissionDate: { type: Date, default: Date.now },
}, { timestamps: true });

studentSchema.pre('save', async function (next) {
    if (this.isNew && !this.studentId) {
        const count = await mongoose.model('Student').countDocuments();
        this.studentId = `STU${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);
