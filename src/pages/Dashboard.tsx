import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-accent mb-4">SIMTELE-RISK · Módulo 4</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Laboratorio virtual interactivo para la reconstrucción numérica de señales 
          de viento y tensión en un sistema de transporte por cable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-panel border border-panelBorder p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">🌬️</div>
          <h3 className="font-bold text-lg mb-2">Anemómetro</h3>
          <p className="text-sm text-slate-400 mb-4">Simulación de ráfagas de viento mediante funciones trigonométricas.</p>
        </div>
        <div className="bg-panel border border-panelBorder p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-bold text-lg mb-2">Célula de Carga</h3>
          <p className="text-sm text-slate-400 mb-4">Respuesta de tensión con amortiguamiento exponencial.</p>
        </div>
        <div className="bg-panel border border-panelBorder p-6 rounded-lg text-center">
          <div className="text-3xl mb-2">📡</div>
          <h3 className="font-bold text-lg mb-2">Pérdida de Señal</h3>
          <p className="text-sm text-slate-400 mb-4">Interrupción de telemetría y auditoría de datos faltantes.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link 
          to="/simulador" 
          className="inline-block bg-accent hover:bg-cyan-400 text-[#0f172a] font-bold text-lg px-8 py-4 rounded-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          IR AL SIMULADOR →
        </Link>
      </div>
    </div>
  );
}