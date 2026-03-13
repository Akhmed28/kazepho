/* eslint-disable @typescript-eslint/no-explicit-any */
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
  return (data ?? []).map(dbToApp);
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

function dbToApp(row: any): Problem {
  const translations = row.translations ?? {};

  // Populate EN from top-level columns if not in translations yet (backward compat)
  if (!translations.en) {
    translations.en = {
      title: row.title ?? '',
      statement: row.statement ?? '',
      experimentalSetup: row.experimental_setup ?? '',
      solution: row.solution ?? '',
    };
  }

  const enContent = translations.en;

  return {
    id: String(row.id),
    title: enContent.title || row.title,
    olympiad: row.olympiad,
    year: row.year,
    gradeLevel: row.grade_level,
    difficulty: row.difficulty,
    statement: enContent.statement || row.statement,
    experimentalSetup: enContent.experimentalSetup || row.experimental_setup,
    solution: enContent.solution || row.solution,
    tags: row.tags ?? [],
    pdfData: row.pdf_data ?? '',
    pdfName: row.pdf_name ?? '',
    translations,
  };
}

function appToDB(p: Omit<Problem, 'id'>) {
  const translations = p.translations ?? {};

  // Always keep EN in sync with top-level fields
  translations.en = {
    title: p.title,
    statement: p.statement,
    experimentalSetup: p.experimentalSetup,
    solution: p.solution,
  };

  return {
    title: p.title,
    olympiad: p.olympiad,
    year: p.year,
    grade_level: p.gradeLevel,
    difficulty: p.difficulty,
    statement: p.statement,
    experimental_setup: p.experimentalSetup,
    solution: p.solution,
    tags: p.tags ?? [],
    pdf_data: p.pdfData ?? '',
    pdf_name: p.pdfName ?? '',
    translations,
  };
}
