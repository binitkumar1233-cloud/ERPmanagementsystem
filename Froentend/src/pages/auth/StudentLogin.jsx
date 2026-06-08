import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Users, BarChart2, Shield } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Logo from '../../components/common/Logo.jsx';

const FEATURES = [
    { icon: Users, title: 'Attendance Tracker', desc: 'View your daily attendance instantly.' },
    { icon: BarChart2, title: 'Exam Results', desc: 'Check your latest marks and grade reports.' },
    { icon: Shield, title: 'Secure Access', desc: 'Safe login for every student with privacy in mind.' },
];

export default function StudentLogin() {
    const { loginStudent, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleGoogle = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            navigate('/student-dashboard');
        } catch (err) {
            setError(err.message || 'Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginStudent(form.email, form.password);
            navigate('/student-dashboard');
        } catch (err) {
            setError(err.message || 'Invalid student email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-root">
            <div className="login-panel">
                <div className="login-panel-inner">
                    <div className="lp-brand">
                        <Logo variant="icon" size="sm" />
                        <div>
                            <div className="lp-brand-name">EduManage ERP</div>
                            <div className="lp-brand-tag">Student portal access</div>
                        </div>
                    </div>

                    <div className="lp-hero">
                        <h1>Student access made easy<br /><span className="lp-accent">Study, fees, attendance, results.</span></h1>
                        <p>A secure portal for enrolled students to view their academic progress, fee status, and schedule from one place.</p>
                    </div>

                    <div className="lp-features">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div className="lp-feature" key={title}>
                                <div className="lp-feat-icon">
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <div className="lp-feat-title">{title}</div>
                                    <div className="lp-feat-desc">{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="lp-footer">Student portal available 24/7 · Secure access for every class</p>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-form-wrap">
                    <div className="lf-header">
                        <h2>Student login</h2>
                        <p>Enter your student account details to continue.</p>
                    </div>

                    {error && (
                        <div className="lf-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="lf-form">
                        <div className="field">
                            <label>Student Email <span className="req">*</span></label>
                            <input
                                type="email"
                                required
                                autoFocus
                                placeholder="student@yourschool.edu"
                                value={form.email}
                                onChange={set('email')}
                            />
                        </div>

                        <div className="field">
                            <label>Password <span className="req">*</span></label>
                            <div className="pw-wrap">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={set('password')}
                                />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    onClick={() => setShowPass(s => !s)}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="lf-meta">
                            <label className="lf-remember">
                                <input type="checkbox" /> Remember me
                            </label>
                            <Link to="/student-forgot-password" className="lf-forgot">Forgot password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg lf-submit" disabled={loading || googleLoading}>
                            {loading
                                ? <><span className="spinner" /> Signing in…</>
                                : <><span>Continue</span> <ArrowRight size={16} /></>
                            }
                        </button>
                    </form>

                    <div className="lf-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="btn-google"
                        onClick={handleGoogle}
                        disabled={loading || googleLoading}
                    >
                        {googleLoading ? (
                            <><span className="spinner spinner-dark" /> Signing in with Google…</>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Sign in with Google
                            </>
                        )}
                    </button>

                    <div className="lf-demo">
                        <p className="lf-demo-label">Student credentials</p>
                        <div className="lf-demo-row">
                            <span>student@example.com</span>
                            <span>student123</span>
                        </div>
                    </div>

                    <div className="login-switch">
                        <p>New student? <Link to="/student-register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link></p>
                    </div>

                    <div className="login-switch" style={{ marginTop: 0 }}>
                        <p>Need administrator access?</p>
                        <Link to="/login" className="btn btn-outline">Go to Admin Portal</Link>
                    </div>
                </div>
            </div>

            <style>{`
        .login-root { display: flex; min-height: 100vh; background: white; }
        .login-panel { flex: 1; background: var(--bg-sidebar); color: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative; overflow: hidden; }
        .login-panel::before { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; }
        .login-panel::after { content: ''; position: absolute; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%); bottom: -60px; left: -60px; pointer-events: none; }
        .login-panel-inner { max-width: 440px; width: 100%; position: relative; z-index: 1; }
        .lp-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 42px; }
        .lp-logo { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 14px; background: white; color: var(--primary); }
        .lp-brand-name { font-size: 1.1rem; font-weight: 700; color: #ffffff; }
        .lp-brand-tag { font-size: 0.95rem; color: rgba(248, 250, 252, 0.8); }
        .lp-hero h1 { font-size: clamp(2rem, 3vw, 3rem); line-height: 1.05; margin-bottom: 18px; color: #ffffff; }
        .lp-accent { color: #93c5fd; }
        .lp-hero p { max-width: 380px; font-size: 0.98rem; color: rgba(248, 250, 252, 0.75); line-height: 1.7; }
        .lp-features { margin-top: 40px; display: grid; gap: 16px; }
        .lp-feature { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: flex-start; }
        .lp-feat-icon { width: 36px; height: 36px; border-radius: 12px; background: rgba(255,255,255,0.18); display: grid; place-items: center; color: var(--primary); }
        .lp-feat-title { font-weight: 700; color: #ffffff; margin-bottom: 4px; }
        .lp-feat-desc { font-size: 0.92rem; color: rgba(248, 250, 252, 0.75); line-height: 1.5; }
        .lp-footer { margin-top: 32px; color: var(--text-muted); font-size: 0.88rem; }
        .login-form-side { width: 500px; display: flex; justify-content: center; align-items: center; padding: 32px; }
        .login-form-wrap { width: 100%; max-width: 380px; }
        .lf-header h2 { font-size: 2rem; margin-bottom: 6px; }
        .lf-header p { color: var(--text-muted); margin-bottom: 24px; }
        .lf-error { border-radius: 14px; background: rgba(248, 113, 113, 0.12); padding: 12px 16px; margin-bottom: 18px; color: #b91c1c; display: flex; gap: 8px; align-items: center; }
        .lf-form .field { margin-bottom: 18px; }
        .lf-form label { display: block; font-weight: 600; margin-bottom: 8px; color: var(--text-secondary); }
        .lf-form input { width: 100%; border: 1px solid #d1d5db; border-radius: 12px; padding: 14px 16px; font-size: 0.95rem; outline: none; }
        .pw-wrap { position: relative; }
        .pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .lf-meta { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 24px; }
        .lf-remember { display: flex; align-items: center; gap: 8px; font-size: 0.92rem; color: var(--text-muted); }
        .lf-forgot { color: var(--primary); text-decoration: none; font-size: 0.92rem; }
        .lf-submit { width: 100%; display: flex; justify-content: center; align-items: center; gap: 10px; }
        .lf-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--text-muted); font-size: 0.85rem; }
        .lf-divider::before, .lf-divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
        .btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 13px 20px; border-radius: 12px; border: 1.5px solid #e5e7eb; background: white; font-size: 0.95rem; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.18s ease; margin-bottom: 4px; }
        .btn-google:hover:not(:disabled) { border-color: #d1d5db; background: #f9fafb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner-dark { border-color: #d1d5db; border-top-color: #374151; }
        .lf-demo { margin-top: 28px; padding: 18px 20px; border-radius: 18px; background: rgba(98, 123, 255, 0.06); }
        .lf-demo-label { margin-bottom: 10px; font-weight: 700; color: var(--text-primary); }
        .lf-demo-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.95rem; color: var(--text-muted); }
        .login-switch { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .login-switch p { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
        .btn-outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); padding: 10px 18px; border-radius: var(--radius-sm); font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: var(--transition); text-decoration: none; display: inline-block; }
        .btn-outline:hover { background: var(--primary); color: white; }
        @media (max-width: 980px) { .login-root { flex-direction: column; } .login-form-side { width: 100%; } }
      `}</style>
        </div>
    );
}
