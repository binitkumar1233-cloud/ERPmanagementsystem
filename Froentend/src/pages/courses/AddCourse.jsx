import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import Navbar from '../../components/layout/Navbar.jsx';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants.js';

const DURATIONS = ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years'];

export default function AddCourse() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [form, setForm] = useState({
        name: '', code: '', dept: '', duration: '3 Years',
        seats: '', credits: '', feePerYear: '', description: '',
        eligibility: '', status: 'Active',
    });

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setSaving(true);
        try {
            await api.post('/courses', {
                name: form.name,
                code: form.code,
                dept: form.dept,
                duration: form.duration,
                seats: Number(form.seats),
                fees: Number(form.feePerYear),
                description: form.description || undefined,
                status: form.status,
            });
            navigate('/courses');
        } catch (err) {
            setSubmitError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const F = ({ label, req, children, className = '' }) => (
        <div className={`field ${className}`}>
            <label>{label}{req && <span className="req"> *</span>}</label>
            {children}
        </div>
    );

    return (
        <div className="erp-page">
            <Navbar title="Add Course" subtitle="Create a new academic program" />

            <div className="form-page-wrap">
                <div style={{ marginBottom: 18 }}>
                    <button className="back-btn" onClick={() => navigate('/courses')}>
                        <ArrowLeft size={15} /> Back to Courses
                    </button>
                </div>

                <form className="form-card" onSubmit={handleSubmit}>

                    {/* Section 1 */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <div className="form-step-num">01</div>
                            <div>
                                <h3>Course Information</h3>
                                <p>Basic details about the academic program</p>
                            </div>
                        </div>
                        <div className="form-grid">
                            <F label="Course Name" req>
                                <input required placeholder="e.g. B.Sc Computer Science" value={form.name} onChange={set('name')} />
                            </F>
                            <F label="Course Code" req>
                                <input required placeholder="e.g. BSC-CS-2024" value={form.code} onChange={set('code')} />
                            </F>
                            <F label="Department" req>
                                <select required value={form.dept} onChange={set('dept')}>
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </F>
                            <F label="Duration">
                                <select value={form.duration} onChange={set('duration')}>
                                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </F>
                            <F label="Description" className="col-full">
                                <textarea rows={3} placeholder="Brief description of the course…" value={form.description} onChange={set('description')} />
                            </F>
                            <F label="Eligibility Criteria" className="col-full">
                                <textarea rows={2} placeholder="e.g. 10+2 with Science, minimum 60%" value={form.eligibility} onChange={set('eligibility')} />
                            </F>
                        </div>
                    </div>

                    <div className="form-divider" />

                    {/* Section 2 */}
                    <div className="form-section">
                        <div className="form-section-title">
                            <div className="form-step-num" style={{ background: '#059669' }}>02</div>
                            <div>
                                <h3>Capacity & Fee Structure</h3>
                                <p>Seats, credits and annual fee information</p>
                            </div>
                        </div>
                        <div className="form-grid">
                            <F label="Total Seats" req>
                                <input required type="number" min="1" placeholder="e.g. 60" value={form.seats} onChange={set('seats')} />
                            </F>
                            <F label="Total Credits">
                                <input type="number" min="0" placeholder="e.g. 120" value={form.credits} onChange={set('credits')} />
                            </F>
                            <F label="Annual Fee (₹)" req>
                                <input required type="number" min="0" placeholder="e.g. 45000" value={form.feePerYear} onChange={set('feePerYear')} />
                            </F>
                            <F label="Status">
                                <select value={form.status} onChange={set('status')}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </F>
                        </div>
                    </div>

                    {submitError && (
                        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>
                            ⚠ {submitError}
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/courses')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner" /> Saving…</> : <><Save size={15} /> Save Course</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}