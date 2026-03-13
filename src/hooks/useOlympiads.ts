import { useState, useCallback } from 'react';

const DEFAULT_OLYMPIADS = ['KazEPhO', 'Respa', 'IZhO'];
const STORAGE_KEY = 'kazepho_olympiads';

function loadOlympiads(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_OLYMPIADS;
}

function saveOlympiads(list: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function useOlympiads() {
  const [olympiads, setOlympiads] = useState<string[]>(loadOlympiads);

  const addOlympiad = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setOlympiads(prev => {
      if (prev.some(o => o.toLowerCase() === trimmed.toLowerCase())) return prev;
      const next = [...prev, trimmed];
      saveOlympiads(next);
      return next;
    });
    return true;
  }, []);

  const removeOlympiad = useCallback((name: string) => {
    setOlympiads(prev => {
      const next = prev.filter(o => o !== name);
      saveOlympiads(next);
      return next;
    });
  }, []);

  return { olympiads, addOlympiad, removeOlympiad };
}
