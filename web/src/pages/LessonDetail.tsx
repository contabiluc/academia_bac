import { Link, useParams } from 'react-router-dom';
import { findWork, questionsFor } from '@/data';
import { KEYS, useStored } from '@/lib/storage';

export default function LessonDetail() {
  const { id = '' } = useParams();
  const work = findWork(id);
  const [done, setDone] = useStored<string[]>(KEYS.done, []);

  if (!work) return <p>Opera nu a fost găsită. <Link to="/lectii">Înapoi la lecții</Link></p>;

  const isDone = done.includes(work.title);
  const toggle = () =>
    setDone(isDone ? done.filter((t) => t !== work.title) : [...done, work.title]);

  const rows: [string, string][] = [
    ['Tema', work.theme],
    ['Rezumat', work.summary],
    ['Personaje', work.characters],
    ['Compoziție', work.composition],
    ['Plan de eseu', work.essay],
  ];

  return (
    <article>
      <Link to="/lectii">← Lecții</Link>
      <h1>{work.title}</h1>
      <p className="muted">{work.author} · {work.type}</p>
      {rows.map(([k, v]) => (
        <div className="panel" key={k}>
          <h3>{k}</h3>
          <p>{v}</p>
        </div>
      ))}
      <div className="row">
        <button className="primary" onClick={toggle}>
          {isDone ? 'Marchează ca neparcursă' : 'Marchează ca parcursă'}
        </button>
        {questionsFor(work.title).length > 0 && (
          <Link className="secondary" to={`/teste?opera=${encodeURIComponent(work.title)}`}>
            Rezolvă testul ({questionsFor(work.title).length} întrebări)
          </Link>
        )}
      </div>
    </article>
  );
}
