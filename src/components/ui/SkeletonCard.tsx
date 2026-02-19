import styles from './SkeletonCard.module.css';

export default function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <div className={styles.card} style={{ animationDelay: `${index * 80}ms` }}>
      <div className={styles.header}>
        <div className={styles.row}>
          <div className={`${styles.pill} ${styles.w16}`} />
          <div className={`${styles.pill} ${styles.w12}`} />
          <div className={`${styles.pill} ${styles.w14}`} />
        </div>
        <div className={`${styles.pill} ${styles.w10}`} />
      </div>
      <div className={styles.body}>
        <div className={`${styles.icon}`} />
        <div className={styles.titleGroup}>
          <div className={`${styles.line} ${styles.w80}`} />
          <div className={`${styles.line} ${styles.w60}`} />
        </div>
      </div>
      <div className={styles.preview}>
        <div className={`${styles.line} ${styles.w100}`} />
        <div className={`${styles.line} ${styles.w75}`} />
      </div>
      <div className={styles.footer}>
        <div className={`${styles.line} ${styles.w40}`} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} index={i} />)}
    </div>
  );
}
