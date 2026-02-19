import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Atom, Waves, BookOpen, Users, Trophy } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import ProblemCard from '../components/ui/ProblemCard';
import PhysicsCanvas from '../components/ui/PhysicsCanvas';
import styles from './Home.module.css';

const olympiadInfo = [
  {
    name: 'KazEPhO',
    full: 'Kazakhstan Experimental Physics Olympiad',
    color: 'var(--kazepho)',
    bg: 'rgba(74,158,255,0.07)',
    border: 'rgba(74,158,255,0.18)',
    icon: FlaskConical,
    desc: 'The flagship national competition. Original problems designed by Kazakhstani educators.',
  },
  {
    name: 'Respa',
    full: 'Republican Physics Olympiad',
    color: 'var(--respa)',
    bg: 'rgba(62,217,138,0.07)',
    border: 'rgba(62,217,138,0.18)',
    icon: Atom,
    desc: 'Republic-level competition covering a broad range of physics for grades 8–11.',
  },
  {
    name: 'IZhO',
    full: 'International Zhautykov Olympiad',
    color: 'var(--izho)',
    bg: 'rgba(244,113,74,0.07)',
    border: 'rgba(244,113,74,0.18)',
    icon: Waves,
    desc: 'International competition hosted in Almaty, known for its challenging experimental rounds.',
  },
];

const stats = [
  { icon: BookOpen, value: '6+', label: 'Problems' },
  { icon: Trophy, value: '3', label: 'Olympiads' },
  { icon: Users, value: '∞', label: 'Students' },
];

export default function Home() {
  const featured = mockProblems.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <PhysicsCanvas />

        {/* Decorative blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow} style={{ animationDelay: '0ms' }}>
              <span className={styles.eyebrowDot} />
              Kazakhstan Experimental Physics Olympiad
            </div>

            <h1 className={styles.heroTitle} style={{ animationDelay: '80ms' }}>
              Master the Art of<br />
              <span className={styles.goldText}>Experimental Physics</span>
            </h1>

            <p className={styles.heroDesc} style={{ animationDelay: '160ms' }}>
              A curated archive of experimental physics problems from KazEPhO, Respa, and IZhO —
              with full LaTeX solutions, methodology, and experimental setups.
            </p>

            <div className={styles.heroCta} style={{ animationDelay: '240ms' }}>
              <Link to="/problems" className={styles.ctaPrimary}>
                Browse Problems
                <ArrowRight size={16} />
              </Link>
              <Link to="/problems?olympiad=KazEPhO" className={styles.ctaSecondary}>
                KazEPhO Archive
              </Link>
            </div>

            <div className={styles.statsRow} style={{ animationDelay: '320ms' }}>
              {stats.map(s => (
                <div key={s.label} className={styles.stat}>
                  <s.icon size={16} className={styles.statIcon} />
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wavy bottom edge */}
        <div className={styles.waveDivider}>
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" fill="var(--bg-surface)" />
          </svg>
        </div>
      </section>

      {/* ── OLYMPIAD CARDS ── */}
      <section className={styles.section} style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div className="gold-line" />
            <h2>Problem Sources</h2>
            <p className={styles.sectionSub}>Three major Kazakhstan physics competitions, all in one place.</p>
          </div>

          <div className={styles.olympiadGrid}>
            {olympiadInfo.map((o, i) => (
              <Link
                key={o.name}
                to={`/problems?olympiad=${o.name}`}
                className={styles.olympiadCard}
                style={{
                  '--c': o.color,
                  '--cb': o.bg,
                  '--cborder': o.border,
                  animationDelay: `${i * 100}ms`,
                } as React.CSSProperties}
              >
                <div className={styles.ocGlow} />
                <div className={styles.ocIcon}>
                  <o.icon size={24} />
                </div>
                <div>
                  <div className={styles.ocName}>{o.name}</div>
                  <div className={styles.ocFull}>{o.full}</div>
                </div>
                <p className={styles.ocDesc}>{o.desc}</p>
                <div className={styles.ocFooter}>
                  <span>Explore problems</span>
                  <ArrowRight size={14} className={styles.ocArrow} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Wave to next section */}
        <div className={styles.waveDivider}>
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg-base)" />
          </svg>
        </div>
      </section>

      {/* ── RECENT PROBLEMS ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <div className="gold-line" />
            <div className={styles.sectionHeadRow}>
              <h2>Recent Problems</h2>
              <Link to="/problems" className={styles.seeAll}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className={styles.problemGrid}>
            {featured.map((p, i) => <ProblemCard key={p.id} problem={p} index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
