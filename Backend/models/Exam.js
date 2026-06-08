const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title:       { type: String, required: [true, 'Exam title is required'] },
    course:      { type: String, required: true },
    subject:     { type: String, required: true },
    examType:    { type: String, enum: ['Mid-term', 'Final', 'Internal', 'Supplementary', 'Quiz'], default: 'Final' },
    date:        { type: Date, required: true },
    startTime:   { type: String },
    duration:    { type: Number, default: 180 },
    venue:       { type: String },
    totalMarks:  { type: Number, default: 100 },
    passingMarks:{ type: Number, default: 40 },
    invigilator: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    status:      { type: String, enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'], default: 'Scheduled' },
    instructions:{ type: String },
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
