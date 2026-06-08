import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, BookOpen, Check, AlertCircle, User, Mail, Phone, GraduationCap } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';

export default function StudentRegister() {
    const { loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1=personal, 2=academic, 3=password
    const [form, setForm] = useState({
        fullName: '', email: '', phone: '',
        course: '', year: '', section: '',
        password: '', confirmPassword: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const COURSES = ['B.Sc Computer Science', 'B.Com', 'B.A English', 'B.Tech', 'MBA', 'M.Sc', 'Diploma'];
    const YEARS   = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const SECTIONS = ['A', 'B', 'C', 'D'];

    const nextStep = (e) => {
        e.preventDefault();
        setError('');
        if (step === 2 && !form.course) { setError('Please select a course.'); return; }
        setStep(s => s + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            // Create Firebase account
            const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
            const { auth } = await import('../../config/firebase.js');
            const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            await updateProfile(credential.user, { displayName: form.fullName });
            setSuccess(true);
        } catch (err) {
            const code = err.code || '';
            if (code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Please log in instead.');
            } else if (code === 'auth/weak-password') {
                setError('Password is too weak. Use at least 6 characters.');
            } else if (code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else {
                setError(err.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

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

    if (success) {
        return (
            <div className="sr-root">
                <div className="sr-card">
                    <div className="sr-success-icon">
                        <Check size={40} color="#059669" />
                    </div>
                    <h2>Account Created!</h2>
                    <p>Welcome, <strong>{form.fullName}</strong>! Your student account has been created successfully.</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        You can now log in with your email and password.
                    </p>
                    <Link to="/student-login" className="sr-btn-primary">
                        Go to Student Login <ArrowRight size={16} />
                    </Link>
                </div>
                <style>{srStyles}</style>
            </div>
        );
    }

    return (
        <div className="sr-root">
            <div className="sr-left">
                <div className="sr-left-inner">
                    <div className="sr-brand">
                        <div className="sr-logo"><BookOpen size={22} /></div>
                        <div>
                            <div className="sr-brand-name">EduManage ERP</div>
                            <div className="sr-brand-tag">Student Registration</div>
                        </div>
                    </div>
                    <h1>Join the<br /><span className="sr-accent">Student Portal</span></h1>
                    <p>Create your student account to access attendance, results, fee status, and more — all in one place.</p>
                    <div className="sr-steps-preview">
                        {[
                            { n: 1, label: 'Personal Info' },
                            { n: 2, label: 'Academic Details' },
                            { n: 3, label: 'Set Password' },
                        ].map(({ n, label }) => (
                            <div key={n} className={`sr-step-item ${step >= n ? 'done' : ''} ${step === n ? 'current' : ''}`}>
                                <div className="sr-step-circle">{step > n ? <Check size={13} /> : n}</div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="sr-right">
                <div className="sr-form-wrap">
                    <div className="sr-top-link">
                        Already have an account? <Link to="/student-login">Sign in</Link>
                    </div>

                    <div className="sr-header">
                        <h2>
                            {step === 1 && 'Personal Information'}
                            {step === 2 && 'Academic Details'}
                            {step === 3 && 'Create Password'}
                        </h2>
                        <p>Step {step} of 3</p>
                    </div>

                    {/* Progress bar */}
                    <div className="sr-progress-bar">
                        <div className="sr-progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
                    </div>

                    {error && (
                        <div className="sr-error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Step 1 — Personal Info */}
                    {step === 1 && (
                        <>
                            <button type="button" className="sr-btn-google" onClick={handleGoogle} disabled={googleLoading}>
                                {googleLoading ? (
                                    <><span className="spinner spinner-dark" /> Signing up…</>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                        </svg>
                                        Sign up with Google
                                    </>
                                )}
                            </button>
                            <div className="sr-divider"><span>or fill in your details</span></div>
                            <form onSubmit={nextStep} className="sr-form">
                                <div className="sr-field">
                                    <label>Full Name <span className="req">*</span></label>
                                    <div className="sr-input-wrap">
                                        <User size={16} className="sr-input-icon" />
                                        <input type="text" required placeholder="Riya Sharma" value={form.fullName} onChange={set('fullName')} />
                                    </div>
                                </div>
                                <div className="sr-field">
                                    <label>Email Address <span className="req">*</span></label>
                                    <div className="sr-input-wrap">
                                        <Mail size={16} className="sr-input-icon" />
                                        <input type="email" required placeholder="student@yourschool.edu" value={form.email} onChange={set('email')} />
                                    </div>
                                </div>
                                <div className="sr-field">
                                    <label>Phone Number</label>
                                    <div className="sr-input-wrap">
                                        <Phone size={16} className="sr-input-icon" />
                                        <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                                    </div>
                                </div>
                                <button type="submit" className="sr-btn-primary">
                                    Next: Academic Details <ArrowRight size={16} />
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 2 — Academic Details */}
                    {step === 2 && (
                        <form onSubmit={nextStep} className="sr-form">
                            <div className="sr-field">
                                <label>Course / Programme <span className="req">*</span></label>
                                <div className="sr-input-wrap">
                                    <GraduationCap size={16} className="sr-input-icon" />
                                    <select required value={form.course} onChange={set('course')}>
                                        <option value="">Select your course</option>
                                        {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="sr-row">
                                <div className="sr-field">
                                    <label>Year</label>
                                    <select value={form.year} onChange={set('year')}>
                                        <option value="">Select year</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="sr-field">
                                    <label>Section</label>
                                    <select value={form.section} onChange={set('section')}>
                                        <option value="">Select</option>
                                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="sr-btn-row">
                                <button type="button" className="sr-btn-back" onClick={() => setStep(1)}>Back</button>
                                <button type="submit" className="sr-btn-primary" style={{ flex: 1 }}>
                                    Next: Set Password <ArrowRight size={16} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3 — Password */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="sr-form">
                            <div className="sr-field">
                                <label>Password <span className="req">*</span></label>
                                <div className="sr-input-wrap">
                                    <input type={showPass ? 'text' : 'password'} required placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
                                    <button type="button" className="sr-pw-toggle" onClick={() => setShowPass(s => !s)}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="sr-field">
                                <label>Confirm Password <span className="req">*</span></label>
                                <div className="sr-input-wrap">
                                    <input type={showConfirm ? 'text' : 'password'} required placeholder="Re-enter your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
                                    <button type="button" className="sr-pw-toggle" onClick={() => setShowConfirm(s => !s)}>
                                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="sr-summary">
                                <p><strong>Name:</strong> {form.fullName}</p>
                                <p><strong>Email:</strong> {form.email}</p>
                                <p><strong>Course:</strong> {form.course || '—'}</p>
                            </div>
                            <div className="sr-btn-row">
                                <button type="button" className="sr-btn-back" onClick={() => setStep(2)}>Back</button>
                                <button type="submit" className="sr-btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? <><span className="spinner" /> Creating account…</> : <>Create Account <Check size={16} /></>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <style>{srStyles}</style>
        </div>
    );
}

const srStyles = `
  .sr-root { display: flex; min-height: 100vh; background: white; }
  .sr-left { flex: 1; background: var(--bg-sidebar); color: white; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative; overflow: hidden; }
  .sr-left::before { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(30,64,175,0.2) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; }
  .sr-left-inner { max-width: 400px; width: 100%; position: relative; z-index: 1; }
  .sr-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .sr-logo { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 14px; background: white; color: var(--primary); }
  .sr-brand-name { font-size: 1.1rem; font-weight: 700; }
  .sr-brand-tag { font-size: 0.88rem; color: rgba(255,255,255,0.6); }
  .sr-left h1 { font-size: clamp(2rem, 3vw, 2.8rem); line-height: 1.1; margin-bottom: 16px; }
  .sr-accent { color: #93c5fd; }
  .sr-left p { color: rgba(255,255,255,0.7); font-size: 0.96rem; line-height: 1.7; margin-bottom: 40px; }
  .sr-steps-preview { display: grid; gap: 14px; }
  .sr-step-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.4); font-size: 0.9rem; transition: all 0.2s; }
  .sr-step-item.done, .sr-step-item.current { color: rgba(255,255,255,0.9); }
  .sr-step-circle { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: grid; place-items: center; font-size: 0.78rem; font-weight: 700; flex-shrink: 0; transition: all 0.2s; }
  .sr-step-item.done .sr-step-circle { background: #059669; border-color: #059669; }
  .sr-step-item.current .sr-step-circle { background: var(--primary); border-color: var(--primary); }

  .sr-right { width: 520px; display: flex; justify-content: center; align-items: center; padding: 32px; }
  .sr-form-wrap { width: 100%; max-width: 400px; }
  .sr-top-link { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 28px; }
  .sr-top-link a { color: var(--primary); font-weight: 600; text-decoration: none; }
  .sr-header h2 { font-size: 1.7rem; font-weight: 800; margin-bottom: 4px; }
  .sr-header p { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px; }
  .sr-progress-bar { height: 5px; background: #e5e7eb; border-radius: 99px; margin-bottom: 24px; overflow: hidden; }
  .sr-progress-fill { height: 100%; background: var(--primary); border-radius: 99px; transition: width 0.35s ease; }
  .sr-error { display: flex; align-items: center; gap: 8px; background: rgba(248,113,113,0.1); color: #b91c1c; border-radius: 10px; padding: 11px 14px; margin-bottom: 16px; font-size: 0.88rem; }
  .sr-form { display: flex; flex-direction: column; gap: 16px; }
  .sr-field { display: flex; flex-direction: column; gap: 6px; }
  .sr-field label { font-weight: 600; font-size: 0.88rem; color: var(--text-secondary); }
  .sr-field .req { color: #ef4444; }
  .sr-input-wrap { position: relative; display: flex; align-items: center; }
  .sr-input-icon { position: absolute; left: 13px; color: var(--text-muted); pointer-events: none; }
  .sr-input-wrap input, .sr-input-wrap select { width: 100%; border: 1.5px solid #d1d5db; border-radius: 12px; padding: 12px 14px 12px 38px; font-size: 0.93rem; outline: none; background: white; transition: border-color 0.15s; }
  .sr-input-wrap input:not(.sr-input-icon ~ input), .sr-input-wrap select { padding-left: 14px; }
  .sr-input-wrap input:focus, .sr-input-wrap select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,64,175,0.08); }
  .sr-input-wrap input[type="text"], .sr-input-wrap input[type="email"], .sr-input-wrap input[type="tel"], .sr-input-wrap input[type="password"] { padding-left: 38px; }
  .sr-input-wrap select { padding-left: 38px; }
  .sr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .sr-row .sr-field input, .sr-row .sr-field select { padding-left: 14px; width: 100%; border: 1.5px solid #d1d5db; border-radius: 12px; padding: 12px 14px; font-size: 0.93rem; outline: none; }
  .sr-pw-toggle { position: absolute; right: 12px; background: none; border: none; color: var(--text-muted); cursor: pointer; }
  .sr-btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; background: var(--primary); color: white; border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: opacity 0.18s; text-decoration: none; }
  .sr-btn-primary:hover:not(:disabled) { opacity: 0.9; }
  .sr-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .sr-btn-back { padding: 13px 20px; background: #f3f4f6; color: #374151; border: none; border-radius: 12px; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
  .sr-btn-back:hover { background: #e5e7eb; }
  .sr-btn-row { display: flex; gap: 10px; }
  .sr-btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 13px 20px; border-radius: 12px; border: 1.5px solid #e5e7eb; background: white; font-size: 0.95rem; font-weight: 600; color: #374151; cursor: pointer; transition: all 0.18s; margin-bottom: 4px; }
  .sr-btn-google:hover:not(:disabled) { border-color: #d1d5db; background: #f9fafb; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
  .sr-btn-google:disabled { opacity: 0.6; cursor: not-allowed; }
  .sr-divider { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 0.82rem; margin: 14px 0; }
  .sr-divider::before, .sr-divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
  .sr-summary { background: #f8fafc; border-radius: 12px; padding: 14px 16px; font-size: 0.88rem; display: grid; gap: 6px; color: var(--text-muted); }
  .sr-summary strong { color: var(--text-primary); }
  .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .spinner-dark { border-color: #d1d5db; border-top-color: #374151; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .sr-card { max-width: 420px; margin: auto; text-align: center; padding: 48px 32px; }
  .sr-success-icon { width: 80px; height: 80px; border-radius: 50%; background: #d1fae5; display: grid; place-items: center; margin: 0 auto 24px; }
  .sr-card h2 { font-size: 2rem; font-weight: 800; margin-bottom: 12px; }
  .sr-card p { color: var(--text-muted); line-height: 1.7; margin-bottom: 6px; }
  .sr-card .sr-btn-primary { margin-top: 28px; }

  @media (max-width: 980px) { .sr-root { flex-direction: column; } .sr-right { width: 100%; } }
`;
