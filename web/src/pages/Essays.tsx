import { useSearchParams } from 'react-router-dom';
import { WORKS, countWords, findWork, slug } from '@/data';
import { KEYS, useStored } from '@/lib/storage';

const CHECKS = [
  'Încadrare în context',
  'Tema operei',
  'Două secvențe relevante',
  'Elemente de compoziție',
  'Concluzie',
];

export default function Essays() {
  const [params, setParams] = useSearchParams();
  const title = params.get('opera') ?? WORKS[0].title;
  const work = WORKS.find((w) => w.title === title) ?? findWork(slug(title)) ?? WORKS[0];

  const [text, setText] = useStored<string>(KEYS.essay, '');
  const [count, setCount] = useStored<number>(KEYS.essayCount, 0);
  const [checked, setChecked] = useStored<boolean[]>('abEssayChecks', CHECKS.map(() => false));

  const words = countWords(text);
  const progress = Math.round((checked.filter(Boolean).length / CHECKS.length) * 100);

  return (
    <section>
      <h1>Constructor de eseu</h1>
      <div className="layout">
        <aside className="panel">
          <h3>Verifică structura</h3>
          <select value={work.title} onChange={(e) => setParams({ opera: e.target.value })}>
            {WORKS.map((w) => <option key={w.title}>{w.title}</option>)}
          </select>
          {CHECKS.map((c, i) => (
            <label key={c} className="check">
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => setChecked(CHECKS.map((_, j) => (j === i ? !checked[i] : !!checked[j])))}
              />
              {c}
            </label>
          ))}
          <div className="bar"><i style={{ width: `${progress}%` }} /></div>
          <p className="muted">Plan sugerat: {work.essay}</p>
        </aside>
        <div className="panel">
          <p className={words >= 150 ? 'ok' : 'muted'}><b>{words} cuvinte</b> (minimum 150)</p>
          <textarea
            rows={20}
            placeholder="Redactează eseul aici…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="row">
            <button className="primary" onClick={() => setCount(count + 1)}>
              Marchează eseul ca finalizat
            </button>
            <span className="muted">Eseuri finalizate: {count} · textul se salvează automat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
