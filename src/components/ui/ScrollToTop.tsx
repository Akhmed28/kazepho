import { useScrollTop } from '../../hooks/useScrollTop';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
  const { visible, scrollToTop } = useScrollTop();

  return (
    <button
      className={`${styles.btn} ${visible ? styles.btnVisible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
