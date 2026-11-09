# Academia Bac

Platformă de învățare și evaluare pentru limba și literatura română (Bacalaureat).

## Structură
- `web/` — aplicația nouă (Vite + React + TypeScript + Firebase)
  - `src/data/` — conținutul (opere, întrebări, module) în JSON, extras din versiunea veche
  - `src/pages/` — Acasă, Lecții, Teste, Progres, Cont
  - `public/infographics/` — imagini extrase din HTML
- `legacy/index.html` — prototipul original (un singur fișier), păstrat ca referință
- `tools/extract-data.mjs` — scriptul care a extras datele din `legacy/index.html`

## Rulare
```
cd web
npm install
cp .env.example .env.local   # completează cheile Firebase (opțional)
npm run dev
```

Fără Firebase, progresul se salvează local în browser. Cu Firebase, se sincronizează în `users/{uid}/data/progress`.

## De făcut
- Portarea modulelor avansate din `legacy/` (eseuri, simulare, module pe etape, infografice)
- Roluri elev/profesor, evaluare eseuri cu AI, recomandări adaptive
