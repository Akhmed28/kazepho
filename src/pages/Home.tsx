import { Link } from 'react-router-dom';
import { FlaskConical, BookOpen, Users, Star, ArrowRight, Atom, Waves, Zap } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import ProblemCard from '../components/ui/ProblemCard';
import styles from './Home.module.css';

const stats = [
  { label: 'Problems', value: mockProblems.length + '+', icon: BookOpen },
  { label: 'Olympiads', value: '3', icon: Star },
  { label: 'Students', value: '∞', icon: Users },
];

const olympiadInfo = [
  {
    name: 'KazEPhO',
    full: 'Kazakhstan Experimental Physics Olympiad',
    color: 'var(--kazepho)',
    bg: 'rgba(74,158,255,0.08)',
    border: 'rgba(74,158,255,0.2)',
    icon: FlaskConical,
    desc: 'The flagship national competition for experimental physics. Original problems designed by Kazakhstani educators.',
    years: '2018–2024',
  },
  {
    name: 'Respa',
    full: 'Republican Physics Olympiad',
    color: 'var(--respa)',
    bg: 'rgba(72,216,154,0.08)',
    border: 'rgba(72,216,154,0.2)',
    icon: Atom,
    desc: 'Republic-level competition covering a broad range of physics topics for students in grades 8–11.',
    years: '2018–2024',
  },
  {
    name: 'IZhO',
    full: 'International Zhautykov Olympiad',
    color: 'var(--izho)',
    bg: 'rgba(244,124,78,0.08)',
    border: 'rgba(244,124,78,0.2)',
    icon: Waves,
    desc: 'An international competition hosted in Almaty. Known for its challenging experimental rounds.',
    years: '2018–2024',
  },
];

export default function Home() {
  const featured = mockProblems.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroEyebrow}>
              <Zap size={13} />
              <span>Kazakhstan Experimental Physics Olympiad</span>
            </div>
            <h1 className={styles.heroTitle}>
              Master Experimental<br />
              <em>Physics</em> Olympiad Problems
            </h1>
            <p className={styles.heroDesc}>
              A curated archive of experimental physics problems from KazEPhO, Respa, and IZhO
              — complete with full solutions, LaTeX-formatted equations, and experimental methodology.
            </p>
            <div className={styles.heroCta}>
              <Link to="/problems" className={styles.ctaPrimary}>
                Browse Problems
                <ArrowRight size={16} />
              </Link>
              <Link to="/problems?olympiad=KazEPhO" className={styles.ctaSecondary}>
                KazEPhO Archive
              </Link>
            </div>

            <div className={styles.stats}>
              {stats.map(s => (
                <div key={s.label} className={styles.stat}>
                  <s.icon size={18} color="var(--gold)" />
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Olympiad Sources */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="gold-line" />
            <h2>Problem Sources</h2>
            <p className={styles.sectionDesc}>
              Problems are sourced from three major Kazakhstan physics competitions.
            </p>
          </div>
          <div className={styles.olympiadGrid}>
            {olympiadInfo.map(o => (
              <Link
                key={o.name}
                to={`/problems?olympiad=${o.name}`}
                className={styles.olympiadCard}
                style={{
                  '--card-color': o.color,
                  '--card-bg': o.bg,
                  '--card-border': o.border,
                } as React.CSSProperties}
              >
                <div className={styles.olympiadIcon}>
                  <o.icon size={22} />
                </div>
                <div>
                  <div className={styles.olympiadName}>{o.name}</div>
                  <div className={styles.olympiadFull}>{o.full}</div>
                </div>
                <p className={styles.olympiadDesc}>{o.desc}</p>
                <div className={styles.olympiadMeta}>
                  <span>{o.years}</span>
                  <ArrowRight size={14} className={styles.olympiadArrow} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div className="gold-line" />
            <div className={styles.sectionHeaderRow}>
              <h2>Recent Problems</h2>
              <Link to="/problems" className={styles.seeAll}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className={styles.problemGrid}>
            {featured.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
