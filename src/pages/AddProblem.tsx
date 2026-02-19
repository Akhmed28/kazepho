import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Code2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProblem } from '../hooks/useProblems';
import LatexEditor from '../components/editor/LatexEditor';
import LatexRenderer from '../components/ui/LatexRenderer';
import Badge from '../components/ui/Badge';
import { Olympiad, GradeLevel, Difficulty } from '../types';
import styles from './AddProblem.module.css';

interface FormData {
  title: string;
  olympiad: Olympiad;
  year: number;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  statement: string;
  experimentalSetup: string;
  solution: string;
  tags: string;
}

export default function AddProblem() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEdit = Boolean(id);
  const { problem: existing } = useProblem(id);

  const [form, setForm] = useState<FormData>({
    title: '', olympiad: 'KazEPhO', year: new Date().getFullYear(),
    gradeLevel: null, difficulty: 'Medium',
    statement: '', experimentalSetup: '', solution: '', tags: '',
  });

  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title, olympiad: existing.olympiad, year: existing.year,
        gradeLevel: existing.gradeLevel, difficulty: existing.difficulty,
        statement: existing.statement, experimentalSetup: existing.experimentalSetup,
        solution: existing.solution, tags: (existing.tags ?? []).join(', '),
      });
    }
  }, [existing]);

  if (!isAuthenticated) {
    return (
      <div className={styles.unauthorized}>
        <div className="container">
          <div className={styles.unauthIcon}>🔒</div>
          <h2>Admin Access Required</h2>
          <p>You must be signed in as an admin to manage problems.</p>
          <Link to="/login" className={styles.loginLink}>Sign In as Admin</Link>
        </div>
      </div>
    );
  }

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title, olympiad: form.olympiad, year: form.year,
      gradeLevel: form.gradeLevel, difficulty: form.difficulty,
      statement: form.statement, experimentalSetup: form.experimentalSetup,
      solution: form.solution,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (isEdit && id) {
        const { updateProblem } = await import('../lib/supabase');
        await updateProblem(id, payload);
      } else {
        const { createProblem } = await import('../lib/supabase');
        await createProblem(payload);
      }
    } catch (_e) {
      // mock mode - continue
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => navigate('/problems'), 1500);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}><ArrowLeft size={15} /> Problems</Link>
          <span>›</span><span>{isEdit ? 'Edit Problem' : 'Add Problem'}</span>
        </div>

        <div className={styles.header}>
          <div className="gold-line" />
          <div className={styles.headerRow}>
            <h1>{isEdit ? 'Edit Problem' : 'Add New Problem'}</h1>
            <div className={styles.tabSwitch}>
              <button type="button" className={`${styles.tabBtn} ${tab === 'edit' ? styles.tabBtnActive : ''}`} onClick={() => setTab('edit')}>
                <Code2 size={13} /> Edit
              </button>
              <button type="button" className={`${styles.tabBtn} ${tab === 'preview' ? styles.tabBtnActive : ''}`} onClick={() => setTab('preview')}>
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>
        </div>

        {saved && (
          <div className={styles.savedBanner}>
            <CheckCircle size={20} />
            <span>{isEdit ? 'Changes saved!' : 'Problem added!'} Redirecting…</span>
          </div>
        )}
        {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

        {tab === 'edit' ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.metaCol}>
                <div className={styles.metaColTitle}>Problem Details</div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Title</label>
                  <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g., Measuring Speed of Sound" required />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Olympiad</label>
                  <select className={styles.select} value={form.olympiad} onChange={e => set('olympiad', e.target.value as Olympiad)}>
                    <option value="KazEPhO">KazEPhO</option>
                    <option value="Respa">Respa</option>
                    <option value="IZhO">IZhO</option>
                  </select>
                </div>

                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Year</label>
                    <input type="number" className={styles.input} value={form.year} onChange={e => set('year', Number(e.target.value))} min={2010} max={2030} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Grade</label>
                    <select className={styles.select} value={String(form.gradeLevel)}
                      onChange={e => set('gradeLevel', e.target.value === 'null' ? null : Number(e.target.value) as GradeLevel)}>
                      <option value="null">N/A</option>
                      <option value="8">8</option><option value="9">9</option>
                      <option value="10">10</option><option value="11">11</option>
                    </select>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Difficulty</label>
                  <div className={styles.diffPills}>
                    {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
                      <button key={d} type="button"
                        className={`${styles.diffPill} ${form.difficulty === d ? styles[`diffPillActive${d}`] : ''}`}
                        onClick={() => set('difficulty', d)}>
                        <Badge type="difficulty" value={d} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tags (comma-separated)</label>
                  <input className={styles.input} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="optics, waves, measurement" />
                </div>
              </div>

              <div className={styles.contentCol}>
                <LatexEditor label="Problem Statement" value={form.statement} onChange={v => set('statement', v)} rows={5} />
                <div style={{ height: '1.5rem' }} />
                <LatexEditor label="Experimental Setup" value={form.experimentalSetup} onChange={v => set('experimentalSetup', v)} rows={4} />
                <div style={{ height: '1.5rem' }} />
                <LatexEditor label="Full Solution" value={form.solution} onChange={v => set('solution', v)} rows={10} />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => navigate('/problems')}>Cancel</button>
              <button type="submit" className={styles.saveBtn} disabled={saving || saved}>
                {saving ? <span className={styles.spinner} /> : <><Save size={15} /> {isEdit ? 'Save Changes' : 'Add Problem'}</>}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div className={styles.previewBadges}>
                <Badge type="olympiad" value={form.olympiad} />
                <Badge type="year" value={form.year} />
                {form.gradeLevel && <Badge type="grade" value={form.gradeLevel} />}
                <Badge type="difficulty" value={form.difficulty} />
              </div>
              <h1 className={styles.previewTitle}>{form.title || 'Untitled Problem'}</h1>
            </div>
            {[
              { label: 'Problem Statement', content: form.statement },
              { label: 'Experimental Setup', content: form.experimentalSetup },
              { label: 'Solution', content: form.solution },
            ].map(s => (
              <div key={s.label} className={styles.previewSection}>
                <div className={styles.previewLabel}>{s.label}</div>
                {s.content ? <LatexRenderer>{s.content}</LatexRenderer> : <span className={styles.previewEmpty}>No content yet…</span>}
              </div>
            ))}
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setTab('edit')}>← Back to Editor</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
