import { useState, useEffect, useCallback } from 'react';
import { Problem } from '../types';
import { fetchProblems, fetchProblemById } from '../lib/supabase';
import { mockProblems } from '../data/mockProblems';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 600)); // simulate load
        setProblems(mockProblems);
      } else {
        const data = await fetchProblems();
        setProblems(data);
      }
    } catch (e) {
      setError('Failed to load problems. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { problems, loading, error, refetch: load };
}

export function useProblem(id: string | undefined) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 400));
          const found = mockProblems.find(p => p.id === id) || null;
          setProblem(found);
        } else {
          const data = await fetchProblemById(id);
          setProblem(data);
        }
      } catch (e) {
        setError('Failed to load problem.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  return { problem, loading, error };
}
