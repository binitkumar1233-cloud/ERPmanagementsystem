const mongoose = require('mongoose');

const subjectResultSchema = new mongoose.Schema({
    subject:     { type: String, required: true },
    maxMarks:    { type: Number, default: 100 },
    marksObtained: { type: Number, required: true },
    grade:       { type: String },
    isPassed:    { type: Boolean, default: true },
}, { _id: false });

subjectResultSchema.pre('validate', function () {
    const percent = (this.marksObtained / this.maxMarks) * 100;
    if (percent >= 90)      this.grade = 'A+';
    else if (percent >= 80) this.grade = 'A';
    else if (percent >= 70) this.grade = 'B+';
    else if (percent >= 60) this.grade = 'B';
    else if (percent >= 50) this.grade = 'C';
    else if (percent >= 40) this.grade = 'D';
    else                    this.grade = 'F';
    this.isPassed = percent >= 40;
});

const resultSchema = new mongoose.Schema({
    student:      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course:       { type: String, required: true },
    semester:     { type: String, required: true },
    academicYear: { type: String, required: true },
    examType:     { type: String, enum: ['Mid-term', 'Final', 'Internal', 'Supplementary'], default: 'Final' },
    subjects:     [subjectResultSchema],
    totalMarks:   { type: Number },
    obtainedMarks:{ type: Number },
    percentage:   { type: Number },
    cgpa:         { type: Number },
    result:       { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' },
    publishedAt:  { type: Date },
}, { timestamps: true });

resultSchema.pre('save', function (next) {
    if (this.subjects?.length) {
        this.totalMarks    = this.subjects.reduce((s, r) => s + r.maxMarks, 0);
        this.obtainedMarks = this.subjects.reduce((s, r) => s + r.marksObtained, 0);
        this.percentage    = parseFloat(((this.obtainedMarks / this.totalMarks) * 100).toFixed(2));
        this.cgpa          = parseFloat((this.percentage / 9.5).toFixed(2));
        this.result        = this.subjects.every(r => r.isPassed) ? 'Pass' : 'Fail';
    }
    next();
});

module.exports = mongoose.model('Result', resultSchema);
