const router  = require('express').Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

/* POST /api/support/chat-message */
router.post('/chat-message', async (req, res, next) => {
    try {
        const { name, email, message, time } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

        await transporter.sendMail({
            from:    `"EduManage Chat" <${process.env.GMAIL_USER}>`,
            to:      process.env.GMAIL_USER,
            subject: `💬 New Live Chat Message — EduManage Support`,
            html: `
                <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#7c3aed,#9d5cf6);padding:24px 28px;">
                        <h2 style="color:white;margin:0;font-size:20px;">💬 New Live Chat Message</h2>
                        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">EduManage Support Center</p>
                    </div>
                    <div style="padding:28px;">
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <tr>
                                <td style="padding:8px 0;color:#64748b;width:110px;font-weight:600;">From</td>
                                <td style="padding:8px 0;color:#0f172a;">${name || 'Anonymous User'}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;font-weight:600;">Email</td>
                                <td style="padding:8px 0;color:#0f172a;">${email || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;font-weight:600;">Time</td>
                                <td style="padding:8px 0;color:#0f172a;">${time || new Date().toLocaleString('en-IN')}</td>
                            </tr>
                        </table>
                        <div style="margin-top:20px;background:#f8fafc;border-left:4px solid #7c3aed;border-radius:4px;padding:16px 18px;">
                            <p style="margin:0;color:#0f172a;font-size:15px;line-height:1.6;">${message}</p>
                        </div>
                        <p style="margin-top:24px;font-size:12px;color:#94a3b8;">This message was sent via the EduManage Live Chat widget.</p>
                    </div>
                </div>
            `,
        });

        res.json({ success: true, message: 'Notification sent' });
    } catch (err) { next(err); }
});

module.exports = router;
