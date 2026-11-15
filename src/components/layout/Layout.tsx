import { Link, Outlet, useLocation } from 'react-router-dom';

const pages = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/simulador', label: 'Simulador' },
  { path: '/sensores', label: 'Sensores' },
  { path: '/laboratorio', label: 'Laboratorio Matemático' },
  { path: '/errores', label: 'Análisis de Errores' },
  { path: '/resultados', label: 'Resultados' },
  { path: '/historial', label: 'Historial' },
  { path: '/diccionario', label: 'Diccionario de Datos' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-panel text-slate-200 flex flex-col">
      <header className="border-b border-panelBorder bg-[#0b1120] sticky top-0 z-50">
        <div className="px-6 py-3 flex gap-6 flex-wrap items-center">
          <span className="font-mono font-bold text-lg text-accent tracking-wider">
            SIMTELE-RISK <span className="text-slate-500">· M4</span>
          </span>
          <nav className="flex gap-4 flex-wrap text-sm font-medium">
            {pages.map((p) => (
              <Link 
                key={p.path} 
                to={p.path}
                className={`transition-colors hover:text-accent ${
                  location.pathname === p.path ? 'text-accent border-b-2 border-accent pb-1' : 'text-slate-400'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="p-4 text-xs text-center text-slate-500 border-t border-panelBorder bg-[#0b1120]">
        Datos sintéticos con fines exclusivamente educativos. No es un sistema de control ni de seguridad certificado.
      </footer>
    </div>
  );
}