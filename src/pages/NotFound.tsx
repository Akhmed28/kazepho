import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FlaskConical, Home, Search } from 'lucide-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.inner}>
        <div className={styles.iconWrap}>
          <FlaskConical size={32} />
          <div className={styles.iconRing} />
        </div>

        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.desc}>
          This page doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            <Home size={15} />
            Go Home
          </Link>
          <Link to="/problems" className={styles.btnSecondary}>
            <Search size={15} />
            Browse Problems
          </Link>
          <button className={styles.btnGhost} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>

        <div className={styles.suggestions}>
          <p>Or try one of these:</p>
          <div className={styles.links}>
            <Link to="/problems?olympiad=KazEPhO">KazEPhO Problems</Link>
            <Link to="/problems?olympiad=IZhO">IZhO Problems</Link>
            <Link to="/problems?difficulty=Hard">Hard Problems</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
