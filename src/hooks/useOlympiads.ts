import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_OLYMPIADS = ['KazEPhO', 'Respa', 'IZhO'];

export function useOlympiads() {
  const [olympiads, setOlympiads] = useState<string[]>(DEFAULT_OLYMPIADS);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase on mount
  useEffect(() => {
    async function fetchOlympiads() {
      try {
        const { data, error } = await supabase
          .from('olympiads')
          .select('name')
          .order('name', { ascending: true });

        if (error) throw error;

        const names = (data ?? []).map((row: { name: string }) => row.name);

        // Defaults first, then any extras alphabetically
        const extras = names.filter((n: string) => !DEFAULT_OLYMPIADS.includes(n));
        setOlympiads([...DEFAULT_OLYMPIADS, ...extras]);
      } catch {
        // Fallback to defaults if table doesn't exist yet
        setOlympiads(DEFAULT_OLYMPIADS);
      } finally {
        setLoading(false);
      }
    }

    fetchOlympiads();
  }, []);

  const addOlympiad = useCallback(async (name: string): Promise<boolean> => {
    const trimmed = name.trim();
    if (!trimmed) return false;

    // Optimistic UI update
    setOlympiads((prev) => {
      if (prev.some((o) => o.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, trimmed];
    });

    try {
      const { error } = await supabase
        .from('olympiads')
        .insert([{ name: trimmed }]);

      if (error && error.code !== '23505') {
        // Revert on real error (23505 = duplicate key, which is fine)
        setOlympiads((prev) => prev.filter((o) => o !== trimmed));
        return false;
      }
      return true;
    } catch {
      setOlympiads((prev) => prev.filter((o) => o !== trimmed));
      return false;
    }
  }, []);

  const removeOlympiad = useCallback(async (name: string) => {
    if (DEFAULT_OLYMPIADS.includes(name)) return;

    // Optimistic UI update
    setOlympiads((prev) => prev.filter((o) => o !== name));

    try {
      await supabase.from('olympiads').delete().eq('name', name);
    } catch {
      // Revert on failure
      setOlympiads((prev) => [...prev, name]);
    }
  }, []);

  return { olympiads, loading, addOlympiad, removeOlympiad };
}
