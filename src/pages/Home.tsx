import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, Atom, Waves, BookOpen, Users, Trophy, Edit2, Check, X } from 'lucide-react';
import { useProblems } from '../hooks/useProblems';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSiteStats, SiteStats } from '../hooks/useSiteStats';
import ProblemCard from '../components/ui/ProblemCard';
import PhysicsCanvas from '../components/ui/PhysicsCanvas';
import styles from './Home.module.css';

export default function Home() {
  const { problems, loading } = useProblems();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { stats: siteStats, updateStats } = useSiteStats();
  const [editingStats, setEditingStats] = useState(false);
  const [draft, setDraft] = useState<SiteStats>(siteStats);

  const olympiadInfo = [
    {
      name: 'KazEPhO', full: t('home_kazepho_full'),
      color: 'var(--kazepho)', bg: 'rgba(74,158,255,0.07)', border: 'rgba(74,158,255,0.18)',
      icon: FlaskConical, desc: t('home_kazepho_desc'),
    },
    {
      name: 'Respa', full: t('home_respa_full'),
      color: 'var(--respa)', bg: 'rgba(62,217,138,0.07)', border: 'rgba(62,217,138,0.18)',
      icon: Atom, desc: t('home_respa_desc'),
    },
    {
      name: 'IZhO', full: t('home_izho_full'),
      color: 'var(--izho)', bg: 'rgba(244,113,74,0.07)', border: 'rgba(244,113,74,0.18)',
      icon: Waves, desc: t('home_izho_desc'),
    },
  ];

  const featured = problems.slice(0, 3);

  // Compute default values — use custom stats if set, otherwise auto-compute
  const problemCount = loading ? '…' : `${problems.length}+`;
  const olympiadCount = loading ? '…' : String(new Set(problems.map(p => p.olympiad)).size);

  const stat1Val = siteStats.stat1_value || problemCount;
  const stat1Lbl = siteStats.stat1_label || t('home_stat_problems');
  const stat2Val = siteStats.stat2_value || olympiadCount;
  const stat2Lbl = siteStats.stat2_label || t('home_stat_olympiads');
  const stat3Val = siteStats.stat3_value || '∞';
  const stat3Lbl = siteStats.stat3_label || t('home_stat_students');

  const displayStats = [
    { icon: BookOpen, value: stat1Val, label: stat1Lbl },
    { icon: Trophy, value: stat2Val, label: stat2Lbl },
    { icon: Users, value: stat3Val, label: stat3Lbl },
  ];

  const handleStartEdit = () => {
    setDraft({
      stat1_value: siteStats.stat1_value || '',
      stat1_label: siteStats.stat1_label || '',
      stat2_value: siteStats.stat2_value || '',
      stat2_label: siteStats.stat2_label || '',
      stat3_value: siteStats.stat3_value || '',
      stat3_label: siteStats.stat3_label || '',
    });
    setEditingStats(true);
  };

  const handleSaveStats = () => {
    updateStats(draft);
    setEditingStats(false);
  };

  const handleCancelEdit = () => {
    setEditingStats(false);
  };

  const setDraftField = (field: keyof SiteStats, value: string) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.page}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <PhysicsCanvas />
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className={styles.heroInner}>
            <div className={styles.eyebrow} style={{ animationDelay: '0ms' }}>
              <span className={styles.eyebrowDot} />
              {t('home_eyebrow')}
            </div>

            <h1 className={styles.heroTitle} style={{ animationDelay: '80ms' }}>
              {t('home_hero_title_1')}<br />
              <span className={styles.goldText}>{t('home_hero_title_2')}</span>
            </h1>

            <p className={styles.heroDesc} style={{ animationDelay: '160ms' }}>
              {t('home_hero_desc')}
            </p>

            <div className={styles.heroCta} style={{ animationDelay: '240ms' }}>
              <Link to="/problems" className={styles.ctaPrimary}>
                {t('home_cta_browse')} <ArrowRight size={16} />
              </Link>
              <Link to="/about" className={styles.ctaSecondary}>
                {t('home_cta_learn')}
              </Link>
            </div>

            {/* ── Stats row ── */}
            <div className={styles.statsRow} style={{ animationDelay: '320ms' }}>
              {editingStats ? (
                <div className={styles.statsEditGrid}>
                  {[
                    { valKey: 'stat1_value' as const, lblKey: 'stat1_label' as const, placeholder: problemCount, lblPlaceholder: t('home_stat_problems') },
                    { valKey: 'stat2_value' as const, lblKey: 'stat2_label' as const, placeholder: olympiadCount, lblPlaceholder: t('home_stat_olympiads') },
                    { valKey: 'stat3_value' as const, lblKey: 'stat3_label' as const, placeholder: '∞', lblPlaceholder: t('home_stat_students') },
                  ].map(({ valKey, lblKey, placeholder, lblPlaceholder }) => (
                    <div key={valKey} className={styles.statEditItem}>
                      <input
                        className={styles.statEditInput}
                        value={draft[valKey]}
                        onChange={e => setDraftField(valKey, e.target.value)}
                        placeholder={placeholder}
                      />
                      <input
                        className={styles.statEditInput}
                        value={draft[lblKey]}
                        onChange={e => setDraftField(lblKey, e.target.value)}
                        placeholder={lblPlaceholder}
                      />
                    </div>
                  ))}
                  <div className={styles.statEditActions}>
                    <button className={styles.statEditSave} onClick={handleSaveStats}><Check size={14} /></button>
                    <button className={styles.statEditCancel} onClick={handleCancelEdit}><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <>
                  {displayStats.map(s => (
                    <div key={s.label} className={styles.stat}>
                      <s.icon size={16} className={styles.statIcon} />
                      <span className={styles.statVal}>{s.value}</span>
                      <span className={styles.statLabel}>{s.label}</span>
                    </div>
                  ))}
                  {isAuthenticated && (
                    <button className={styles.statEditBtn} onClick={handleStartEdit} title="Edit stats">
                      <Edit2 size={13} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

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
            <h2>{t('home_section_sources')}</h2>
            <p className={styles.sectionSub}>{t('home_section_sources_sub')}</p>
          </div>
          <div className={styles.olympiadGrid}>
            {olympiadInfo.map((o, i) => (
              <Link
                key={o.name}
                to={`/problems?olympiad=${o.name}`}
                className={styles.olympiadCard}
                style={{ '--c': o.color, '--cb': o.bg, '--cborder': o.border, animationDelay: `${i * 100}ms` } as React.CSSProperties}
              >
                <div className={styles.ocGlow} />
                <div className={styles.ocIcon}><o.icon size={24} /></div>
                <div>
                  <div className={styles.ocName}>{o.name}</div>
                  <div className={styles.ocFull}>{o.full}</div>
                </div>
                <p className={styles.ocDesc}>{o.desc}</p>
                <div className={styles.ocFooter}>
                  <span>{t('home_explore_problems')}</span>
                  <ArrowRight size={14} className={styles.ocArrow} />
                </div>
              </Link>
            ))}
          </div>
        </div>
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
              <h2>{t('home_section_recent')}</h2>
              <Link to="/problems" className={styles.seeAll}>{t('home_view_all_link')} <ArrowRight size={14} /></Link>
            </div>
          </div>
          {loading ? (
            <div className={styles.loadingRow}>
              {[1,2,3].map(i => <div key={i} className={styles.skeletonCard} />)}
            </div>
          ) : featured.length > 0 ? (
            <div className={styles.problemGrid}>
              {featured.map((p, i) => <ProblemCard key={p.id} problem={p} index={i} />)}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <BookOpen size={32} />
              <p>{t('home_empty_problems')} <Link to="/add">{t('home_empty_add')}</Link></p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
