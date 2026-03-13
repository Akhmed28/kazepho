import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Atom, Waves, Trophy, Users, BookOpen, Globe } from 'lucide-react';
import styles from './About.module.css';

const timeline = [
  { year: '2018', event: 'KazEPhO founded in Almaty by a group of physics educators.' },
  { year: '2019', event: 'First official olympiad held with 120 participants from 12 regions.' },
  { year: '2021', event: 'Partnership established with IZhO organizing committee.' },
  { year: '2023', event: 'Archive project launched to preserve and share problems digitally.' },
];

const olympiads = [
  {
    name: 'KazEPhO',
    full: 'Kazakhstan Experimental Physics Olympiad',
    color: 'var(--kazepho)',
    bg: 'rgba(74,158,255,0.07)',
    border: 'rgba(74,158,255,0.18)',
    icon: FlaskConical,
    desc: 'The flagship national experimental physics competition. Problems are designed by Kazakhstani educators and focus on hands-on experimental methodology, measurement uncertainty, and physical intuition.',
  },
  {
    name: 'Respa',
    full: 'Republican Physics Olympiad',
    color: 'var(--respa)',
    bg: 'rgba(62,217,138,0.07)',
    border: 'rgba(62,217,138,0.18)',
    icon: Atom,
    desc: 'The republic-level competition covering both theoretical and experimental physics for grades 8–11. Serves as a qualifier for international competitions.',
  },
  {
    name: 'IZhO',
    full: 'International Zhautykov Olympiad',
    color: 'var(--izho)',
    bg: 'rgba(244,113,74,0.07)',
    border: 'rgba(244,113,74,0.18)',
    icon: Waves,
    desc: 'An international competition hosted annually in Almaty. Known for its challenging experimental rounds and attracts participants from over 30 countries.',
  },
];

const stats = [
  { icon: BookOpen, value: '3', label: 'Olympiads covered' },
  { icon: Trophy, value: '5+', label: 'Years of problems' },
  { icon: Users, value: '∞', label: 'Free for all students' },
  { icon: Globe, value: '1', label: 'Archive platform' },
];

export default function About() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>About KazEPhO Archive</div>
            <h1 className={styles.heroTitle}>
              Preserving Kazakhstan's Physics<br />
              <span className={styles.goldText}>Olympiad Heritage</span>
            </h1>
            <p className={styles.heroDesc}>
              A free, open archive of experimental physics problems from Kazakhstan's
              top olympiads — built for students, teachers, and physics enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map(s => (
              <div key={s.label} className={styles.statCard}>
                <s.icon size={22} className={styles.statIcon} />
                <div className={styles.statVal}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div>
              <div className="gold-line" />
              <h2>Our Mission</h2>
              <p className={styles.bodyText}>
                Experimental physics olympiads develop a rare set of skills — the ability to
                design experiments, handle real equipment, estimate uncertainties, and communicate
                findings clearly. These are skills that textbooks alone cannot teach.
              </p>
              <p className={styles.bodyText}>
                Yet the problems from these competitions were largely scattered, lost after each
                olympiad season, or accessible only to a select few. This archive exists to
                change that — making every problem, solution, and methodology freely available
                to any student in Kazakhstan and beyond.
              </p>
              <Link to="/problems" className={styles.ctaBtn}>
                Browse Problems <ArrowRight size={15} />
              </Link>
            </div>
            <div className={styles.missionCards}>
              {[
                { title: 'For Students', desc: 'Practice with real olympiad problems, study full solutions, and understand experimental methodology.' },
                { title: 'For Teachers', desc: 'Find problems by topic, difficulty, and grade level. Use as teaching material or competition preparation.' },
                { title: 'For Organizers', desc: 'Reference historical problems to avoid repetition and maintain the high standard of Kazakhstani olympiads.' },
              ].map(c => (
                <div key={c.title} className={styles.missionCard}>
                  <div className={styles.missionCardTitle}>{c.title}</div>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Olympiads */}
      <section className={styles.section} style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="gold-line" />
          <h2 className={styles.sectionTitle}>The Olympiads</h2>
          <div className={styles.olympiadList}>
            {olympiads.map(o => (
              <div
                key={o.name}
                className={styles.olympiadItem}
                style={{ '--c': o.color, '--cb': o.bg, '--cborder': o.border } as React.CSSProperties}
              >
                <div className={styles.olympiadIcon}><o.icon size={22} /></div>
                <div className={styles.olympiadContent}>
                  <div className={styles.olympiadName}>{o.name}</div>
                  <div className={styles.olympiadFull}>{o.full}</div>
                  <p className={styles.olympiadDesc}>{o.desc}</p>
                </div>
                <Link to={`/problems?olympiad=${o.name}`} className={styles.olympiadLink}>
                  View problems <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.section}>
        <div className="container">
          <div className="gold-line" />
          <h2 className={styles.sectionTitle}>History</h2>
          <div className={styles.timeline}>
            {timeline.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{t.year}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineText}>{t.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaGlow} />
            <h2>Start Exploring</h2>
            <p>Browse the full archive of experimental physics problems.</p>
            <Link to="/problems" className={styles.ctaBtnLarge}>
              View All Problems <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
