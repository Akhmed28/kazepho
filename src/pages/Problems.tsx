import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import { FilterState, Olympiad } from '../types';
import FilterBar from '../components/ui/FilterBar';
import ProblemCard from '../components/ui/ProblemCard';
import styles from './Problems.module.css';

const defaultFilters: FilterState = {
  olympiad: 'All', year: 'All', gradeLevel: 'All', difficulty: 'All', search: '',
};

export default function Problems() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    olympiad: (searchParams.get('olympiad') as Olympiad) || 'All',
  }));

  useEffect(() => {
    const o = searchParams.get('olympiad') as Olympiad | null;
    if (o) setFilters(f => ({ ...f, olympiad: o }));
  }, [searchParams]);

  const filtered = useMemo(() => {
    return mockProblems.filter(p => {
      if (filters.olympiad !== 'All' && p.olympiad !== filters.olympiad) return false;
      if (filters.year !== 'All' && p.year !== filters.year) return false;
      if (filters.gradeLevel !== 'All' && p.gradeLevel !== filters.gradeLevel) return false;
      if (filters.difficulty !== 'All' && p.difficulty !== filters.difficulty) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.olympiad.toLowerCase().includes(q) ||
          (p.tags || []).some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filters]);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div className="gold-line" />
          <h1 className={styles.title}>Problems Archive</h1>
          <p className={styles.subtitle}>
            Browse experimental physics problems from KazEPhO, Respa, and IZhO.
          </p>
        </div>

        <FilterBar filters={filters} onChange={setFilters} total={filtered.length} />

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((p, i) => <ProblemCard key={p.id} problem={p} index={i} />)}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><BookOpen size={36} /></div>
            <h3>No problems found</h3>
            <p>Try adjusting your filters or search term.</p>
            <button className={styles.resetBtn} onClick={() => setFilters(defaultFilters)}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
