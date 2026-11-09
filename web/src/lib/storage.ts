import { useCallback, useEffect, useState } from 'react';

const EVENT = 'academia-local-change';

/** Chei compatibile cu aplicația veche (legacy/index.html). */
export const KEYS = {
  profile: 'abProfile',
  done: 'abDone',
  tests: 'abTests',
  essay: 'abEssay',
  essayCount: 'abEssayCount',
  sim: 'abSim',
} as const;

export function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Prototipul vechi salva textele ca șiruri simple, fără JSON.
    return (typeof fallback === 'string' ? raw : fallback) as T;
  }
}

export function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }));
}

/** Hook reactiv peste localStorage (sincronizat între componente). */
export function useStored<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));

  useEffect(() => {
    const refresh = () => setValue(read(key, fallback));
    window.addEventListener(EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((v: T) => write(key, v), [key]);
  return [value, update];
}
