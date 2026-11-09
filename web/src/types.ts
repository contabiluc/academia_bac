export interface Work {
  author: string;
  title: string;
  type: string;
  genre: 'Poezie' | 'Proză' | 'Dramaturgie';
  theme: string;
  summary: string;
  characters: string;
  composition: string;
  essay: string;
}

export interface Question {
  work: string;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Profile {
  name: string;
  goal: string;
  track: string;
}

export interface TestResult {
  work: string;
  score: number;
  total: number;
  date: string;
}
