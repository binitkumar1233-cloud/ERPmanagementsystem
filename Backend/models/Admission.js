const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    applicationId: { type: String, unique: true },
    name:          { type: String, required: [true, 'Name is required'], trim: true },
    email:         { type: String, required: [true, 'Email is required'], lowercase: true },
    phone:         { type: String, required: [true, 'Phone is required'] },
    dob:           { type: Date },
    gender:        { type: String, enum: ['Male', 'Female', 'Other'] },
    address:       { type: String },
    course:        { type: String, required: [true, 'Course is required'] },
    previousSchool:{ type: String },
    percentage:    { type: Number },
    parentName:    { type: String },
    parentPhone:   { type: String },
    documents:     [{ name: String, url: String }],
    status:        { type: String, enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Enrolled'], default: 'Pending' },
    remarks:       { type: String },
    reviewedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt:    { type: Date },
}, { timestamps: true });

admissionSchema.pre('save', async function (next) {
    if (this.isNew && !this.applicationId) {
        const count = await mongoose.model('Admission').countDocuments();
        this.applicationId = `APP${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Admission', admissionSchema);
