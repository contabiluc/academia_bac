import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HARAP, MODULES, PERSPECTIVES, SEQUENCES, findWork, questionsFor } from '@/data';
import { KEYS, useStored } from '@/lib/storage';

type Tab = 'overview' | 'modules' | 'analysis' | 'resources';

function EssayReader({ title, text }: { title: string; text: string }) {
  const [size, setSize] = useState<'compact' | 'normal' | 'large'>('normal');
  const paragraphs = text
    .split(/\n{1,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return (
    <div className={`reader ${size}`}>
      <div className="row">
        <h3 style={{ margin: 0 }}>{title}</h3>
        {(['compact', 'normal', 'large'] as const).map((s) => (
          <button key={s} className={size === s ? 'primary' : 'secondary'} onClick={() => setSize(s)}>
            {s === 'compact' ? 'A-' : s === 'normal' ? 'A' : 'A+'}
          </button>
        ))}
      </div>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export default function LessonDetail() {
  const { id = '' } = useParams();
  const work = findWork(id);
  const [done, setDone] = useStored<string[]>(KEYS.done, []);
  const [tab, setTab] = useState<Tab>('overview');
  const [open, setOpen] = useState(0);

  if (!work) return <p>Opera nu a fost găsită. <Link to="/lectii">Înapoi la lecții</Link></p>;

  const modules = MODULES[work.title] ?? [];
  const seqs = SEQUENCES[work.title];
  const persp = PERSPECTIVES[work.title];
  const isHarap = work.title === 'Povestea lui Harap-Alb';
  const nQ = questionsFor(work.title).length;
  const isDone = done.includes(work.title);
  const toggle = () =>
    setDone(isDone ? done.filter((t) => t !== work.title) : [...done, work.title]);

  const tabs: [Tab, string, boolean][] = [
    ['overview', 'Prezentare', true],
    ['modules', `Module (${modules.length})`, modules.length > 0],
    ['analysis', 'Analiză', !!(seqs || persp)],
    ['resources', 'Resurse', isHarap],
  ];

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

      <div className="tabs">
        {tabs.filter((t) => t[2]).map(([k, label]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'overview' &&
        rows.map(([k, v]) => (
          <div className="panel" key={k}>
            <h3>{k}</h3>
            <p>{v}</p>
          </div>
        ))}

      {tab === 'modules' &&
        modules.map((m, i) => (
          <div className="panel" key={m.title}>
            <button className="accordion" onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{m.icon} {m.title}</span>
              <span>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="prose" dangerouslySetInnerHTML={{ __html: m.html }} />}
          </div>
        ))}

      {tab === 'analysis' && (
        <>
          {persp && (
            <div className="panel">
              <h3>Perspectiva narativă</h3>
              <p>{persp}</p>
            </div>
          )}
          {seqs && (
            <div className="panel">
              <h3>Secvențe relevante</h3>
              {seqs.map(([t, d]) => (
                <p key={t}><b>{t}.</b> {d}</p>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'resources' && isHarap && (
        <>
          <div className="panel">
            <h3>Infografic: temă și viziune</h3>
            <img className="infographic" src={HARAP.infographicMain} alt="Infografic Harap-Alb" loading="lazy" />
          </div>
          <div className="panel">
            <h3>Infografic: caracterizarea personajului</h3>
            <img className="infographic" src={HARAP.infographicCharacter} alt="Caracterizare Harap-Alb" loading="lazy" />
          </div>
          <div className="panel"><EssayReader title="Eseu: temă și viziune" text={HARAP.themeEssay} /></div>
          <div className="panel"><EssayReader title="Eseu: caracterizarea personajului" text={HARAP.characterEssay} /></div>
          <p className="muted">Materialele de eseu sunt realizate de Mircea Cosmina.</p>
        </>
      )}

      <div className="row">
        <button className="primary" onClick={toggle}>
          {isDone ? 'Marchează ca neparcursă' : 'Marchează ca parcursă'}
        </button>
        {nQ > 0 && (
          <Link className="secondary" to={`/teste?opera=${encodeURIComponent(work.title)}`}>
            Rezolvă testul ({nQ} întrebări)
          </Link>
        )}
        <Link className="secondary" to={`/eseuri?opera=${encodeURIComponent(work.title)}`}>Scrie un eseu</Link>
      </div>
    </article>
  );
}
