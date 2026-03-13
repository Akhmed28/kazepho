import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Code2, CheckCircle, Plus, X, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useProblem } from '../hooks/useProblems';
import { useOlympiads } from '../hooks/useOlympiads';
import LatexEditor from '../components/editor/LatexEditor';
import LatexRenderer from '../components/ui/LatexRenderer';
import Badge from '../components/ui/Badge';
import { Olympiad, GradeLevel, Difficulty, Language } from '../types';
import styles from './AddProblem.module.css';

interface FormData {
  title: string;
  olympiad: Olympiad;
  year: number;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  language: Language;
  statement: string;
  experimentalSetup: string;
  solution: string;
  tags: string;
  pdfData: string;
  pdfName: string;
}

const PROBLEM_LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'kz', label: 'Қазақша' },
];

export default function AddProblem() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const isEdit = Boolean(id);
  const { problem: existing } = useProblem(id);
  const { olympiads, addOlympiad, removeOlympiad } = useOlympiads();

  const [form, setForm] = useState<FormData>({
    title: '', olympiad: 'KazEPhO', year: new Date().getFullYear(),
    gradeLevel: null, difficulty: 'Medium', language: 'en',
    statement: '', experimentalSetup: '', solution: '', tags: '',
    pdfData: '', pdfName: '',
  });

  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add Olympiad state
  const [showAddOlympiad, setShowAddOlympiad] = useState(false);
  const [newOlympiadName, setNewOlympiadName] = useState('');
  const [addOlympiadError, setAddOlympiadError] = useState('');
  const addOlympiadInputRef = useRef<HTMLInputElement>(null);

  // PDF upload
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [pdfUploading, setPdfUploading] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title, olympiad: existing.olympiad, year: existing.year,
        gradeLevel: existing.gradeLevel, difficulty: existing.difficulty,
        language: (existing.language as Language) ?? 'en',
        statement: existing.statement, experimentalSetup: existing.experimentalSetup,
        solution: existing.solution, tags: (existing.tags ?? []).join(', '),
        pdfData: existing.pdfData ?? '', pdfName: existing.pdfName ?? '',
      });
    }
  }, [existing]);

  useEffect(() => {
    if (showAddOlympiad) setTimeout(() => addOlympiadInputRef.current?.focus(), 50);
  }, [showAddOlympiad]);

  useEffect(() => {
    if (!olympiads.includes(form.olympiad) && olympiads.length > 0)
      setForm(f => ({ ...f, olympiad: olympiads[0] }));
  }, [olympiads]);

  if (!isAuthenticated) {
    return (
      <div className={styles.unauthorized}>
        <div className="container">
          <div className={styles.unauthIcon}>🔒</div>
          <h2>{t('form_unauthorized_title')}</h2>
          <p>{t('form_unauthorized_desc')}</p>
          <Link to="/login" className={styles.loginLink}>{t('form_sign_in')}</Link>
        </div>
      </div>
    );
  }

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm(f => ({ ...f, [k]: v }));

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setForm(f => ({ ...f, pdfData: dataUrl, pdfName: file.name }));
      setPdfUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title, olympiad: form.olympiad, year: form.year,
      gradeLevel: form.gradeLevel, difficulty: form.difficulty,
      language: form.language,
      statement: form.statement, experimentalSetup: form.experimentalSetup,
      solution: form.solution,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      pdfData: form.pdfData, pdfName: form.pdfName,
    };
    try {
      if (isEdit && id) {
        const { updateProblem } = await import('../lib/supabase');
        await updateProblem(id, payload);
      } else {
        const { createProblem } = await import('../lib/supabase');
        await createProblem(payload);
      }
    } catch (_e) { /* mock mode */ }
    setSaved(true);
    setSaving(false);
    setTimeout(() => navigate('/problems'), 1500);
  };

  const handleAddOlympiad = () => {
    const trimmed = newOlympiadName.trim();
    if (!trimmed) { setAddOlympiadError(t('nav_problems')); return; }
    const ok = addOlympiad(trimmed);
    if (!ok) { setAddOlympiadError('Already exists.'); return; }
    set('olympiad', trimmed as Olympiad);
    setNewOlympiadName(''); setAddOlympiadError(''); setShowAddOlympiad(false);
  };

  const handleRemoveOlympiad = (name: string) => {
    if (['KazEPhO', 'Respa', 'IZhO'].includes(name)) return;
    removeOlympiad(name);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}><ArrowLeft size={15} /> {t('nav_problems')}</Link>
          <span>›</span><span>{isEdit ? t('edit_breadcrumb') : t('add_breadcrumb')}</span>
        </div>

        <div className={styles.header}>
          <div className="gold-line" />
          <div className={styles.headerRow}>
            <h1>{isEdit ? t('edit_title') : t('add_title')}</h1>
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
            <span>{isEdit ? t('form_saved') : t('form_added')} {t('form_redirecting')}</span>
          </div>
        )}
        {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

        {tab === 'edit' ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.metaCol}>
                <div className={styles.metaColTitle}>{t('form_details')}</div>

                {/* Title */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>{t('form_title_label')}</label>
                  <input className={styles.input} value={form.title} onChange={e => set('title', e.target.value)} placeholder={t('form_title_placeholder')} required />
                </div>

                {/* Olympiad */}
                <div className={styles.fieldGroup}>
                  <div className={styles.olympiadLabelRow}>
                    <label className={styles.label}>{t('form_olympiad')}</label>
                    <button type="button" className={styles.addOlympiadBtn}
                      onClick={() => { setShowAddOlympiad(v => !v); setAddOlympiadError(''); setNewOlympiadName(''); }}>
                      {showAddOlympiad ? <X size={12} /> : <Plus size={12} />}
                      {showAddOlympiad ? t('form_cancel_olympiad') : t('form_add_olympiad')}
                    </button>
                  </div>
                  {showAddOlympiad && (
                    <div className={styles.addOlympiadBox}>
                      <div className={styles.addOlympiadRow}>
                        <input ref={addOlympiadInputRef} className={styles.addOlympiadInput}
                          value={newOlympiadName} onChange={e => { setNewOlympiadName(e.target.value); setAddOlympiadError(''); }}
                          placeholder={t('form_olympiad_placeholder')}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddOlympiad(); } if (e.key === 'Escape') setShowAddOlympiad(false); }} />
                        <button type="button" className={styles.addOlympiadConfirm} onClick={handleAddOlympiad}>
                          <Plus size={13} /> {t('form_add_olympiad')}
                        </button>
                      </div>
                      {addOlympiadError && <div className={styles.addOlympiadError}>{addOlympiadError}</div>}
                    </div>
                  )}
                  <div className={styles.olympiadList}>
                    {olympiads.map(o => {
                      const isDefault = ['KazEPhO', 'Respa', 'IZhO'].includes(o);
                      return (
                        <div key={o} className={`${styles.olympiadItem} ${form.olympiad === o ? styles.olympiadItemActive : ''}`} onClick={() => set('olympiad', o as Olympiad)}>
                          <span className={styles.olympiadItemName}>{o}</span>
                          {!isDefault && (
                            <button type="button" className={styles.olympiadRemoveBtn}
                              onClick={e => { e.stopPropagation(); handleRemoveOlympiad(o); }} title={`Remove ${o}`}>
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Year + Grade */}
                <div className={styles.row2}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>{t('form_year')}</label>
                    <input type="number" className={styles.input} value={form.year} onChange={e => set('year', Number(e.target.value))} min={2010} max={2030} required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>{t('form_grade')}</label>
                    <select className={styles.select} value={String(form.gradeLevel)}
                      onChange={e => set('gradeLevel', e.target.value === 'null' ? null : Number(e.target.value) as GradeLevel)}>
                      <option value="null">{t('form_grade_na')}</option>
                      <option value="8">8</option><option value="9">9</option>
                      <option value="10">10</option><option value="11">11</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>{t('form_difficulty')}</label>
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

                {/* Problem Language */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>{t('form_language')}</label>
                  <div className={styles.langPills}>
                    {PROBLEM_LANGS.map(l => (
                      <button key={l.code} type="button"
                        className={`${styles.langPill} ${form.language === l.code ? styles.langPillActive : ''}`}
                        onClick={() => set('language', l.code)}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>{t('form_tags')}</label>
                  <input className={styles.input} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder={t('form_tags_placeholder')} />
                </div>

                {/* PDF Upload */}
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>{t('form_pdf')}</label>
                  <div className={styles.pdfHint}>{t('form_pdf_hint')}</div>
                  {form.pdfData ? (
                    <div className={styles.pdfUploaded}>
                      <FileText size={16} className={styles.pdfIcon} />
                      <span className={styles.pdfName}>{form.pdfName}</span>
                      <button type="button" className={styles.pdfRemoveBtn}
                        onClick={() => setForm(f => ({ ...f, pdfData: '', pdfName: '' }))}>
                        <X size={12} /> {t('form_pdf_remove')}
                      </button>
                    </div>
                  ) : (
                    <button type="button" className={styles.pdfUploadBtn}
                      onClick={() => pdfInputRef.current?.click()} disabled={pdfUploading}>
                      <FileText size={14} />
                      {pdfUploading ? '…' : t('form_pdf')}
                    </button>
                  )}
                  <input ref={pdfInputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handlePdfUpload} />
                </div>

              </div>

              <div className={styles.contentCol}>
                <LatexEditor label={t('form_statement')} value={form.statement} onChange={v => set('statement', v)} rows={5} />
                <div style={{ height: '1.5rem' }} />
                <LatexEditor label={t('form_setup')} value={form.experimentalSetup} onChange={v => set('experimentalSetup', v)} rows={4} />
                <div style={{ height: '1.5rem' }} />
                <LatexEditor label={t('form_solution')} value={form.solution} onChange={v => set('solution', v)} rows={10} />
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => navigate('/problems')}>{t('form_cancel')}</button>
              <button type="submit" className={styles.saveBtn} disabled={saving || saved}>
                {saving ? <span className={styles.spinner} /> : <><Save size={15} /> {isEdit ? t('form_save') : t('form_add')}</>}
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
              { label: t('form_statement'), content: form.statement },
              { label: t('form_setup'), content: form.experimentalSetup },
              { label: t('form_solution'), content: form.solution },
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
