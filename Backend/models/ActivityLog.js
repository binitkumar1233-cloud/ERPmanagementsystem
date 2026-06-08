const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName:  { type: String },
    action:    { type: String, required: true },
    module:    { type: String, required: true },
    ip:        { type: String },
    severity:  { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    meta:      { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
