import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterState, Olympiad } from '../../types';
import { olympiads, years, gradeLevels } from '../../data/mockProblems';
import styles from './FilterBar.module.css';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  total: number;
}

export default function FilterBar({ filters, onChange, total }: Props) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className={styles.wrap}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search problems…"
            value={filters.search}
            onChange={e => set('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.count}>
          <SlidersHorizontal size={14} />
          <span>{total} problem{total !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Olympiad</label>
          <div className={styles.pills}>
            <button
              className={`${styles.pill} ${filters.olympiad === 'All' ? styles.pillActive : ''}`}
              onClick={() => set('olympiad', 'All')}
            >All</button>
            {olympiads.map(o => (
              <button
                key={o}
                className={`${styles.pill} ${filters.olympiad === o ? styles.pillActive : ''} ${styles[`pill${o}`]}`}
                onClick={() => set('olympiad', o as Olympiad)}
              >{o}</button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Year</label>
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
          <label className={styles.filterLabel}>Grade</label>
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
