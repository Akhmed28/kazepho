export type Olympiad = 'KazEPhO' | 'Respa' | 'IZhO';

export type GradeLevel = 8 | 9 | 10 | 11 | null;

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  olympiad: Olympiad;
  year: number;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  statement: string;
  experimentalSetup: string;
  solution: string;
  tags?: string[];
}

export interface User {
  username: string;
  isAuthenticated: boolean;
}

export type FilterState = {
  olympiad: Olympiad | 'All';
  year: number | 'All';
  gradeLevel: GradeLevel | 'All';
  difficulty: Difficulty | 'All';
  search: string;
};
