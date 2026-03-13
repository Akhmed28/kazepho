import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, ChevronDown, ChevronUp, Edit2, Trash2, Printer, Share2, AlertCircle, Download } from 'lucide-react';
import { useProblem, useProblems } from '../hooks/useProblems';
import Badge from '../components/ui/Badge';
import LatexRenderer from '../components/ui/LatexRenderer';
import ScrollToTop from '../components/ui/ScrollToTop';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from './ProblemDetail.module.css';

function SkeletonDetail() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.articleHero} style={{ minHeight: 180 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[80, 60, 70].map((w, i) => (
                  <div key={i} style={{ height: 20, width: w, borderRadius: 100, background: 'var(--bg-elevated)' }} />
                ))}
              </div>
              <div style={{ height: 28, width: '70%', borderRadius: 8, background: 'var(--bg-elevated)', marginBottom: '0.5rem' }} />
              <div style={{ height: 28, width: '45%', borderRadius: 8, background: 'var(--bg-elevated)' }} />
            </div>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.sideCard} style={{ minHeight: 180 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemNotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundBlob} />
      <div className={styles.notFoundInner}>
        <div className={styles.notFoundIcon}><AlertCircle size={28} /></div>
        <h2>{t('detail_not_found_title')}</h2>
        <p>{t('detail_not_found_desc')}</p>
        <div className={styles.notFoundActions}>
          <Link to="/problems" className={styles.nfBtnPrimary}>{t('detail_browse_all')}</Link>
          <button className={styles.nfBtnGhost} onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> {t('detail_go_back')}
          </button>
        </div>
      </div>
    </div>
  );
}

const LANG_LABELS: Record<string, string> = { en: 'English', ru: 'Русский', kz: 'Қазақша' };

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { problem, loading } = useProblem(id);
  const { problems } = useProblems();
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePrint = () => {
    // If a PDF was uploaded, download it directly
    if (problem?.pdfData) {
      const a = document.createElement('a');
      a.href = problem.pdfData;
      a.download = problem.pdfName || `${problem.title}.pdf`;
      a.click();
      return;
    }
    // Otherwise fallback to browser print
    if (!solutionOpen) setSolutionOpen(true);
    setTimeout(() => window.print(), 350);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!problem || !confirm(t('detail_delete_confirm'))) return;
    setDeleting(true);
    try {
      const { deleteProblem } = await import('../lib/supabase');
      await deleteProblem(problem.id);
    } catch (_e) { /* mock mode */ }
    navigate('/problems');
  };

  if (loading) return <SkeletonDetail />;
  if (!problem) return <ProblemNotFound />;

  const related = problems.filter(p => p.olympiad === problem.olympiad && p.id !== problem.id).slice(0, 3);
  const hasPdf = Boolean(problem.pdfData);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}><ArrowLeft size={15} /> {t('detail_all_problems')}</Link>
          <span>›</span>
          <span className={styles.breadCrumb}>{problem.olympiad} {problem.year}</span>
        </div>

        <div className={styles.layout}>
          <article className={styles.main}>
            <div className={styles.articleHero}>
              <div className={styles.articleHeroGlow} />
              <div className={styles.badges}>
                <Badge type="olympiad" value={problem.olympiad} />
                <Badge type="year" value={problem.year} />
                {problem.gradeLevel && <Badge type="grade" value={problem.gradeLevel} />}
                <Badge type="difficulty" value={problem.difficulty} />
              </div>
              <h1 className={styles.title}>{problem.title}</h1>
              {problem.tags && (
                <div className={styles.tags}>
                  {problem.tags.map(t => <Badge key={t} type="tag" value={t} />)}
                </div>
              )}
              <div className={styles.toolBar}>
                <button className={`${styles.toolBtn} ${hasPdf ? styles.toolBtnPdf : ''}`} onClick={handlePrint}>
                  {hasPdf ? <Download size={14} /> : <Printer size={14} />}
                  {hasPdf ? t('detail_download_pdf') : t('detail_print')}
                </button>
                <button className={`${styles.toolBtn} ${copied ? styles.toolBtnSuccess : ''}`} onClick={handleShare}>
                  <Share2 size={14} /> {copied ? t('detail_copied') : t('detail_share')}
                </button>
                {isAuthenticated && (
                  <>
                    <Link to={`/edit/${problem.id}`} className={`${styles.toolBtn} ${styles.toolBtnEdit}`}>
                      <Edit2 size={14} /> {t('detail_edit')}
                    </Link>
                    <button className={`${styles.toolBtn} ${styles.toolBtnDelete}`} onClick={handleDelete} disabled={deleting}>
                      <Trash2 size={14} /> {deleting ? t('detail_deleting') : t('detail_delete')}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockLabel}>
                <span className={`${styles.labelDot} ${styles.dotBlue}`} />{t('detail_statement')}
              </div>
              <div className={styles.blockContent}><LatexRenderer>{problem.statement}</LatexRenderer></div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockLabel}>
                <span className={`${styles.labelDot} ${styles.dotGreen}`} />{t('detail_setup')}
              </div>
              <div className={`${styles.blockContent} ${styles.setupBox}`}>
                <FlaskConical size={18} className={styles.setupIcon} />
                <LatexRenderer>{problem.experimentalSetup}</LatexRenderer>
              </div>
            </div>

            <div className={styles.solutionWrap}>
              <button
                className={`${styles.solutionToggle} ${solutionOpen ? styles.solutionToggleOpen : ''}`}
                onClick={() => setSolutionOpen(v => !v)}
              >
                <div className={styles.toggleLeft}>
                  <span className={`${styles.labelDot} ${styles.dotGold}`} /><span>{t('detail_solution')}</span>
                </div>
                <div className={styles.toggleRight}>
                  <span>{solutionOpen ? t('detail_hide') : t('detail_reveal')}</span>
                  {solutionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              <div className={`${styles.solutionBody} ${solutionOpen ? styles.solutionBodyOpen : ''}`}>
                <div className={styles.solutionInner}><LatexRenderer>{problem.solution}</LatexRenderer></div>
              </div>
            </div>
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>{t('detail_info')}</div>
              <dl className={styles.metaList}>
                <div className={styles.metaRow}><dt>{t('detail_olympiad')}</dt><dd><Badge type="olympiad" value={problem.olympiad} /></dd></div>
                <div className={styles.metaRow}><dt>{t('detail_year')}</dt><dd>{problem.year}</dd></div>
                <div className={styles.metaRow}><dt>{t('detail_difficulty')}</dt><dd><Badge type="difficulty" value={problem.difficulty} /></dd></div>
                {problem.gradeLevel && <div className={styles.metaRow}><dt>{t('detail_grade')}</dt><dd>Grade {problem.gradeLevel}</dd></div>}
                {problem.language && (
                  <div className={styles.metaRow}><dt>{t('detail_language')}</dt><dd>{LANG_LABELS[problem.language] ?? problem.language}</dd></div>
                )}
                {problem.tags && (
                  <div className={styles.metaRow}>
                    <dt>{t('detail_topics')}</dt>
                    <dd className={styles.metaTags}>{problem.tags.map(tag => <Badge key={tag} type="tag" value={tag} />)}</dd>
                  </div>
                )}
                {hasPdf && (
                  <div className={styles.metaRow}>
                    <dt>PDF</dt>
                    <dd>
                      <button className={styles.pdfSideBtn} onClick={handlePrint}>
                        <Download size={12} /> {t('detail_download_pdf')}
                      </button>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            {related.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideTitle}>{t('detail_more_from')} {problem.olympiad}</div>
                <div className={styles.relatedList}>
                  {related.map(p => (
                    <Link key={p.id} to={`/problems/${p.id}`} className={styles.relatedItem}>
                      <div>
                        <div className={styles.relatedName}>{p.title}</div>
                        <div className={styles.relatedMeta}>{p.year} · <Badge type="difficulty" value={p.difficulty} /></div>
                      </div>
                      <ArrowLeft size={14} style={{ transform: 'rotate(180deg)', flexShrink: 0, color: 'var(--text-muted)' }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
