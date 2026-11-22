import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const pages = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/modulo1', label: 'M1: Frenado' },
  { path: '/modulo2', label: 'M2: Deterioro' },
  { path: '/modulo3', label: 'M3: Viento' },
  { path: '/simulador', label: 'M4: Sensores' },
  { path: '/sensores', label: 'Modelos Físicos' },
  { path: '/laboratorio', label: 'Laboratorio Numérico' },
  { path: '/errores', label: 'Análisis de Errores' },
  { path: '/resultados', label: 'Resumen Global' },
  { path: '/historial', label: 'Historial BD' },
  { path: '/diccionario', label: 'Glosario' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 flex flex-col font-sans">
      <header className="border-b border-panelBorder bg-[#0b1120] sticky top-0 z-50 shadow-md">
        <div className="px-6 py-3 flex gap-6 flex-wrap items-center">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-accent/10 p-1.5 rounded-lg border border-accent/20 group-hover:bg-accent/20 transition">
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <span className="font-mono font-bold text-lg text-slate-100 tracking-wider">
              SIMTELE-RISK <span className="text-slate-500 font-sans text-sm font-normal">· Integrador</span>
            </span>
          </Link>
          
          <nav className="flex gap-x-5 gap-y-2 flex-wrap text-sm font-medium ml-auto">
            {pages.map((p) => (
              <Link 
                key={p.path} 
                to={p.path}
                className={`transition-colors hover:text-accent whitespace-nowrap ${
                  location.pathname === p.path 
                    ? 'text-accent border-b-2 border-accent pb-1' 
                    : 'text-slate-400'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="p-4 text-xs text-center text-slate-500 border-t border-panelBorder bg-[#0b1120]">
        SIMTELE-RISK © 2024 - Datos sintéticos con fines exclusivamente educativos. No es un sistema de control certificado.
      </footer>
    </div>
  );
}