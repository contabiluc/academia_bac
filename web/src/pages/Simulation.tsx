import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { countWords } from '@/data';
import { KEYS, useStored } from '@/lib/storage';

const TOTAL = 3 * 60 * 60; // 3 ore, ca la examen
const fmt = (s: number) =>
  [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0')).join(':');

export default function Simulation() {
  const [text, setText] = useStored<string>(KEYS.sim, '');
  const [left, setLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(timer.current);
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [running]);

  const words = countWords(text);

  return (
    <section>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Simulare examen</h1>
        <div className={`timer ${left === 0 ? 'bad' : ''}`}>{fmt(left)}</div>
      </div>
      <div className="panel">
        <h3>Subiectul al III-lea</h3>
        <p>Redactează un text de minimum 150 de cuvinte în care să argumentezi dacă lectura contribuie la dezvoltarea personală.</p>
        <p className="muted">Modele de rezolvare: <Link to="/infografice">infografice Bac</Link>.</p>
        <p className={words >= 150 ? 'ok' : 'muted'}><b>{words} cuvinte</b></p>
        <textarea rows={13} placeholder="Scrie aici…" value={text} onChange={(e) => { setText(e.target.value); setSaved(false); }} />
        <div className="row">
          <button className="primary" onClick={() => setRunning(!running)} disabled={left === 0}>
            {running ? 'Pauză' : left === TOTAL ? 'Pornește cronometrul' : 'Continuă'}
          </button>
          <button className="secondary" onClick={() => { setRunning(false); setLeft(TOTAL); }}>Resetează timpul</button>
          <button className="secondary" onClick={() => setSaved(true)}>Salvează</button>
          {saved && <span className="ok">Salvat.</span>}
        </div>
      </div>
    </section>
  );
}
