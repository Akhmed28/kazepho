import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteStats {
  stat1_value: string;
  stat1_label: string;
  stat2_value: string;
  stat2_label: string;
  stat3_value: string;
  stat3_label: string;
}

const DEFAULTS: SiteStats = {
  stat1_value: '',
  stat1_label: '',
  stat2_value: '',
  stat2_label: '',
  stat3_value: '',
  stat3_label: '',
};

const STORAGE_KEY = 'kazepho_site_stats';

function loadLocal(): SiteStats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(stats: SiteStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function useSiteStats() {
  const [stats, setStats] = useState<SiteStats>(loadLocal() ?? DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        if (!supabase) throw new Error('no supabase');
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', Object.keys(DEFAULTS));
        if (error) throw error;
        if (data && data.length > 0) {
          const merged = { ...DEFAULTS };
          for (const row of data) {
            if (row.key in merged) {
              (merged as Record<string, string>)[row.key] = row.value;
            }
          }
          setStats(merged);
          saveLocal(merged);
        }
      } catch {
        // Use local cache or defaults
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const updateStats = useCallback(async (newStats: SiteStats) => {
    setStats(newStats);
    saveLocal(newStats);

    try {
      if (!supabase) return;
      for (const [key, value] of Object.entries(newStats)) {
        await supabase
          .from('site_settings')
          .upsert({ key, value }, { onConflict: 'key' });
      }
    } catch {
      // Silently fail — local state is already updated
    }
  }, []);

  return { stats, loading, updateStats };
}
