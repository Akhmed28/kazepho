import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
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

  const problem = mockProblems.find(p => p.id === id);

  if (!problem) {
    return (
      <div className={styles.notFound}>
        <div className="container">
          <h2>Problem not found</h2>
          <Link to="/problems" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/problems" className={styles.backLink}>
            <ArrowLeft size={15} />
            All Problems
          </Link>
          <span className={styles.breadSep}>›</span>
          <span className={styles.breadCurrent}>{problem.olympiad} {problem.year}</span>
        </div>

        <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.main}>
            {/* Header */}
            <div className={styles.articleHeader}>
              <div className={styles.badges}>
                <Badge type="olympiad" value={problem.olympiad} />
                <Badge type="year" value={problem.year} />
                {problem.gradeLevel && <Badge type="grade" value={problem.gradeLevel} />}
              </div>

              <h1 className={styles.title}>{problem.title}</h1>

              {problem.tags && problem.tags.length > 0 && (
                <div className={styles.tags}>
                  {problem.tags.map(t => <Badge key={t} type="tag" value={t} />)}
                </div>
              )}

              {isAuthenticated && (
                <div className={styles.adminActions}>
                  <Link to={`/edit/${problem.id}`} className={styles.editBtn}>
                    <Edit2 size={14} />
                    Edit Problem
                  </Link>
                  <button className={styles.deleteBtn} onClick={() => navigate('/problems')}>
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Problem Statement */}
            <section className={styles.section}>
              <div className={styles.sectionLabel}>
                <div className={styles.sectionDot} />
                Problem Statement
              </div>
              <div className={styles.content}>
                <LatexRenderer>{problem.statement}</LatexRenderer>
              </div>
            </section>

            {/* Experimental Setup */}
            <section className={styles.section}>
              <div className={styles.sectionLabel}>
                <div className={`${styles.sectionDot} ${styles.sectionDotFlask}`} />
                Experimental Setup
              </div>
              <div className={`${styles.content} ${styles.setupBox}`}>
                <div className={styles.setupIcon}>
                  <FlaskConical size={18} />
                </div>
                <LatexRenderer>{problem.experimentalSetup}</LatexRenderer>
              </div>
            </section>

            {/* Solution - Collapsible */}
            <section className={styles.solutionSection}>
              <button
                className={styles.solutionToggle}
                onClick={() => setSolutionOpen(v => !v)}
              >
                <div className={styles.solutionToggleLeft}>
                  <div className={`${styles.sectionDot} ${styles.sectionDotGold}`} />
                  <span>Full Solution</span>
                </div>
                <div className={styles.solutionToggleRight}>
                  <span className={styles.revealLabel}>
                    {solutionOpen ? 'Hide' : 'Reveal Solution'}
                  </span>
                  {solutionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {solutionOpen && (
                <div className={styles.solutionContent}>
                  <LatexRenderer>{problem.solution}</LatexRenderer>
                </div>
              )}
            </section>
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>Problem Info</div>
              <dl className={styles.metaList}>
                <div className={styles.metaItem}>
                  <dt>Olympiad</dt>
                  <dd><Badge type="olympiad" value={problem.olympiad} /></dd>
                </div>
                <div className={styles.metaItem}>
                  <dt>Year</dt>
                  <dd>{problem.year}</dd>
                </div>
                {problem.gradeLevel && (
                  <div className={styles.metaItem}>
                    <dt>Grade Level</dt>
                    <dd>Grade {problem.gradeLevel}</dd>
                  </div>
                )}
                {problem.tags && (
                  <div className={styles.metaItem}>
                    <dt>Topics</dt>
                    <dd className={styles.metaTags}>
                      {problem.tags.map(t => <Badge key={t} type="tag" value={t} />)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>More from {problem.olympiad}</div>
              <div className={styles.relatedList}>
                {mockProblems
                  .filter(p => p.olympiad === problem.olympiad && p.id !== problem.id)
                  .slice(0, 3)
                  .map(p => (
                    <Link key={p.id} to={`/problems/${p.id}`} className={styles.relatedItem}>
                      <span className={styles.relatedTitle}>{p.title}</span>
                      <span className={styles.relatedYear}>{p.year}</span>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
