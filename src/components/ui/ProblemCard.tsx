import { Link } from 'react-router-dom';
import { ChevronRight, Atom } from 'lucide-react';
import { Problem } from '../../types';
import Badge from './Badge';
import styles from './ProblemCard.module.css';

interface Props {
  problem: Problem;
  index?: number;
}

export default function ProblemCard({ problem, index = 0 }: Props) {
  return (
    <Link
      to={`/problems/${problem.id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className={styles.glow} />

      <div className={styles.header}>
        <div className={styles.badges}>
          <Badge type="olympiad" value={problem.olympiad} />
          <Badge type="year" value={problem.year} />
          {problem.gradeLevel && <Badge type="grade" value={problem.gradeLevel} />}
        </div>
        <Badge type="difficulty" value={problem.difficulty} />
      </div>

      <div className={styles.body}>
        <div className={styles.iconWrap}>
          <Atom size={15} />
        </div>
        <h3 className={styles.title}>{problem.title}</h3>
      </div>

      <p className={styles.preview}>
        {problem.statement.replace(/\$[^$]+\$/g, '…').slice(0, 110)}…
      </p>

      {problem.tags && problem.tags.length > 0 && (
        <div className={styles.tags}>
          {problem.tags.slice(0, 3).map(tag => (
            <Badge key={tag} type="tag" value={tag} />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.viewLink}>View Problem & Solution</span>
        <ChevronRight size={15} className={styles.arrow} />
      </div>
    </Link>
  );
}
