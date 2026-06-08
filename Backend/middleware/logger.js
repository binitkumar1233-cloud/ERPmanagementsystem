const ActivityLog = require('../models/ActivityLog');

const log = (action, module) => async (req, res, next) => {
    res.on('finish', async () => {
        if (res.statusCode < 400 && req.user) {
            try {
                await ActivityLog.create({
                    user: req.user._id,
                    userName: req.user.name,
                    action,
                    module,
                    ip: req.ip || req.connection.remoteAddress,
                    severity: ['DELETE'].includes(req.method) ? 'high'
                            : ['POST', 'PUT', 'PATCH'].includes(req.method) ? 'medium'
                            : 'low',
                });
            } catch { /* non-critical */ }
        }
    });
    next();
};

module.exports = log;
