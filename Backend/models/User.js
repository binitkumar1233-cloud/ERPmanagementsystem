const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:      { type: String, required: [true, 'Name is required'], trim: true },
    email:     { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password:  { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role:      { type: String, enum: ['Super Admin', 'Admin', 'Editor', 'Viewer'], default: 'Viewer' },
    dept:      { type: String, default: 'Management' },
    status:    { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLogin: { type: Date },
    resetCode: { type: String, select: false },
    resetCodeExpiry: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = function (entered) {
    return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
