import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, ChevronDown, ChevronUp, Edit2, Trash2, Printer, Share2 } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import Badge from '../components/ui/Badge';
import LatexRenderer from '../components/ui/LatexRenderer';
import { useAuth } from '../context/AuthContext';
import styles from './ProblemDetail.module.css';

export default function ProblemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const problem = mockProblems.find(p => p.id === id);

  const handlePrint = () => {
    if (problem && !solutionOpen) setSolutionOpen(true);
    setTimeout(() => window.print(), 300);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!problem) {
    return (
      <div className={styles.notFound}>
        <div className="container">
          <h2>Problem not found</h2>
          <Link to="/problems" className={styles.backLink}><ArrowLeft size={16} /> Back to Problems</Link>
        </div>
      </div>
    );
  }

  const related = mockProblems.filter(p => p.olympiad === problem.olympiad && p.id !== problem.id).slice(0, 3);

  return (
    <div className={styles.page} id="print-area">
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}>
            <ArrowLeft size={15} /> All Problems
          </Link>
          <span>›</span>
          <span className={styles.breadCrumb}>{problem.olympiad} {problem.year}</span>
        </div>

        <div className={styles.layout}>
          {/* ── MAIN ── */}
          <article className={styles.main}>
            {/* Hero header */}
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
                <button className={styles.toolBtn} onClick={handlePrint}>
                  <Printer size={14} />
                  Print / Save PDF
                </button>
                <button className={`${styles.toolBtn} ${copied ? styles.toolBtnSuccess : ''}`} onClick={handleShare}>
                  <Share2 size={14} />
                  {copied ? 'Link copied!' : 'Share'}
                </button>
                {isAuthenticated && (
                  <>
                    <Link to={`/edit/${problem.id}`} className={`${styles.toolBtn} ${styles.toolBtnEdit}`}>
                      <Edit2 size={14} />Edit
                    </Link>
                    <button className={`${styles.toolBtn} ${styles.toolBtnDelete}`} onClick={() => navigate('/problems')}>
                      <Trash2 size={14} />Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Statement */}
            <div className={styles.block}>
              <div className={styles.blockLabel}>
                <span className={`${styles.labelDot} ${styles.dotBlue}`} />
                Problem Statement
              </div>
              <div className={styles.blockContent}>
                <LatexRenderer>{problem.statement}</LatexRenderer>
              </div>
            </div>

            {/* Setup */}
            <div className={styles.block}>
              <div className={styles.blockLabel}>
                <span className={`${styles.labelDot} ${styles.dotGreen}`} />
                Experimental Setup
              </div>
              <div className={`${styles.blockContent} ${styles.setupBox}`}>
                <FlaskConical size={18} className={styles.setupIcon} />
                <LatexRenderer>{problem.experimentalSetup}</LatexRenderer>
              </div>
            </div>

            {/* Solution collapsible */}
            <div className={styles.solutionWrap}>
              <button
                className={`${styles.solutionToggle} ${solutionOpen ? styles.solutionToggleOpen : ''}`}
                onClick={() => setSolutionOpen(v => !v)}
              >
                <div className={styles.toggleLeft}>
                  <span className={`${styles.labelDot} ${styles.dotGold}`} />
                  <span>Full Solution</span>
                </div>
                <div className={styles.toggleRight}>
                  <span>{solutionOpen ? 'Hide' : 'Reveal Solution'}</span>
                  {solutionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              <div className={`${styles.solutionBody} ${solutionOpen ? styles.solutionBodyOpen : ''}`}>
                <div className={styles.solutionInner}>
                  <LatexRenderer>{problem.solution}</LatexRenderer>
                </div>
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ── */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Problem Info</div>
              <dl className={styles.metaList}>
                <div className={styles.metaRow}><dt>Olympiad</dt><dd><Badge type="olympiad" value={problem.olympiad} /></dd></div>
                <div className={styles.metaRow}><dt>Year</dt><dd>{problem.year}</dd></div>
                <div className={styles.metaRow}><dt>Difficulty</dt><dd><Badge type="difficulty" value={problem.difficulty} /></dd></div>
                {problem.gradeLevel && <div className={styles.metaRow}><dt>Grade</dt><dd>Grade {problem.gradeLevel}</dd></div>}
                {problem.tags && (
                  <div className={styles.metaRow}>
                    <dt>Topics</dt>
                    <dd className={styles.metaTags}>
                      {problem.tags.map(t => <Badge key={t} type="tag" value={t} />)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {related.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideTitle}>More from {problem.olympiad}</div>
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
    </div>
  );
}
