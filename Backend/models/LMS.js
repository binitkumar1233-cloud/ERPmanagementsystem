const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    type:      { type: String, enum: ['Video', 'PDF', 'Document', 'Link', 'Assignment'], default: 'Document' },
    url:       { type: String },
    size:      { type: String },
    uploadedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    uploadedAt:{ type: Date, default: Date.now },
}, { _id: true });

const lmsSchema = new mongoose.Schema({
    title:      { type: String, required: [true, 'Title is required'] },
    course:     { type: String, required: true },
    subject:    { type: String, required: true },
    teacher:    { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    description:{ type: String },
    materials:  [materialSchema],
    assignments:[{
        title:     String,
        description: String,
        dueDate:   Date,
        maxMarks:  { type: Number, default: 100 },
        status:    { type: String, enum: ['Active', 'Closed'], default: 'Active' },
    }],
    status:     { type: String, enum: ['Active', 'Archived'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('LMS', lmsSchema);
