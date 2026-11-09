import { useState } from 'react';
import { useAuth } from '@/auth/AuthContext';

export default function Account() {
  const { user, configured, login, signup, reset, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [email, setEmail] = useState('');

  if (!configured) {
    return (
      <section className="panel">
        <h1>Cont</h1>
        <p>Firebase nu este configurat. Copiază <code>web/.env.example</code> în <code>web/.env.local</code> și completează valorile din consola Firebase.</p>
        <p className="muted">Fără cont, progresul se salvează doar în acest browser.</p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="panel">
        <h1>Contul meu</h1>
        <p>{user.displayName} · {user.email}</p>
        <p className="muted">Sincronizare activă.</p>
        <button className="secondary" onClick={logout}>Ieși din cont</button>
      </section>
    );
  }

  const run = async (fn: () => Promise<void>, okText?: string) => {
    setMsg(null);
    try {
      await fn();
      if (okText) setMsg({ text: okText, ok: true });
    } catch (e) {
      setMsg({ text: (e as { code?: string }).code ?? String(e), ok: false });
    }
  };

  return (
    <section className="panel">
      <h1>{mode === 'login' ? 'Intră în cont' : 'Creează cont'}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const pass = String(f.get('password'));
          run(() => (mode === 'login' ? login(email, pass) : signup(String(f.get('name')), email, pass)));
        }}
      >
        {mode === 'signup' && <label>Nume <input name="name" required /></label>}
        <label>Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Parolă <input name="password" type="password" minLength={6} required /></label>
        <button className="primary">{mode === 'login' ? 'Intră' : 'Creează cont'}</button>
      </form>
      <div className="row">
        <button className="link" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Intră'}
        </button>
        {mode === 'login' && (
          <button
            className="link"
            onClick={() => (email ? run(() => reset(email), 'Email de resetare trimis.') : setMsg({ text: 'Introdu emailul.', ok: false }))}
          >
            Am uitat parola
          </button>
        )}
      </div>
      {msg && <p className={msg.ok ? 'ok' : 'bad'}>{msg.text}</p>}
    </section>
  );
}
