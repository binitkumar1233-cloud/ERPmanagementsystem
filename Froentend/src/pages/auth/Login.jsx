import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, BookOpen, Shield, Users, BarChart2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Logo from '../../components/common/Logo.jsx';

const FEATURES = [
    { icon: Users, title: 'Student Management', desc: 'Complete lifecycle from admission to graduation' },
    { icon: BookOpen, title: 'Course & Attendance', desc: 'Track classes, marks and daily attendance' },
    { icon: BarChart2, title: 'Analytics & Reports', desc: 'Real-time insights across all departments' },
    { icon: Shield, title: 'Secure & Reliable', desc: 'Role-based access with full audit logs' },
];

export default function Login() {
    const { login, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(firebaseError(err.code) || err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError(firebaseError(err.code) || err.message || 'Google sign-in failed.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const firebaseError = (code) => ({
        'auth/user-not-found':       'No account found with this email.',
        'auth/wrong-password':       'Incorrect password.',
        'auth/invalid-credential':   'Invalid email or password.',
        'auth/too-many-requests':    'Too many attempts. Try again later.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    }[code]);

    return (
        <div className="login-root">

            {/* ── Left Panel ── */}
            <div className="login-panel">
                <div className="login-panel-inner">

                    {/* Brand */}
                    <div className="lp-brand">
                        <Logo variant="icon" size="sm" />
                        <div>
                            <div className="lp-brand-name">EduManage ERP</div>
                            <div className="lp-brand-tag">Professional School Management</div>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="lp-hero">
                        <h1>Manage your institution<br /><span className="lp-accent">smarter, faster.</span></h1>
                        <p>An all-in-one platform for schools and colleges to manage students, staff, courses, fees and results from a single dashboard.</p>
                    </div>

                    {/* Feature list */}
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

                    <p className="lp-footer">Trusted by 200+ institutions · 50,000+ students managed</p>
                </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="login-form-side">
                <div className="login-form-wrap">

                    <div className="lf-header">
                        <h2>Welcome back</h2>
                        <p>Sign in to your administrator account</p>
                    </div>

                    {error && (
                        <div className="lf-error">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="lf-form">
                        {/* Email */}
                        <div className="field">
                            <label>Email Address <span className="req">*</span></label>
                            <input
                                type="email"
                                required
                                autoFocus
                                placeholder="admin@yourschool.edu"
                                value={form.email}
                                onChange={set('email')}
                            />
                        </div>

                        {/* Password */}
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

                        {/* Remember + Forgot */}
                        <div className="lf-meta">
                            <label className="lf-remember">
                                <input type="checkbox" /> Remember me
                            </label>
                            <Link to="/forgot-password" className="lf-forgot">Forgot password?</Link>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary btn-lg lf-submit" disabled={loading || googleLoading}>
                            {loading
                                ? <><span className="spinner" /> Signing in…</>
                                : <><span>Sign In</span> <ArrowRight size={16} /></>
                            }
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="lf-divider">
                        <span>or</span>
                    </div>

                    {/* Google Sign-In */}
                    <button className="btn-google" onClick={handleGoogle} disabled={loading || googleLoading}>
                        {googleLoading ? (
                            <><span className="spinner spinner-dark" /> Signing in…</>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    {/* Demo hint */}
                    <div className="lf-demo">
                        <p className="lf-demo-label">Demo credentials</p>
                        <div className="lf-demo-row">
                            <span>any@email.com</span>
                            <span>any password</span>
                        </div>
                    </div>

                    <div className="login-switch">
                        <p>Need student access?</p>
                        <Link to="/student-login" className="btn btn-outline">Go to Student Portal</Link>
                    </div>
                </div>
            </div>

            <style>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          background: white;
        }
        /* ── Left panel ── */
        .login-panel {
          flex: 1;
          background: var(--bg-sidebar);
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
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%);
          top: -100px; right: -100px;
          pointer-events: none;
        }
        .login-panel::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%);
          bottom: -60px; left: -60px;
          pointer-events: none;
        }
        .login-panel-inner {
          max-width: 440px;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .lp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 52px;
        }
        .lp-logo {
          width: 42px; height: 42px;
          border-radius: 10px;
          background: var(--primary);
          color: white;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 12px rgba(30,64,175,0.5);
          flex-shrink: 0;
        }
        .lp-brand-name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          color: white;
        }
        .lp-brand-tag {
          font-size: 0.68rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }
        .lp-hero { margin-bottom: 40px; }
        .lp-hero h1 {
          font-size: 2.4rem;
          color: white;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .lp-accent { color: var(--accent); }
        .lp-hero p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
        }
        .lp-features {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 48px;
        }
        .lp-feature {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .lp-feat-icon {
          width: 30px; height: 30px;
          border-radius: 7px;
          background: rgba(30,64,175,0.3);
          border: 1px solid rgba(30,64,175,0.5);
          color: #93c5fd;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .lp-feat-title { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 2px; }
        .lp-feat-desc  { font-size: 0.74rem; color: rgba(255,255,255,0.38); line-height: 1.4; }
        .lp-footer {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        /* ── Right form ── */
        .login-form-side {
          width: 460px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #f8fafc;
        }
        .login-form-wrap { width: 100%; max-width: 360px; }
        .lf-header { margin-bottom: 28px; }
        .lf-header h2 { font-size: 1.7rem; margin-bottom: 6px; }
        .lf-header p  { font-size: 0.85rem; color: var(--text-muted); }
        .lf-error {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.83rem;
          color: var(--danger);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .lf-form { display: flex; flex-direction: column; gap: 16px; }
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .pw-toggle {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: grid;
          place-items: center;
          transition: var(--transition);
        }
        .pw-toggle:hover { color: var(--text-primary); }
        .lf-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lf-remember {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          cursor: pointer;
        }
        .lf-forgot { font-size: 0.82rem; color: var(--primary); font-weight: 500; }
        .lf-forgot:hover { text-decoration: underline; }
        .lf-submit { width: 100%; justify-content: center; }
        .lf-demo {
          margin-top: 24px;
          padding: 14px;
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .lf-demo-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .lf-demo-row {
          display: flex;
          gap: 8px;
        }
        .lf-demo-row span {
          font-size: 0.78rem;
          background: var(--bg);
          padding: 4px 10px;
          border-radius: var(--radius-xs);
          color: var(--text-secondary);
          font-family: monospace;
          border: 1px solid var(--border);
        }
        .lf-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .lf-divider::before,
        .lf-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 11px 0;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--border);
          background: white;
          color: var(--text-primary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
        }
        .btn-google:hover { background: var(--bg); border-color: #94a3b8; }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
        .spinner-dark {
          border-color: #334155;
          border-top-color: transparent;
        }
        .login-switch {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        .login-switch p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .btn-outline {
          background: transparent;
          color: var(--primary);
          border: 1.5px solid var(--primary);
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          font-size: 0.92rem;
          font-weight: 700;
          transition: var(--transition);
        }
        .btn-outline:hover {
          background: rgba(30, 64, 175, 0.08);
        }
        @media (max-width: 900px) {
          .login-panel      { display: none; }
          .login-form-side  { width: 100%; }
        }
      `}</style>
        </div>
    );
}