import { useState, useEffect, useRef } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import PlotlyChart from '@/components/charts/PlotlyChart';
import SensorCard from '@/components/sensors/SensorCard';
import CableCarScene from '@/components/simulation/CableCarScene';
import { saveSimulationToDB } from '@/services/simulationService';
import type { Data, Layout } from 'plotly.js';

export default function Module4() {
  // Extraemos las funciones de control del store
  const { 
    snapshot, config, updateConfig, 
    status, start, pause, resume, reset, tick, tiempoActual 
  } = useSimulationStore();
  
  const [guardando, setGuardando] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // MOTOR DE ANIMACIÓN (Para que el reloj y la cabina se muevan)
  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== 0) {
        const dt = (time - lastTimeRef.current) / 1000;
        tick(dt); // Avanza el tiempo
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  const loadScenario = (type: 'NORMAL' | 'ESTRES' | 'MAL_CONDICIONADO') => {
    let newConfig = { ...config };
    if (type === 'NORMAL') newConfig.escenario = { tipo: 'NORMAL', descripcion: 'Pérdida individual', loss: { instantesIndividuales: [4, 8] }, noiseAmplitude: 0.1 };
    if (type === 'ESTRES') newConfig.escenario = { tipo: 'ESTRES', descripcion: 'Apagón total', loss: { intervaloContinuo: [6, 10] }, noiseAmplitude: 0.5 };
    if (type === 'MAL_CONDICIONADO') newConfig.escenario = { tipo: 'MAL_CONDICIONADO', descripcion: 'Ruido extremo', loss: { instantesIndividuales: [2, 4, 6, 8, 10, 12] }, noiseAmplitude: 2.0 };
    updateConfig(newConfig);
    // Al cambiar de escenario, reiniciamos el tiempo
    reset();
  };

  const handleSave = async () => {
    setGuardando(true);
    await saveSimulationToDB('Módulo 4: Reconstrucción', config.escenario.tipo, config, { status: 'ok' });
    setGuardando(false);
  };

  let chartData: Data[] = [];
  let layout: Partial<Layout> = {};

  if (snapshot) {
    chartData = [
      {
        x: snapshot.medidas.anemometro.map(m => m.t),
        y: snapshot.medidas.anemometro.map(m => m.valorReferencia),
        type: 'scatter', mode: 'lines', name: 'Viento (Ref)',
        line: { color: '#22c55e', width: 2 }
      },
      {
        x: snapshot.medidas.celula_carga.map(m => m.t),
        y: snapshot.medidas.celula_carga.map(m => m.valorReferencia),
        type: 'scatter', mode: 'lines', name: 'Tensión (Ref)',
        line: { color: '#f59e0b', width: 2 }
      }
    ];
    layout = { 
      title: 'Telemetría Dual (Verdad Oculta)', 
      xaxis: { title: 'Tiempo (s)' }, 
      yaxis: { title: 'Magnitud' } 
    };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header y Escenarios */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Módulo 4: Reconstrucción de Telemetría</h1>
          <p className="text-slate-400">Análisis de interpolación y pérdida de señal.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadScenario('NORMAL')} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition">Normal</button>
          <button onClick={() => loadScenario('ESTRES')} className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-sm text-white transition">Estrés</button>
          <button onClick={() => loadScenario('MAL_CONDICIONADO')} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm text-white transition">Mal Condicionado</button>
        </div>
      </div>

      {/* Panel de Fórmulas */}
      <div className="bg-[#0b1120] border border-panelBorder rounded-lg p-6">
        <h2 className="text-lg font-semibold text-accent mb-4">Fundamento Matemático</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">1. Anemómetro (Viento)</h3>
            <p className="text-slate-400 mb-2">Modelo oscilatorio de ráfagas:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              v(t) = 12 + 6·sin(0.8t)
            </div>
          </div>
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">2. Célula de Carga (Tensión)</h3>
            <p className="text-slate-400 mb-2">Respuesta amortiguada:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              T(t) = 450 + 15·sin(0.8t - 0.5) + 20e^(-0.2t)
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Simulación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Botones de Play/Pausa */}
        <div className="bg-panel border border-panelBorder p-4 rounded-lg flex items-center justify-between col-span-1 md:col-span-2">
          <span className="text-sm text-slate-300">
            Estado: <strong className="text-accent uppercase">{status}</strong> | Tiempo: <strong className="text-accent">{tiempoActual.toFixed(2)}s</strong>
          </span>
          <div className="flex gap-2">
            {status === 'idle' || status === 'finished' ? (
              <button onClick={start} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded transition">
                INICIAR
              </button>
            ) : (
              <>
                {status === 'running' ? (
                  <button onClick={pause} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition">PAUSAR</button>
                ) : (
                  <button onClick={resume} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition">CONTINUAR</button>
                )}
                <button onClick={reset} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition">REINICIAR</button>
              </>
            )}
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="bg-panel border border-panelBorder p-4 rounded-lg flex items-center justify-center">
          <button 
            onClick={handleSave} 
            disabled={guardando || !snapshot || status === 'running'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2 rounded transition"
          >
            {guardando ? 'GUARDANDO...' : 'GUARDAR EN BD'}
          </button>
        </div>
      </div>

      {/* SIMULACIÓN VISUAL DEL TELEFÉRICO */}
      <CableCarScene />

      {snapshot && (
        <>
          {/* Tarjetas de Sensores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorCard tipo="anemometro" />
            <SensorCard tipo="celula_carga" />
          </div>

          {/* Gráfica */}
          <div className="bg-panel border border-panelBorder rounded-lg p-4">
             <PlotlyChart data={chartData} layout={layout} />
          </div>
        </>
      )}
    </div>
  );
}