const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* POST /api/auth/login — admin login */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid email or password' });

        if (user.status !== 'Active')
            return res.status(403).json({ success: false, message: 'Account is inactive' });

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const token = signToken(user._id);
        res.json({
            success: true,
            token,
            data: {
                id: user._id, name: user.name, email: user.email,
                role: user.role, dept: user.dept, status: user.status,
            },
        });
    } catch (err) { next(err); }
});

/* POST /api/auth/login/student — student login */
router.post('/login/student', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required' });

        const student = await Student.findOne({ email }).select('+password');
        if (!student)
            return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const bcrypt = require('bcryptjs');
        const match = await bcrypt.compare(password, student.password).catch(() => password === student.password);
        if (!match)
            return res.status(401).json({ success: false, message: 'Invalid email or password' });

        if (student.status !== 'Active')
            return res.status(403).json({ success: false, message: 'Account is inactive' });

        const token = signToken(student._id);
        res.json({
            success: true,
            token,
            data: {
                id: student._id, name: student.name, email: student.email,
                role: 'Student', course: student.course, year: student.year,
                section: student.section, phone: student.phone,
                feesStatus: student.fees, studentId: student.studentId,
            },
        });
    } catch (err) { next(err); }
});

/* GET /api/auth/me */
router.get('/me', protect, (req, res) => {
    res.json({ success: true, data: req.user });
});

/* POST /api/auth/change-password */
router.post('/change-password', protect, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ success: false, message: 'Both fields are required' });
        if (newPassword.length < 8)
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.matchPassword(currentPassword)))
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) { next(err); }
});

/* POST /api/auth/forgot-password */
router.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'No account with that email' });

        const code = String(Math.floor(100000 + Math.random() * 900000));
        user.resetCode = code;
        user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // In production: send email with code
        console.log(`[RESET CODE] ${email}: ${code}`);
        res.json({ success: true, message: `Reset code sent to ${email}` });
    } catch (err) { next(err); }
});

/* POST /api/auth/verify-reset-code */
router.post('/verify-reset-code', async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email }).select('+resetCode +resetCodeExpiry');
        if (!user || user.resetCode !== code || user.resetCodeExpiry < Date.now())
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        res.json({ success: true, message: 'Code verified' });
    } catch (err) { next(err); }
});

/* POST /api/auth/reset-password */
router.post('/reset-password', async (req, res, next) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword)
            return res.status(400).json({ success: false, message: 'All fields are required' });
        if (newPassword.length < 8)
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });

        const user = await User.findOne({ email }).select('+resetCode +resetCodeExpiry');
        if (!user || user.resetCode !== code || user.resetCodeExpiry < Date.now())
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });

        user.password = newPassword;
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        await user.save();
        res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) { next(err); }
});

/* POST /api/auth/google — Google OAuth: find-or-create admin user, return backend JWT */
router.post('/google', async (req, res, next) => {
    try {
        const { uid, name, email, photo } = req.body;
        if (!uid || !email)
            return res.status(400).json({ success: false, message: 'uid and email are required' });

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: crypto.randomBytes(24).toString('hex'),
                role: 'Admin',
                dept: 'Management',
                status: 'Active',
            });
        }

        if (user.status !== 'Active')
            return res.status(403).json({ success: false, message: 'Account is inactive' });

        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        const token = signToken(user._id);
        res.json({
            success: true,
            token,
            data: {
                id: user._id, name: user.name, email: user.email,
                role: user.role, dept: user.dept, status: user.status,
                photo: photo || null,
            },
        });
    } catch (err) { next(err); }
});

/* POST /api/auth/register-student — public self-registration, no auth required */
router.post('/register-student', async (req, res, next) => {
    try {
        const { name, email, password, phone, course, year, section } = req.body;
        if (!name || !email || !password || !course)
            return res.status(400).json({ success: false, message: 'Name, email, password and course are required' });

        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(password, 12);

        const student = await Student.create({
            name,
            email,
            password: hashed,
            phone:   phone   || undefined,
            course,
            year:    year    || '1st',
            section: section || 'A',
        });

        const token = signToken(student._id);
        res.status(201).json({
            success: true,
            token,
            message: 'Student registered successfully',
            data: {
                id: student._id, name: student.name, email: student.email,
                role: 'Student', course: student.course, year: student.year,
                studentId: student.studentId,
            },
        });
    } catch (err) { next(err); }
});

module.exports = router;
