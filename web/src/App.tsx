import { NavLink, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Lessons from '@/pages/Lessons';
import LessonDetail from '@/pages/LessonDetail';
import Tests from '@/pages/Tests';
import Progress from '@/pages/Progress';
import Account from '@/pages/Account';
import Essays from '@/pages/Essays';
import Simulation from '@/pages/Simulation';
import Infographics from '@/pages/Infographics';

const NAV: [string, string][] = [
  ['/', 'Acasă'],
  ['/lectii', 'Lecții'],
  ['/teste', 'Teste'],
  ['/simulare', 'Simulare'],
  ['/eseuri', 'Eseuri'],
  ['/infografice', 'Infografice'],
  ['/progres', 'Progres'],
  ['/cont', 'Cont'],
];

export default function App() {
  return (
    <>
      <header className="top">
        <span className="brand">Academia <span>Bac</span></span>
        <nav>
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lectii" element={<Lessons />} />
          <Route path="/lectii/:id" element={<LessonDetail />} />
          <Route path="/teste" element={<Tests />} />
          <Route path="/simulare" element={<Simulation />} />
          <Route path="/eseuri" element={<Essays />} />
          <Route path="/infografice" element={<Infographics />} />
          <Route path="/progres" element={<Progress />} />
          <Route path="/cont" element={<Account />} />
          <Route path="*" element={<p>Pagina nu există.</p>} />
        </Routes>
      </main>
    </>
  );
}
