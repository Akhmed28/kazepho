import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterState, Olympiad, Difficulty } from '../../types';
import { olympiads, years, gradeLevels, difficulties } from '../../data/mockProblems';
import styles from './FilterBar.module.css';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  total: number;
}

const defaultFilters: FilterState = {
  olympiad: 'All', year: 'All', gradeLevel: 'All', difficulty: 'All', search: '',
};

export default function FilterBar({ filters, onChange, total }: Props) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const hasActive = filters.olympiad !== 'All' || filters.year !== 'All' ||
    filters.gradeLevel !== 'All' || filters.difficulty !== 'All' || filters.search !== '';

  return (
    <div className={styles.wrap}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title or topic…"
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className={styles.searchInput}
          />
          {filters.search && (
            <button className={styles.clearSearch} onClick={() => set('search', '')}>
              <X size={13} />
            </button>
          )}
        </div>
        <div className={styles.countRow}>
          <SlidersHorizontal size={13} />
          <span>{total} result{total !== 1 ? 's' : ''}</span>
          {hasActive && (
            <button className={styles.resetBtn} onClick={() => onChange(defaultFilters)}>
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Olympiad</span>
          <div className={styles.pills}>
            {(['All', ...olympiads] as const).map(o => (
              <button
                key={o}
                className={`${styles.pill} ${filters.olympiad === o ? styles.pillActive : ''} ${styles[`pill_${o.toLowerCase()}`] || ''}`}
                onClick={() => set('olympiad', o as Olympiad | 'All')}
              >{o}</button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Difficulty</span>
          <div className={styles.pills}>
            {(['All', ...difficulties] as const).map(d => (
              <button
                key={d}
                className={`${styles.pill} ${filters.difficulty === d ? styles.pillActive : ''} ${styles[`pillDiff${d}`] || ''}`}
                onClick={() => set('difficulty', d as Difficulty | 'All')}
              >{d}</button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Year</span>
          <select
            className={styles.select}
            value={String(filters.year)}
            onChange={e => set('year', e.target.value === 'All' ? 'All' : Number(e.target.value))}
          >
            <option value="All">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Grade</span>
          <select
            className={styles.select}
            value={String(filters.gradeLevel)}
            onChange={e => set('gradeLevel', e.target.value === 'All' ? 'All' : Number(e.target.value) as 8|9|10|11)}
          >
            <option value="All">All grades</option>
            {gradeLevels.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
