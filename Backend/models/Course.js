const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId:  { type: String, unique: true },
    name:      { type: String, required: [true, 'Course name is required'], trim: true },
    code:      { type: String, required: [true, 'Course code is required'], unique: true, uppercase: true },
    dept:      { type: String, required: [true, 'Department is required'] },
    duration:  { type: String, default: '3 years' },
    seats:     { type: Number, required: true, min: 1 },
    enrolled:  { type: Number, default: 0 },
    fees:      { type: Number, required: true, min: 0 },
    description: { type: String },
    syllabus:  { type: String },
    headOfDept:{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    status:    { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

courseSchema.pre('save', async function (next) {
    if (this.isNew && !this.courseId) {
        const count = await mongoose.model('Course').countDocuments();
        this.courseId = `CRS${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

courseSchema.virtual('availableSeats').get(function () {
    return this.seats - this.enrolled;
});

module.exports = mongoose.model('Course', courseSchema);