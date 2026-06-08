import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, AlertCircle, Mail, Lock, Shield } from 'lucide-react';
import { authService } from '../../services/authService.js';

export default function ForgotPasswordStudent() {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // 'email', 'verification', 'reset'
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authService.sendPasswordResetEmail(email, 'student');
            setSuccess('✓ Verification code sent to your email.');
            setTimeout(() => {
                setStep('verification');
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }

        try {
            await authService.verifyResetCode(email, verificationCode, 'student');
            setSuccess('✓ Code verified successfully.');
            setTimeout(() => {
                setStep('reset');
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Invalid verification code.');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, verificationCode, newPassword, 'student');
            setSuccess('✓ Password reset successfully! Redirecting...');
            setTimeout(() => {
                navigate('/student-login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Email', 'Verification', 'Reset'];

    return (
        <div className="login-root">
            <div className="login-panel">
                <div className="login-panel-inner">
                    <div className="lp-brand">
                        <div className="lp-logo">
                            <BookOpen size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="lp-brand-name">EduManage ERP</div>
                            <div className="lp-brand-tag">Student portal access</div>
                        </div>
                    </div>

                    <div className="lp-hero">
                        <h1>Secure password reset<br /><span className="lp-accent">Regain access in minutes.</span></h1>
                        <p>Complete the verification process to set a new password for your student account.</p>
                    </div>

                    <div className="lp-features">
                        <div className="lp-feature">
                            <div className="lp-feat-icon">
                                <Shield size={15} />
                            </div>
                            <div>
                                <div className="lp-feat-title">Encrypted Process</div>
                                <div className="lp-feat-desc">All communications are encrypted and secure.</div>
                            </div>
                        </div>
                        <div className="lp-feature">
                            <div className="lp-feat-icon">
                                <Mail size={15} />
                            </div>
                            <div>
                                <div className="lp-feat-title">Email Verification</div>
                                <div className="lp-feat-desc">Verification code sent instantly to your email.</div>
                            </div>
                        </div>
                        <div className="lp-feature">
                            <div className="lp-feat-icon">
                                <Check size={15} />
                            </div>
                            <div>
                                <div className="lp-feat-title">Quick & Easy</div>
                                <div className="lp-feat-desc">Complete reset in just a few simple steps.</div>
                            </div>
                        </div>
                    </div>

                    <p className="lp-footer">Your account security is our priority</p>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-form-wrap">
                    <Link to="/student-login" className="forgot-back">
                        <ArrowLeft size={16} /> Back to login
                    </Link>

                    {/* Progress Steps */}
                    <div className="progress-steps">
                        {steps.map((s, idx) => (
                            <div key={idx} className={`step ${step === s.toLowerCase() ? 'active' : ''} ${
                                (step === 'email' && idx === 0) || 
                                (step === 'verification' && idx <= 1) || 
                                (step === 'reset' && idx <= 2) ? 'completed' : ''
                            }`}>
                                <div className="step-circle">{idx + 1}</div>
                                <span className="step-label">{s}</span>
                            </div>
                        ))}
                    </div>

                    <div className="lf-header">
                        <h2>Reset your password</h2>
                        <p>
                            {step === 'email' && 'Enter your email to receive a verification code'}
                            {step === 'verification' && 'Enter the 6-digit code from your email'}
                            {step === 'reset' && 'Create a new password for your account'}
                        </p>
                    </div>

                    {error && (
                        <div className="lf-alert lf-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="lf-alert lf-success">
                            <Check size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Email Step */}
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="lf-form">
                            <div className="form-group">
                                <label htmlFor="email">Student Email Address</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        placeholder="student@yourschool.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <p className="input-hint">We'll send a 6-digit verification code to this email</p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg lf-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner" />
                                        Sending reset code…
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <Mail size={16} style={{ marginLeft: '8px' }} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Verification Step */}
                    {step === 'verification' && (
                        <form onSubmit={handleVerificationSubmit} className="lf-form">
                            <div className="form-group">
                                <label htmlFor="code">Verification Code</label>
                                <div className="code-input-group">
                                    <input
                                        id="code"
                                        type="text"
                                        required
                                        autoFocus
                                        maxLength="6"
                                        placeholder="000000"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                        className="code-input"
                                    />
                                </div>
                                <p className="input-hint">Enter the 6-digit code sent to {email}</p>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg lf-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner" />
                                        Verifying…
                                    </>
                                ) : (
                                    <>
                                        Verify Code
                                        <Check size={16} style={{ marginLeft: '8px' }} />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary btn-lg"
                                onClick={() => setStep('email')}
                            >
                                Back to Email
                            </button>
                        </form>
                    )}

                    {/* Password Reset Step */}
                    {step === 'reset' && (
                        <form onSubmit={handlePasswordReset} className="lf-form">
                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        autoFocus
                                        placeholder="At least 8 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <p className="input-hint">Minimum 8 characters recommended</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm">Confirm Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input
                                        id="confirm"
                                        type="password"
                                        required
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg lf-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="spinner" />
                                        Resetting…
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <Lock size={16} style={{ marginLeft: '8px' }} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          background: white;
        }
        .login-panel {
          flex: 1;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .login-panel::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30, 64, 175, 0.3) 0%, transparent 70%);
          top: -150px;
          right: -150px;
          pointer-events: none;
        }
        .login-panel::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
          pointer-events: none;
        }
        .login-panel-inner {
          max-width: 480px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .lp-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 56px;
        }
        .lp-logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: #93c5fd;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .lp-brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .lp-brand-tag {
          font-size: 0.88rem;
          color: rgba(248, 250, 252, 0.7);
          font-weight: 500;
        }
        .lp-hero {
          margin-bottom: 48px;
        }
        .lp-hero h1 {
          font-size: 2.6rem;
          line-height: 1.1;
          margin-bottom: 16px;
          color: #ffffff;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .lp-accent {
          color: #60a5fa;
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-hero p {
          font-size: 1rem;
          color: rgba(248, 250, 252, 0.8);
          line-height: 1.7;
          font-weight: 500;
        }
        .lp-features {
          margin-top: 48px;
          display: grid;
          gap: 20px;
        }
        .lp-feature {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .lp-feat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.12);
          display: grid;
          place-items: center;
          color: #93c5fd;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
        }
        .lp-feat-title {
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
          font-size: 0.95rem;
        }
        .lp-feat-desc {
          font-size: 0.88rem;
          color: rgba(248, 250, 252, 0.75);
          line-height: 1.6;
        }
        .lp-footer {
          margin-top: 48px;
          color: rgba(248, 250, 252, 0.6);
          font-size: 0.85rem;
          font-weight: 500;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .login-form-side {
          width: 520px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 48px 40px;
          background: #f8fafc;
        }
        .login-form-wrap {
          width: 100%;
          max-width: 400px;
        }
        .forgot-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
          font-size: 0.95rem;
          margin-bottom: 32px;
          cursor: pointer;
          transition: all var(--transition);
          font-weight: 600;
          padding: 8px 0;
        }
        .forgot-back:hover {
          color: var(--primary-dark);
          gap: 12px;
        }
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          position: relative;
          padding: 0 8px;
        }
        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 8px;
          right: 8px;
          height: 2px;
          background: var(--border);
          z-index: 0;
        }
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
          flex: 1;
        }
        .step-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: white;
          border: 2.5px solid var(--border);
          display: grid;
          place-items: center;
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
        }
        .step.active .step-circle {
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 0 0 8px rgba(30, 64, 175, 0.1), 0 2px 8px rgba(30, 64, 175, 0.15);
          transform: scale(1.08);
        }
        .step.completed .step-circle {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.2);
        }
        .step-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .step.active .step-label,
        .step.completed .step-label {
          color: var(--primary);
        }
        .lf-header {
          margin-bottom: 28px;
        }
        .lf-header h2 {
          font-size: 1.8rem;
          margin-bottom: 8px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .lf-header p {
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 500;
        }
        .lf-alert {
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          animation: slideDown 0.3s ease;
          backdrop-filter: blur(4px);
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .lf-error {
          background: rgba(220, 38, 38, 0.08);
          color: #7f1d1d;
          border: 1.5px solid rgba(220, 38, 38, 0.25);
        }
        .lf-success {
          background: rgba(5, 150, 105, 0.08);
          color: #065f46;
          border: 1.5px solid rgba(5, 150, 105, 0.25);
        }
        .lf-alert svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .form-group {
          margin-bottom: 24px;
        }
        .form-group label {
          display: block;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text-primary);
          font-size: 0.95rem;
          letter-spacing: -0.2px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
          flex-shrink: 0;
        }
        .input-field {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 12px 14px 12px 48px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
          background: white;
          color: var(--text-primary);
          font-weight: 500;
        }
        .input-field:hover {
          border-color: #cbd5e1;
        }
        .input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1), 0 2px 8px rgba(30, 64, 175, 0.08);
        }
        .input-field::placeholder {
          color: var(--text-muted);
        }
        .code-input-group {
          position: relative;
        }
        .code-input {
          width: 100%;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 16px 14px;
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 14px;
          text-align: center;
          outline: none;
          transition: all 0.2s ease;
          background: white;
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
        }
        .code-input:hover {
          border-color: #cbd5e1;
        }
        .code-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1), 0 2px 8px rgba(30, 64, 175, 0.08);
        }
        .input-hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 8px;
          line-height: 1.5;
          font-weight: 500;
        }
        .lf-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lf-submit {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 4px;
          font-weight: 700;
          font-size: 0.98rem;
          letter-spacing: -0.2px;
        }
        .btn-secondary {
          background: white;
          color: var(--text-primary);
          border: 1.5px solid var(--border);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 700;
          font-size: 0.98rem;
        }
        .btn-secondary:hover {
          background: var(--bg);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
        }
        .btn-primary {
          background: linear-gradient(135deg, #1e40af 0%, #1530a0 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.25);
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.35);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-lg {
          padding: 13px 24px;
          font-size: 0.98rem;
        }
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 980px) {
          .login-root {
            flex-direction: column;
          }
          .login-form-side {
            width: 100%;
          }
          .lp-hero h1 {
            font-size: 2rem;
          }
        }
      `}</style>
        </div>
    );
}
