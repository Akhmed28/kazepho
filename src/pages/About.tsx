import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Atom, Waves, Trophy, Users, BookOpen, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './About.module.css';

export default function About() {
  const { t } = useLanguage();

  const timeline = [
    { year: '2018', event: t('about_timeline_1') },
    { year: '2019', event: t('about_timeline_2') },
    { year: '2021', event: t('about_timeline_3') },
    { year: '2023', event: t('about_timeline_4') },
  ];

  const olympiads = [
    {
      name: 'KazEPhO',
      full: t('home_kazepho_full'),
      color: 'var(--kazepho)',
      bg: 'rgba(74,158,255,0.07)',
      border: 'rgba(74,158,255,0.18)',
      icon: FlaskConical,
      desc: t('about_kazepho_desc'),
    },
    {
      name: 'Respa',
      full: t('home_respa_full'),
      color: 'var(--respa)',
      bg: 'rgba(62,217,138,0.07)',
      border: 'rgba(62,217,138,0.18)',
      icon: Atom,
      desc: t('about_respa_desc'),
    },
    {
      name: 'IZhO',
      full: t('home_izho_full'),
      color: 'var(--izho)',
      bg: 'rgba(244,113,74,0.07)',
      border: 'rgba(244,113,74,0.18)',
      icon: Waves,
      desc: t('about_izho_desc'),
    },
  ];

  const stats = [
    { icon: BookOpen, value: '3', label: t('about_stat_olympiads') },
    { icon: Trophy, value: '5+', label: t('about_stat_years') },
    { icon: Users, value: '∞', label: t('about_stat_free') },
    { icon: Globe, value: '1', label: t('about_stat_platform') },
  ];

  const missionCards = [
    { title: t('about_for_students'), desc: t('about_for_students_desc') },
    { title: t('about_for_teachers'), desc: t('about_for_teachers_desc') },
    { title: t('about_for_organizers'), desc: t('about_for_organizers_desc') },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow}>{t('about_eyebrow')}</div>
            <h1 className={styles.heroTitle}>
              {t('about_hero_1')}<br />
              <span className={styles.goldText}>{t('about_hero_2')}</span>
            </h1>
            <p className={styles.heroDesc}>
              {t('about_hero_desc')}
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
              <h2>{t('about_mission')}</h2>
              <p className={styles.bodyText}>
                {t('about_mission_p1')}
              </p>
              <p className={styles.bodyText}>
                {t('about_mission_p2')}
              </p>
              <Link to="/problems" className={styles.ctaBtn}>
                {t('about_browse_problems')} <ArrowRight size={15} />
              </Link>
            </div>
            <div className={styles.missionCards}>
              {missionCards.map(c => (
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
          <h2 className={styles.sectionTitle}>{t('about_olympiad_title')}</h2>
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
                  {t('about_view_problems')} <ArrowRight size={13} />
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
          <h2 className={styles.sectionTitle}>{t('about_history')}</h2>
          <div className={styles.timeline}>
            {timeline.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineText}>{item.event}</div>
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
            <h2>{t('about_cta_title')}</h2>
            <p>{t('about_cta_desc')}</p>
            <Link to="/problems" className={styles.ctaBtnLarge}>
              {t('about_cta_btn')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
