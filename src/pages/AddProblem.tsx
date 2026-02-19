import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import LatexEditor from '../components/editor/LatexEditor';
import LatexRenderer from '../components/ui/LatexRenderer';
import { useAuth } from '../context/AuthContext';
import { Olympiad, GradeLevel } from '../types';
import styles from './AddProblem.module.css';

interface FormData {
  title: string;
  olympiad: Olympiad;
  year: number;
  gradeLevel: GradeLevel;
  statement: string;
  experimentalSetup: string;
  solution: string;
  tags: string;
  difficulty: string;
}

export default function AddProblem() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isEdit = Boolean(id);

  const existing = id ? mockProblems.find(p => p.id === id) : null;

  const [form, setForm] = useState<FormData>({
    title: existing?.title || '',
    olympiad: existing?.olympiad || 'KazEPhO',
    year: existing?.year || new Date().getFullYear(),
    gradeLevel: existing?.gradeLevel || null,
    difficulty: existing?.difficulty || 'Medium',
    statement: existing?.statement || '',
    experimentalSetup: existing?.experimentalSetup || '',
    solution: existing?.solution || '',
    tags: existing?.tags?.join(', ') || '',
  });
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className={styles.unauthorized}>
        <div className="container">
          <h2>Access Restricted</h2>
          <p>You must be an authorized admin to add or edit problems.</p>
          <Link to="/login" className={styles.loginLink}>Sign In as Admin</Link>
        </div>
      </div>
    );
  }

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      navigate('/problems');
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}>
            <ArrowLeft size={15} />
            Problems
          </Link>
          <span>›</span>
          <span>{isEdit ? 'Edit Problem' : 'Add Problem'}</span>
        </div>

        <div className={styles.header}>
          <div className="gold-line" />
          <div className={styles.headerRow}>
            <h1>{isEdit ? 'Edit Problem' : 'Add New Problem'}</h1>
            <div className={styles.tabSwitch}>
              <button
                type="button"
                className={`${styles.tabBtn} ${tab === 'edit' ? styles.tabBtnActive : ''}`}
                onClick={() => setTab('edit')}
              >
                <Eye size={14} />Edit
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${tab === 'preview' ? styles.tabBtnActive : ''}`}
                onClick={() => setTab('preview')}
              >
                <Eye size={14} />Preview
              </button>
            </div>
          </div>
        </div>

        {tab === 'edit' ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Left: Meta */}
              <div className={styles.metaCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Title</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="e.g., Measuring Speed of Sound"
                    required
                  />
                </div>

                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Olympiad</label>
                    <select
                      className={styles.select}
                      value={form.olympiad}
                      onChange={e => set('olympiad', e.target.value as Olympiad)}
                    >
                      <option value="KazEPhO">KazEPhO</option>
                      <option value="Respa">Respa</option>
                      <option value="IZhO">IZhO</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Year</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={form.year}
                      onChange={e => set('year', Number(e.target.value))}
                      min={2010}
                      max={2030}
                      required
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Grade Level</label>
                    <select
                      className={styles.select}
                      value={String(form.gradeLevel)}
                      onChange={e => set('gradeLevel', e.target.value === 'null' ? null : Number(e.target.value) as GradeLevel)}
                    >
                      <option value="null">N/A</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                    </select>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={form.tags}
                    onChange={e => set('tags', e.target.value)}
                    placeholder="e.g., acoustics, waves, measurement"
                  />
                </div>
              </div>

              {/* Right: Content editors */}
              <div className={styles.contentCol}>
                <LatexEditor
                  label="Problem Statement"
                  value={form.statement}
                  onChange={v => set('statement', v)}
                  rows={5}
                />

                <div className={styles.divider} />

                <LatexEditor
                  label="Experimental Setup"
                  value={form.experimentalSetup}
                  onChange={v => set('experimentalSetup', v)}
                  rows={4}
                />

                <div className={styles.divider} />

                <LatexEditor
                  label="Full Solution"
                  value={form.solution}
                  onChange={v => set('solution', v)}
                  rows={10}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => navigate('/problems')}>
                Cancel
              </button>
              <button type="submit" className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ''}`}>
                {saved ? '✓ Saved!' : <><Save size={15} /> {isEdit ? 'Save Changes' : 'Add Problem'}</>}
              </button>
            </div>
          </form>
        ) : (
          /* Full preview */
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div className={styles.previewBadges}>
                <span className={styles.previewBadge} data-type="olympiad">{form.olympiad}</span>
                <span className={styles.previewBadge} data-type="year">{form.year}</span>
                {form.gradeLevel && <span className={styles.previewBadge} data-type="grade">Grade {form.gradeLevel}</span>}
              </div>
              <h1 className={styles.previewTitle}>{form.title || 'Untitled Problem'}</h1>
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>Problem Statement</div>
              {form.statement ? <LatexRenderer>{form.statement}</LatexRenderer> : <span className={styles.previewEmpty}>No content yet</span>}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>Experimental Setup</div>
              {form.experimentalSetup ? <LatexRenderer>{form.experimentalSetup}</LatexRenderer> : <span className={styles.previewEmpty}>No content yet</span>}
            </div>

            <div className={styles.previewSection}>
              <div className={styles.previewLabel}>Solution</div>
              {form.solution ? <LatexRenderer>{form.solution}</LatexRenderer> : <span className={styles.previewEmpty}>No content yet</span>}
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => setTab('edit')}>
                Back to Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
