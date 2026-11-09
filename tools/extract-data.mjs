// Extrage datele din index.html (legacy) în fișiere JSON + imagini separate.
// Rulare: node tools/extract-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'legacy/index.html'), 'utf8');
const lines = html.split(/\r?\n/);

const NAMES = [
  'WORKS', 'QUESTIONS', 'HARAP_RESOURCES', 'PROSE_SEQUENCE_MAP', 'PROSE_PERSPECTIVE_MAP',
  'PROSE_QUIZ_MAP', 'EXAM_INFOGRAPHICS', 'STAGE_THREE_POETRY_MODULES', 'STAGE_THREE_DRAMA_MODULES',
  'STAGE_THREE_QUIZZES', 'STAGE_ONE_DEEP_MODULES', 'STAGE_ONE_QUIZZES', 'STAGE_TWO_DEEP_MODULES',
  'STAGE_TWO_DRAMA_MODULES', 'STAGE_TWO_QUIZZES',
];

const ctx = vm.createContext({});
for (const name of NAMES) {
  const re = new RegExp(`^const ${name}\\s*=`);
  const start = lines.findIndex((l) => re.test(l));
  if (start < 0) { console.warn('lipsește', name); continue; }
  // Declarațiile pot fi pe mai multe linii: adaugă linii până când se evaluează.
  let code = '', ok = false, lastErr;
  for (let i = start; i < Math.min(start + 40, lines.length) && !ok; i++) {
    code += (i === start ? lines[i].replace(/^const /, 'var ') : '\n' + lines[i]);
    try { vm.runInContext(code, ctx, { timeout: 5000 }); ok = true; } catch (e) { lastErr = e; }
  }
  if (!ok) console.warn('eroare la', name, lastErr?.message);
}

const outDir = path.join(root, 'web/src/data');
const imgDir = path.join(root, 'web/public/infographics');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(imgDir, { recursive: true });

// Mută imaginile base64 în fișiere
let imgCount = 0;
function externalize(value, prefix) {
  if (typeof value === 'string') {
    const m = value.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/s);
    if (m) {
      const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
      const file = `${prefix}-${++imgCount}.${ext}`;
      fs.writeFileSync(path.join(imgDir, file), Buffer.from(m[2], 'base64'));
      return `/infographics/${file}`;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v, i) => externalize(v, prefix));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, externalize(v, prefix)]));
  }
  return value;
}

for (const name of NAMES) {
  if (ctx[name] === undefined) continue;
  const data = externalize(JSON.parse(JSON.stringify(ctx[name])), name.toLowerCase());
  const file = name.toLowerCase().replace(/_/g, '-') + '.json';
  fs.writeFileSync(path.join(outDir, file), JSON.stringify(data, null, 1));
  const size = (fs.statSync(path.join(outDir, file)).size / 1024).toFixed(0);
  console.log(file, size + ' KB', Array.isArray(data) ? data.length + ' elemente' : Object.keys(data).length + ' chei');
}
console.log('imagini extrase:', imgCount);
