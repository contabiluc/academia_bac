import { useState } from 'react';
import { INFOGRAPHICS } from '@/data';

const TABS = [
  ['s1', 'Subiectul I'],
  ['s2', 'Subiectul al II-lea'],
] as const;

export default function Infographics() {
  const [tab, setTab] = useState<'s1' | 's2'>('s1');
  return (
    <section>
      <h1>Infografice Bac</h1>
      <div className="tabs">
        {TABS.map(([k, label]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      <div className="grid">
        {INFOGRAPHICS[tab].map((i) => (
          <article className="card" key={i.src}>
            <h3>{i.title}</h3>
            <p className="muted">{i.subtitle}</p>
            <a href={i.src} target="_blank" rel="noopener noreferrer">
              <img className="infographic" src={i.src} alt={i.title} loading="lazy" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
