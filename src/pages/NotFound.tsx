import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Home, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <FlaskConical size={32} />
          <div className={styles.iconRing} />
        </div>

        <div className={styles.code}>{t('notfound_code')}</div>
        <h1 className={styles.title}>{t('notfound_title')}</h1>
        <p className={styles.desc}>{t('notfound_desc')}</p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            <Home size={15} />
            {t('notfound_go_home')}
          </Link>
          <Link to="/problems" className={styles.btnSecondary}>
            <Search size={15} />
            {t('notfound_browse')}
          </Link>
          <button className={styles.btnGhost} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            {t('notfound_go_back')}
          </button>
        </div>

        <div className={styles.suggestions}>
          <p>{t('notfound_try')}</p>
          <div className={styles.links}>
            <Link to="/problems?olympiad=KazEPhO">{t('notfound_kazepho')}</Link>
            <Link to="/problems?olympiad=IZhO">{t('notfound_izho')}</Link>
            <Link to="/problems?difficulty=Hard">{t('notfound_hard')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
