import { useEffect } from 'react';
import { useModule1Store } from '@/store/useModule1Store';
import PlotlyChart from '@/components/charts/PlotlyChart';
import type { Data, Layout } from 'plotly.js';
import BrakingScene from '@/components/simulation/BrakingScene'; // <-- IMPORTACIÓN NUEVA

export default function Module1() {
  const { params, results, updateParams, runSimulation } = useModule1Store();

  useEffect(() => {
    if (!results) runSimulation();
  }, [results, runSimulation]);

  const loadScenario = (type: 'NORMAL' | 'ESTRES' | 'MAL_CONDICIONADO') => {
    if (type === 'NORMAL') updateParams({ v0: 15, a: 2, h: 0.5 });
    if (type === 'ESTRES') updateParams({ v0: 25, a: 1.5, h: 0.1 }); 
    if (type === 'MAL_CONDICIONADO') updateParams({ v0: 15, a: 2, h: 1.5 }); 
    setTimeout(runSimulation, 50);
  };

  let chartData: Data[] = [];
  let layout: Partial<Layout> = {};

  if (results) {
    chartData = [
      {
        x: results.history.t,
        y: results.history.x_rk4,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Posición x(t) - RK4',
        line: { color: '#22c55e', width: 3 }
      },
      {
        x: results.history.t,
        y: results.history.x_rk2,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Posición x(t) - RK2',
        line: { color: '#3b82f6', width: 2, dash: 'dot' as const }
      }
    ];
    layout = { 
      title: 'Curva de Posición vs Tiempo (Frenado)', 
      xaxis: { title: 'Tiempo (s)' }, 
      yaxis: { title: 'Distancia (m)' },
      legend: { orientation: 'h', y: 1.1 }
    };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header y Escenarios */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Módulo 1: Detención de Emergencia</h1>
          <p className="text-slate-400">Análisis de frenado usando EDOs, Integración y Raíces.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">1. EDO (Runge-Kutta)</h3>
            <p className="text-slate-400 mb-2">Sistema de ecuaciones diferenciales de primer orden:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              dx/dt = v(t)<br/>dv/dt = -a
            </div>
          </div>
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">2. Integración</h3>
            <p className="text-slate-400 mb-2">Para calcular la distancia total integrando la velocidad:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              d = ∫ v(t) dt
            </div>
          </div>
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">3. Raíces</h3>
            <p className="text-slate-400 mb-2">Para hallar el tiempo exacto donde v(t) = 0:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              f(t) = v0 - a·t = 0
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Velocidad Inicial (v0) [m/s]</label>
          <input type="number" value={params.v0} onChange={e => updateParams({ v0: Number(e.target.value) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Desaceleración (a) [m/s²]</label>
          <input type="number" value={params.a} onChange={e => updateParams({ a: Number(e.target.value) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Paso de tiempo (h) [s]</label>
          <input type="number" value={params.h} onChange={e => updateParams({ h: Number(e.target.value) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg flex items-end">
          <button onClick={runSimulation} className="w-full bg-accent hover:bg-cyan-400 text-black font-bold py-2 rounded transition">
            EJECUTAR CÁLCULOS
          </button>
        </div>
      </div>

      {results && (
        <>
          {/* SIMULACIÓN VISUAL DE FRENADO (NUEVO) */}
          <BrakingScene />

          {/* Gráfica */}
          <div className="bg-panel border border-panelBorder rounded-lg p-4">
             <PlotlyChart data={chartData} layout={layout} />
          </div>

          {/* Resultados Numéricos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-green-400 font-bold mb-4 border-b border-panelBorder pb-2">Resultados (Solución Exacta vs Numérica)</h3>
               <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-2">Métrica</th>
                      <th className="pb-2">Exacto</th>
                      <th className="pb-2">RK4</th>
                      <th className="pb-2">RK2</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Distancia (m)</td>
                      <td className="text-green-400">{results.exact.dist.toFixed(4)}</td>
                      <td>{results.rk4.dist.toFixed(4)}</td>
                      <td>{results.rk2.dist.toFixed(4)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Tiempo (s)</td>
                      <td className="text-green-400">{results.exact.tStop.toFixed(4)}</td>
                      <td colSpan={2} className="text-slate-500 italic">Calculado por métodos de raíces →</td>
                    </tr>
                  </tbody>
               </table>

               <h4 className="text-md text-slate-300 font-bold mt-6 mb-2">Integración de v(t)</h4>
               <div className="grid grid-cols-3 gap-2 text-center text-sm font-mono">
                 <div className="bg-panel p-2 rounded border border-panelBorder">Trapecio<br/><span className="text-accent">{results.integration.trap.toFixed(4)}</span></div>
                 <div className="bg-panel p-2 rounded border border-panelBorder">Simpson<br/><span className="text-accent">{results.integration.simp.toFixed(4)}</span></div>
                 <div className="bg-panel p-2 rounded border border-panelBorder">Romberg<br/><span className="text-accent">{results.integration.romb.toFixed(4)}</span></div>
               </div>
            </div>

            {/* Tabla de Iteraciones de Newton-Raphson */}
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-accent font-bold mb-4 border-b border-panelBorder pb-2">Auditoría de Raíces: Newton-Raphson</h3>
               <p className="text-xs text-slate-400 mb-3">Buscando f(t) = 0 (el instante de detención total)</p>
               <div className="max-h-60 overflow-y-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-[#0b1120]">
                      <tr className="text-slate-400">
                        <th className="pb-2">Iter</th>
                        <th className="pb-2">t_i (Aprox)</th>
                        <th className="pb-2">f(t_i) (Residuo)</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {results.roots.newt.iteraciones.map((it: any, idx: number) => (
                        <tr key={idx} className="border-t border-panelBorder/30">
                          <td className="py-2 text-slate-500">{it.iteracion}</td>
                          <td className="py-2 text-slate-200">{it.aproximacion.toFixed(5)}</td>
                          <td className={`py-2 ${Math.abs(it.residual) < 1e-3 ? 'text-green-400' : 'text-red-400'}`}>
                            {it.residual.toExponential(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
               <div className="mt-4 text-xs text-slate-400 bg-panel p-2 rounded border border-panelBorder">
                 <strong>Resultado:</strong> El método de Newton-Raphson encontró la raíz (detención) en <strong>{results.roots.newt.raiz?.toFixed(4)} s</strong> tras {results.roots.newt.iteraciones.length} iteraciones.
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}