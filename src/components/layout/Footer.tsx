import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.brand}>
            <FlaskConical size={18} color="var(--gold)" />
            <span>KazEPhO</span>
          </div>
          <p className={styles.tagline}>
            {t('footer_tagline')}
          </p>
        </div>

        <div className={styles.links}>
          <Link to="/problems">{t('footer_problems')}</Link>
          <Link to="/problems?olympiad=KazEPhO">KazEPhO</Link>
          <Link to="/problems?olympiad=Respa">Respa</Link>
          <Link to="/problems?olympiad=IZhO">IZhO</Link>
        </div>

        <div className={styles.right}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} {t('footer_copy')}
          </p>
        </div>
      </div>
    </footer>
  );
}
