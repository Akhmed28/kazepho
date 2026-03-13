import styles from './Badge.module.css';
import { Olympiad, Difficulty } from '../../types';

interface BadgeProps {
  type: 'olympiad' | 'grade' | 'year' | 'tag' | 'difficulty';
  value: string | number;
}

export default function Badge({ type, value }: BadgeProps) {
  const cls = type === 'olympiad'
    ? `${styles.badge} ${styles[String(value).toLowerCase().replace('ı', 'i')]}`
    : type === 'grade'
    ? `${styles.badge} ${styles.grade}`
    : type === 'year'
    ? `${styles.badge} ${styles.year}`
    : type === 'difficulty'
    ? `${styles.badge} ${styles[`diff${value}`]}`
    : `${styles.badge} ${styles.tag}`;

  const label = type === 'grade' ? `Grade ${value}` : String(value);
  const dot = type === 'difficulty';

  return (
    <span className={cls}>
      {dot && <span className={styles.dot} />}
      {label}
    </span>
  );
}

export function OlympiadBadge({ olympiad }: { olympiad: Olympiad }) {
  return <Badge type="olympiad" value={olympiad} />;
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge type="difficulty" value={difficulty} />;
}
