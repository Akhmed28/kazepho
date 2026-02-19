import { createClient } from '@supabase/supabase-js';
import { Problem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export async function fetchProblems(): Promise<Problem[]> {
  const { data, error } = await supabase.from('problems').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(dbToApp);
}

export async function fetchProblemById(id: string): Promise<Problem | null> {
  const { data, error } = await supabase.from('problems').select('*').eq('id', id).single();
  if (error) return null;
  return dbToApp(data);
}

export async function createProblem(p: Omit<Problem, 'id'>): Promise<Problem> {
  const { data, error } = await supabase.from('problems').insert([appToDB(p)]).select().single();
  if (error) throw error;
  return dbToApp(data);
}

export async function updateProblem(id: string, p: Omit<Problem, 'id'>): Promise<Problem> {
  const { data, error } = await supabase.from('problems').update(appToDB(p)).eq('id', id).select().single();
  if (error) throw error;
  return dbToApp(data);
}

export async function deleteProblem(id: string): Promise<void> {
  const { error } = await supabase.from('problems').delete().eq('id', id);
  if (error) throw error;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToApp(row: any): Problem {
  return {
    id: String(row.id),
    title: row.title,
    olympiad: row.olympiad,
    year: row.year,
    gradeLevel: row.grade_level,
    difficulty: row.difficulty,
    statement: row.statement,
    experimentalSetup: row.experimental_setup,
    solution: row.solution,
    tags: row.tags || [],
  };
}

function appToDB(p: Omit<Problem, 'id'>) {
  return {
    title: p.title,
    olympiad: p.olympiad,
    year: p.year,
    grade_level: p.gradeLevel,
    difficulty: p.difficulty,
    statement: p.statement,
    experimental_setup: p.experimentalSetup,
    solution: p.solution,
    tags: p.tags || [],
  };
}