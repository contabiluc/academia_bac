import works from '@/data/works.json';
import questions from '@/data/questions.json';
import type { Question, Work } from '@/types';

export const WORKS = works as Work[];
export const QUESTIONS = questions as Question[];

export const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const findWork = (s: string) => WORKS.find((w) => slug(w.title) === s);
export const questionsFor = (title: string) => QUESTIONS.filter((q) => q.work === title);
