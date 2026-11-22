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

// 1. Importamos el nuevo módulo
import Module1 from './pages/Module1';

import Module2 from './pages/Module2';

import Module3 from './pages/Module3';

import Module4 from './pages/Module4';

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
          
          {/* Rutas de los módulos */}
          <Route path="modulo1" element={<Module1 />} /> {/* 2. Nueva ruta agregada */}
          <Route path="modulo2" element={<Module2 />} />
          <Route path="modulo3" element={<Module3 />} />
          <Route path="simulador" element={<Module4 />} />
          
          <Route path="simulador" element={<Simulation />} />
          
          <Route path="sensores" element={<Sensors />} />
          <Route path="laboratorio" element={<MathematicalLab />} />
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