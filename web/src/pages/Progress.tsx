import { Link } from 'react-router-dom';
import { WORKS } from '@/data';
import { KEYS, useStored } from '@/lib/storage';
import type { Profile, TestResult } from '@/types';

export default function Progress() {
  const [done] = useStored<string[]>(KEYS.done, []);
  const [tests] = useStored<TestResult[]>(KEYS.tests, []);
  const [essays] = useStored<number>(KEYS.essayCount, 0);
  const [profile] = useStored<Profile | null>(KEYS.profile, null);

  const avg = tests.length
    ? Math.round((tests.reduce((s, t) => s + t.score / t.total, 0) / tests.length) * 100)
    : 0;

  return (
    <section>
      <h1>Progres{profile ? ` — ${profile.name}` : ''}</h1>
      <div className="stats">
        <div className="stat"><strong>{done.length}/{WORKS.length}</strong>opere parcurse</div>
        <div className="stat"><strong>{tests.length}</strong>teste rezolvate</div>
        <div className="stat"><strong>{avg}%</strong>medie teste</div>
        <div className="stat"><strong>{essays}</strong>eseuri finalizate</div>
        <div className="stat"><strong>{profile?.goal ?? '—'}</strong>notă țintă</div>
      </div>
      <h2>Ultimele teste</h2>
      {tests.length === 0 && <p className="muted">Încă nu ai rezolvat teste. <Link to="/teste">Începe unul</Link>.</p>}
      <ul className="list">
        {[...tests].reverse().slice(0, 10).map((t) => (
          <li key={t.date}>
            {t.work} — <b>{t.score}/{t.total}</b>
            <span className="muted"> · {new Date(t.date).toLocaleDateString('ro-RO')}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
