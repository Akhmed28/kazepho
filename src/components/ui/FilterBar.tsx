import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterState, Olympiad, Difficulty } from '../../types';
import { years, gradeLevels, difficulties } from '../../data/mockProblems';
import { useLanguage } from '../../context/LanguageContext';
import styles from './FilterBar.module.css';

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  total: number;
  olympiads?: string[];
}

const defaultFilters: FilterState = {
  olympiad: 'All', year: 'All', gradeLevel: 'All', difficulty: 'All', search: '',
};

export default function FilterBar({ filters, onChange, total, olympiads = ['KazEPhO', 'Respa', 'IZhO'] }: Props) {
  const { t } = useLanguage();
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const hasActive = filters.olympiad !== 'All' || filters.year !== 'All' ||
    filters.gradeLevel !== 'All' || filters.difficulty !== 'All' || filters.search !== '';

  const resultLabel = total === 1 ? t('filter_results') : t('filter_results_plural');

  return (
    <div className={styles.wrap}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('filter_search_placeholder')}
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
          <span>{total} {resultLabel}</span>
          {hasActive && (
            <button className={styles.resetBtn} onClick={() => onChange(defaultFilters)}>
              {t('filter_clear_all')}
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{t('filter_olympiad')}</span>
          <div className={styles.pills}>
            {(['All', ...olympiads] as const).map(o => (
              <button
                key={o}
                className={`${styles.pill} ${filters.olympiad === o ? styles.pillActive : ''} ${styles[`pill_${o.toLowerCase()}`] || ''}`}
                onClick={() => set('olympiad', o as Olympiad | 'All')}
              >{o === 'All' ? t('filter_all') : o}</button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{t('filter_difficulty')}</span>
          <div className={styles.pills}>
            {(['All', ...difficulties] as const).map(d => (
              <button
                key={d}
                className={`${styles.pill} ${filters.difficulty === d ? styles.pillActive : ''} ${styles[`pillDiff${d}`] || ''}`}
                onClick={() => set('difficulty', d as Difficulty | 'All')}
              >{d === 'All' ? t('filter_all') : d}</button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{t('filter_year')}</span>
          <select
            className={styles.select}
            value={String(filters.year)}
            onChange={e => set('year', e.target.value === 'All' ? 'All' : Number(e.target.value))}
          >
            <option value="All">{t('filter_all_years')}</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{t('filter_grade')}</span>
          <select
            className={styles.select}
            value={String(filters.gradeLevel)}
            onChange={e => set('gradeLevel', e.target.value === 'All' ? 'All' : Number(e.target.value) as 8|9|10|11)}
          >
            <option value="All">{t('filter_all_grades')}</option>
            {gradeLevels.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
