import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Sensors from './pages/Sensors';
import MathematicalLab from './pages/MathematicalLab';
import ErrorAnalysis from './pages/ErrorAnalysis';
import History from './pages/History';
import Results from './pages/Results';
import DataDictionary from './pages/DataDictionary';

// Placeholder para las páginas que haremos en las siguientes fases
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-6 border border-panelBorder rounded-lg bg-panel/50">
    <h1 className="text-2xl font-semibold text-accent">{title}</h1>
    <p className="mt-2 text-slate-400">Módulo en construcción...</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="simulador" element={<Simulation />} />
          <Route path="sensores" element={<Sensors />} />
          <Route path="laboratorio" element={<MathematicalLab />} />
          
          {/* Rutas pendientes para las próximas fases */}
          <Route path="errores" element={<ErrorAnalysis />} />

          <Route path="resultados" element={<Results />} />
          <Route path="historial" element={<History />} />
          <Route path="diccionario" element={<DataDictionary />} />
          <Route path="*" element={<Placeholder title="404 - No encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}