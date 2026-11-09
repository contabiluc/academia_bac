import { Link } from 'react-router-dom';
import { WORKS } from '@/data';
import { KEYS, useStored } from '@/lib/storage';
import type { Profile } from '@/types';

export default function Home() {
  const [profile, setProfile] = useStored<Profile | null>(KEYS.profile, null);
  const [done] = useStored<string[]>(KEYS.done, []);

  if (!profile) {
    return (
      <section className="panel">
        <h1>Bun venit la Academia Bac</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            setProfile({
              name: String(f.get('name')).trim() || 'Elev',
              goal: String(f.get('goal')),
              track: String(f.get('track')),
            });
          }}
        >
          <label>Numele tău <input name="name" required /></label>
          <label>Nota țintă
            <select name="goal" defaultValue="9">{['7', '8', '9', '10'].map((g) => <option key={g}>{g}</option>)}</select>
          </label>
          <label>Profil
            <select name="track" defaultValue="Real"><option>Real</option><option>Uman</option></select>
          </label>
          <button className="primary">Începe pregătirea</button>
        </form>
      </section>
    );
  }

  const next = WORKS.find((w) => !done.includes(w.title));
  return (
    <section>
      <h1>Planul de pregătire — {profile.name}</h1>
      <p className="muted">Obiectiv: nota {profile.goal} · {done.length}/{WORKS.length} opere parcurse</p>
      <div className="panel">
        <h3>Următoarea lecție</h3>
        {next ? (
          <p>
            <b>{next.title}</b> — {next.author}
          </p>
        ) : (
          <p>Ai parcurs toate operele. Felicitări!</p>
        )}
        <div className="row">
          <Link className="primary" to="/lectii">Vezi lecțiile</Link>
          <Link className="secondary" to="/teste">Rezolvă un test</Link>
        </div>
      </div>
    </section>
  );
}
