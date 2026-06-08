const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacherId:   { type: String, unique: true },
    name:        { type: String, required: [true, 'Name is required'], trim: true },
    email:       { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
    phone:       { type: String },
    dept:        { type: String, required: [true, 'Department is required'] },
    designation: { type: String, enum: ['Lecturer', 'Asst. Prof.', 'Assoc. Prof.', 'Professor', 'HOD'], default: 'Lecturer' },
    qualification: { type: String },
    experience:  { type: Number, default: 0 },
    subjects:    [{ type: String }],
    address:     { type: String },
    dob:         { type: Date },
    gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
    salary:      { type: Number },
    joinDate:    { type: Date, default: Date.now },
    status:      { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
    photo:       { type: String },
}, { timestamps: true });

teacherSchema.pre('save', async function (next) {
    if (this.isNew && !this.teacherId) {
        const count = await mongoose.model('Teacher').countDocuments();
        this.teacherId = `TCH${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
