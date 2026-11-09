import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QUESTIONS, WORKS, questionsFor } from '@/data';
import { KEYS, useStored } from '@/lib/storage';
import type { TestResult } from '@/types';

export default function Tests() {
  const [params, setParams] = useSearchParams();
  const work = params.get('opera') ?? '';
  const [results, setResults] = useStored<TestResult[]>(KEYS.tests, []);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(
    () => (work ? questionsFor(work) : QUESTIONS.slice(0, 10)),
    [work],
  );
  const withQuestions = WORKS.filter((w) => questionsFor(w.title).length > 0);

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  const submit = () => {
    setSubmitted(true);
    setResults([
      ...results,
      { work: work || 'Mixt', score, total: questions.length, date: new Date().toISOString() },
    ]);
  };

  return (
    <section>
      <h1>Teste</h1>
      <select
        value={work}
        onChange={(e) => {
          reset();
          setParams(e.target.value ? { opera: e.target.value } : {});
        }}
      >
        <option value="">Test mixt (10 întrebări)</option>
        {withQuestions.map((w) => (
          <option key={w.title}>{w.title}</option>
        ))}
      </select>

      {questions.map((q, i) => (
        <div className="panel" key={q.q}>
          <h3>{i + 1}. {q.q}</h3>
          {q.options.map((o, j) => {
            const state = submitted ? (j === q.answer ? 'right' : answers[i] === j ? 'wrong' : '') : '';
            return (
              <label key={o} className={`option ${state}`}>
                <input
                  type="radio"
                  name={`q${i}`}
                  disabled={submitted}
                  checked={answers[i] === j}
                  onChange={() => setAnswers({ ...answers, [i]: j })}
                />
                {o}
              </label>
            );
          })}
          {submitted && <p className="muted">{q.explanation}</p>}
        </div>
      ))}

      {!submitted ? (
        <button className="primary" onClick={submit} disabled={Object.keys(answers).length < questions.length}>
          Trimite răspunsurile
        </button>
      ) : (
        <div className="row">
          <strong>Scor: {score}/{questions.length}</strong>
          <button className="secondary" onClick={reset}>Reia testul</button>
        </div>
      )}
    </section>
  );
}
