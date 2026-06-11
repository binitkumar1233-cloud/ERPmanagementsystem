const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const protect = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized — no token' });
    }
    try {
        const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);

        // Check User collection first (admins), then Student collection
        let user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const student = await Student.findById(decoded.id).select('-password');
            if (student) {
                user = {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    role: 'Student',
                    status: student.status,
                };
            }
        }

        if (!user) return res.status(401).json({ success: false, message: 'User not found' });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
};

const adminOnly = (req, res, next) => {
    if (!['Super Admin', 'Admin'].includes(req.user?.role)) {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

module.exports = { protect, adminOnly };
