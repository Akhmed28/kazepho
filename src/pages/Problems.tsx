import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { mockProblems } from '../data/mockProblems';
import { FilterState, Olympiad } from '../types';
import FilterBar from '../components/ui/FilterBar';
import ProblemCard from '../components/ui/ProblemCard';
import styles from './Problems.module.css';

const defaultFilters: FilterState = {
  olympiad: 'All',
  year: 'All',
  gradeLevel: 'All',
  search: '',
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
          <div>
            <div className="gold-line" />
            <h1 className={styles.title}>Problems Archive</h1>
            <p className={styles.subtitle}>
              Browse experimental physics problems from KazEPhO, Respa, and IZhO competitions.
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onChange={setFilters} total={filtered.length} />

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <BookOpen size={40} color="var(--text-muted)" />
            <p>No problems match your filters.</p>
            <button
              className={styles.resetBtn}
              onClick={() => setFilters(defaultFilters)}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
