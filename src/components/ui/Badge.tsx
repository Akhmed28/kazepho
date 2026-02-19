import styles from './Badge.module.css';
import { Olympiad } from '../../types';

interface BadgeProps {
  type: 'olympiad' | 'grade' | 'year' | 'tag';
  value: string | number;
}

export default function Badge({ type, value }: BadgeProps) {
  const cls = type === 'olympiad'
    ? `${styles.badge} ${styles[String(value).toLowerCase().replace('ı', 'i')]}`
    : type === 'grade'
    ? `${styles.badge} ${styles.grade}`
    : type === 'year'
    ? `${styles.badge} ${styles.year}`
    : `${styles.badge} ${styles.tag}`;

  const label = type === 'grade' ? `Grade ${value}` : String(value);

  return <span className={cls}>{label}</span>;
}

export function OlympiadBadge({ olympiad }: { olympiad: Olympiad }) {
  return <Badge type="olympiad" value={olympiad} />;
}
