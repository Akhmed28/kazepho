import { useState, useEffect, useCallback } from 'react';
import { Problem } from '../types';
import { mockProblems } from '../data/mockProblems';

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL;

async function loadFromSupabase(): Promise<Problem[]> {
  const { fetchProblems } = await import('../lib/supabase');
  return fetchProblems();
}

async function loadByIdFromSupabase(id: string): Promise<Problem | null> {
  const { fetchProblemById } = await import('../lib/supabase');
  return fetchProblemById(id);
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 600));
        setProblems(mockProblems);
      } else {
        const data = await loadFromSupabase();
        setProblems(data);
      }
    } catch (_e) {
      setError('Failed to load problems. Please try again.');
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
    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 400));
          setProblem(mockProblems.find(p => p.id === id) ?? null);
        } else {
          const data = await loadByIdFromSupabase(id);
          setProblem(data);
        }
      } catch (_e) {
        setError('Failed to load problem.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return { problem, loading, error };
}
