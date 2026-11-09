import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WORKS, slug } from '@/data';
import { KEYS, useStored } from '@/lib/storage';

export default function Lessons() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('');
  const [done] = useStored<string[]>(KEYS.done, []);

  const list = WORKS.filter(
    (w) =>
      (!genre || w.genre === genre) &&
      `${w.title} ${w.author} ${w.type}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <section>
      <h1>Lecții — opere complete</h1>
      <div className="toolbar">
        <input placeholder="Caută operă sau autor…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Toate genurile</option>
          <option>Poezie</option>
          <option>Proză</option>
          <option>Dramaturgie</option>
        </select>
      </div>
      <div className="grid">
        {list.map((w) => (
          <Link key={w.title} to={`/lectii/${slug(w.title)}`} className="card">
            <span className="chip">{w.genre}</span>
            <h3>{w.title}</h3>
            <p className="muted">{w.author} · {w.type}</p>
            <p>{w.theme}</p>
            {done.includes(w.title) && <b className="ok">✓ parcursă</b>}
          </Link>
        ))}
        {list.length === 0 && <p className="muted">Nicio operă găsită.</p>}
      </div>
    </section>
  );
}
