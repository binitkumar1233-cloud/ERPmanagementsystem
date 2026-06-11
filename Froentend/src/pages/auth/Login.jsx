import { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
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
    const { login, loginWithGoogle, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    // Already logged in — go straight to dashboard
    if (isAuthenticated || !!localStorage.getItem('erp_user')) {
        return <Navigate to="/dashboard" replace />;
    }

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
            // loginWithGoogle calls signInWithRedirect — browser navigates away to Google.
            // If it throws (e.g. auth/operation-not-allowed), the catch shows the error.
            await loginWithGoogle();
            // If we reach here the redirect is initiating — keep loading spinner visible
        } catch (err) {
            setError(firebaseError(err.code) || err.message || 'Google sign-in failed.');
            setGoogleLoading(false);
        }
    };

    const firebaseError = (code) => ({
        'auth/user-not-found':          'No account found with this email.',
        'auth/wrong-password':          'Incorrect password.',
        'auth/invalid-credential':      'Invalid email or password.',
        'auth/too-many-requests':       'Too many attempts. Try again later.',
        'auth/network-request-failed':  'Network error. Check your connection.',
        'auth/operation-not-allowed':   'Google sign-in is not enabled in this project. Enable it in Firebase Console → Authentication → Sign-in method.',
        'auth/unauthorized-domain':     'This domain is not authorised for Google sign-in. Add it in Firebase Console → Authentication → Settings → Authorized domains.',
        'auth/internal-error':          'An internal error occurred. Please try again.',
        'auth/popup-closed-by-user':    'Sign-in was cancelled.',
        'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    }[code]);

    return (
        <div className="login-root">

            {/* ── Left Panel ── */}
            <div className="login-panel">
                <div className="login-panel-grid" />
                <div className="login-panel-inner">

                    {/* Brand */}
                    <div className="lp-brand">
                        <div className="lp-logo-badge">
                            <Logo variant="icon" size="sm" />
                        </div>
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
          background: #eef2ff;
        }

        /* ── Left panel ── */
        .login-panel {
          flex: 1;
          background: linear-gradient(145deg, #0d1321 0%, #111827 30%, #1a0f3c 65%, #0a0e1a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        /* Large indigo orb top-right */
        .login-panel::before {
          content: '';
          position: absolute;
          width: 700px; height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, rgba(79,70,229,0.22) 0%, rgba(99,102,241,0.08) 45%, transparent 70%);
          top: -200px; right: -150px;
          pointer-events: none;
          animation: orbFloat1 11s ease-in-out infinite alternate;
        }

        /* Violet orb bottom-left */
        .login-panel::after {
          content: '';
          position: absolute;
          width: 550px; height: 550px;
          border-radius: 50%;
          background: radial-gradient(circle at 60% 60%, rgba(139,92,246,0.18) 0%, rgba(167,139,250,0.06) 45%, transparent 70%);
          bottom: -120px; left: -100px;
          pointer-events: none;
          animation: orbFloat2 14s ease-in-out infinite alternate;
        }

        @keyframes orbFloat1 {
          from { transform: translate(0,0) scale(1) rotate(0deg); }
          to   { transform: translate(-50px, 50px) scale(1.12) rotate(8deg); }
        }
        @keyframes orbFloat2 {
          from { transform: translate(0,0) scale(1) rotate(0deg); }
          to   { transform: translate(40px, -40px) scale(1.1) rotate(-6deg); }
        }

        /* Fine grid overlay */
        .login-panel-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
          z-index: 0;
        }

        /* Diagonal gloss strip */
        .login-panel-grid::after {
          content: '';
          position: absolute;
          top: -30%; right: -10%;
          width: 2px;
          height: 160%;
          background: linear-gradient(180deg, transparent, rgba(99,102,241,0.18), rgba(139,92,246,0.12), transparent);
          transform: rotate(-20deg);
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
          gap: 14px;
          margin-bottom: 56px;
        }
        .lp-logo-badge {
          width: 46px; height: 46px;
          border-radius: 13px;
          background: linear-gradient(135deg, #3730a3, #4f46e5, #6366f1);
          color: white;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 24px rgba(79,70,229,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .lp-brand-name {
          font-family: var(--font-display);
          font-size: 1.12rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.02em;
        }
        .lp-brand-tag {
          font-size: 0.64rem;
          color: rgba(165,180,252,0.55);
          margin-top: 3px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .lp-hero { margin-bottom: 44px; }
        .lp-hero h1 {
          font-size: 2.7rem;
          color: white;
          line-height: 1.12;
          margin-bottom: 18px;
          letter-spacing: -0.03em;
          font-family: var(--font-display);
          font-weight: 900;
        }
        .lp-accent {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-hero p {
          font-size: 0.87rem;
          color: rgba(255,255,255,0.42);
          line-height: 1.8;
          max-width: 360px;
        }

        .lp-features {
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-bottom: 52px;
        }
        .lp-feature {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 11px;
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(99,102,241,0.12);
          transition: background 0.2s;
        }
        .lp-feature:hover { background: rgba(99,102,241,0.08); }
        .lp-feat-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(67,56,202,0.5), rgba(79,70,229,0.35));
          border: 1px solid rgba(99,102,241,0.3);
          color: #a5b4fc;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .lp-feat-title { font-size: 0.83rem; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 2px; }
        .lp-feat-desc  { font-size: 0.7rem; color: rgba(255,255,255,0.3); line-height: 1.4; }

        .lp-footer {
          font-size: 0.69rem;
          color: rgba(255,255,255,0.18);
          padding-top: 20px;
          border-top: 1px solid rgba(99,102,241,0.1);
          letter-spacing: 0.03em;
        }

        /* ── Right form ── */
        .login-form-side {
          width: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          background: #eef2ff;
        }

        .login-form-wrap {
          width: 100%; max-width: 390px;
          background: white;
          border-radius: 22px;
          padding: 38px 34px;
          border: 1px solid rgba(224,228,240,0.8);
          box-shadow: 0 4px 6px rgba(79,70,229,0.04), 0 12px 40px rgba(79,70,229,0.08), 0 2px 4px rgba(15,23,42,0.04);
        }

        .lf-header { margin-bottom: 28px; }
        .lf-header h2 {
          font-size: 1.7rem; margin-bottom: 6px;
          font-family: var(--font-display);
          letter-spacing: -0.025em;
          background: linear-gradient(135deg, #0f172a, #4f46e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lf-header p { font-size: 0.83rem; color: var(--text-muted); }

        .lf-error {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.83rem;
          color: var(--danger);
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
          border-left: 3px solid var(--danger);
        }

        .lf-form { display: flex; flex-direction: column; gap: 16px; }
        .pw-wrap { position: relative; }
        .pw-wrap input { padding-right: 44px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; padding: 4px;
          display: grid; place-items: center;
          transition: color 0.15s; border-radius: 4px;
        }
        .pw-toggle:hover { color: var(--primary); }

        .lf-meta { display: flex; justify-content: space-between; align-items: center; }
        .lf-remember { display: flex; align-items: center; gap: 7px; font-size: 0.81rem; color: var(--text-secondary); cursor: pointer; }
        .lf-forgot { font-size: 0.81rem; color: var(--primary); font-weight: 600; transition: color 0.14s; }
        .lf-forgot:hover { color: var(--primary-dark); text-decoration: underline; }

        .lf-submit { width: 100%; justify-content: center; }

        .lf-demo {
          margin-top: 20px; padding: 13px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .lf-demo-label {
          font-size: 0.64rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.09em; color: var(--text-muted); margin-bottom: 8px;
        }
        .lf-demo-row { display: flex; gap: 8px; }
        .lf-demo-row span {
          font-size: 0.76rem; background: white;
          padding: 4px 10px; border-radius: var(--radius-xs);
          color: var(--text-secondary); font-family: monospace;
          border: 1px solid var(--border);
        }

        .lf-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0; color: var(--text-muted); font-size: 0.75rem;
        }
        .lf-divider::before, .lf-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }

        .btn-google {
          width: 100%; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          padding: 11px 0; border-radius: var(--radius-sm);
          border: 1.5px solid var(--border); background: white;
          color: var(--text-primary); font-size: 0.87rem; font-weight: 600;
          cursor: pointer; transition: all 0.16s; font-family: inherit;
          box-shadow: var(--shadow-xs);
        }
        .btn-google:hover {
          background: var(--bg-hover);
          border-color: rgba(79,70,229,0.35);
          box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
        }
        .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner-dark { border-color: #334155; border-top-color: transparent; }

        .login-switch { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
        .login-switch p { margin: 0; font-size: 0.87rem; font-weight: 600; color: var(--text-secondary); }
        .btn-outline {
          background: transparent; color: var(--primary);
          border: 1.5px solid var(--primary);
          padding: 9px 18px; border-radius: var(--radius-sm);
          font-size: 0.87rem; font-weight: 700; transition: all 0.16s;
          cursor: pointer; font-family: var(--font-display);
        }
        .btn-outline:hover {
          background: rgba(79,70,229,0.06);
          box-shadow: 0 0 0 3px rgba(79,70,229,0.10);
        }

        @media (max-width: 900px) {
          .login-panel { display: none; }
          .login-form-side { width: 100%; }
        }
      `}</style>
        </div>
    );
}