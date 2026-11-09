import works from '@/data/works.json';
import questions from '@/data/questions.json';
import harap from '@/data/harap-resources.json';
import proseSeq from '@/data/prose-sequence-map.json';
import prosePersp from '@/data/prose-perspective-map.json';
import proseQuiz from '@/data/prose-quiz-map.json';
import examInfo from '@/data/exam-infographics.json';
import s1Deep from '@/data/stage-one-deep-modules.json';
import s2Deep from '@/data/stage-two-deep-modules.json';
import s2Drama from '@/data/stage-two-drama-modules.json';
import s3Poetry from '@/data/stage-three-poetry-modules.json';
import s3Drama from '@/data/stage-three-drama-modules.json';
import s1Quiz from '@/data/stage-one-quizzes.json';
import s2Quiz from '@/data/stage-two-quizzes.json';
import s3Quiz from '@/data/stage-three-quizzes.json';
import type { Infographic, LessonModule, Question, Work } from '@/types';

export const WORKS = works as Work[];

type QuizTuple = [string, string[], number, string];
type ModuleTuple = [string, string, string];

const fromTuples = (work: string, rows: QuizTuple[]): Question[] =>
  rows.map(([q, options, answer, explanation]) => ({ work, q, options, answer, explanation }));

const quizMaps = [proseQuiz, s1Quiz, s2Quiz, s3Quiz] as unknown as Record<string, QuizTuple[]>[];

/** Toate întrebările: setul de bază + cele din etapele ulterioare. */
export const QUESTIONS: Question[] = [
  ...(questions as Question[]),
  ...quizMaps.flatMap((m) => Object.entries(m).flatMap(([work, rows]) => fromTuples(work, rows))),
];

const moduleMaps = [s1Deep, s2Deep, s2Drama, s3Poetry, s3Drama] as unknown as Record<string, ModuleTuple[]>[];

/** Module de studiu aprofundat, pe operă (conținutul este HTML propriu, de încredere). */
export const MODULES: Record<string, LessonModule[]> = {};
for (const m of moduleMaps) {
  for (const [work, rows] of Object.entries(m)) {
    MODULES[work] = rows.map(([icon, title, html]) => ({ icon, title, html }));
  }
}

export const SEQUENCES = proseSeq as unknown as Record<string, [string, string][]>;
export const PERSPECTIVES = prosePersp as Record<string, string>;

export const HARAP = harap as {
  themeEssay: string;
  characterEssay: string;
  infographicMain: string;
  infographicCharacter: string;
};

export const INFOGRAPHICS = Object.fromEntries(
  Object.entries(examInfo as unknown as Record<string, [string, string, string][]>).map(([k, rows]) => [
    k,
    rows.map(([title, subtitle, src]): Infographic => ({ title, subtitle, src })),
  ]),
) as Record<'s1' | 's2', Infographic[]>;

export const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const findWork = (s: string) => WORKS.find((w) => slug(w.title) === s);
export const questionsFor = (title: string) => QUESTIONS.filter((q) => q.work === title);

export const countWords = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);
