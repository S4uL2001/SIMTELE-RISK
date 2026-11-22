import { useEffect } from 'react';
import { useModule3Store } from '@/store/useModule3Store';
import PlotlyChart from '@/components/charts/PlotlyChart';
import type { Data, Layout } from 'plotly.js';
import OscillationScene from '@/components/simulation/OscillationScene';

export default function Module3() {
  const { params, results, updateParams, runSimulation } = useModule3Store();

  useEffect(() => {
    if (!results) runSimulation();
  }, [results, runSimulation]);

  const loadScenario = (type: 'NORMAL' | 'ESTRES' | 'MAL_CONDICIONADO') => {
    if (type === 'NORMAL') updateParams({ m: 1000, c: 50, k: 200, F0: 100, omega: 1.5, tMax: 20, h: 0.1 });
    if (type === 'ESTRES') updateParams({ m: 1000, c: 10, k: 200, F0: 300, omega: 1.5, tMax: 20, h: 0.1 }); // Poco amortiguamiento y mucha fuerza (viento fuerte)
    if (type === 'MAL_CONDICIONADO') updateParams({ m: 1000, c: 50, k: 200, F0: 100, omega: 1.5, tMax: 20, h: 1.5 }); // Paso de integración muy grande
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
      title: 'Curva de Oscilación por Viento', 
      xaxis: { title: 'Tiempo (s)' }, 
      yaxis: { title: 'Desplazamiento (m)' },
      legend: { orientation: 'h', y: 1.1 }
    };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header y Escenarios */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Módulo 3: Oscilaciones por Viento</h1>
          <p className="text-slate-400">Análisis de EDOs y Energía Acumulada por Integración.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadScenario('NORMAL')} className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm transition">Normal</button>
          <button onClick={() => loadScenario('ESTRES')} className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 rounded text-sm text-white transition">Estrés (Viento Fuerte)</button>
          <button onClick={() => loadScenario('MAL_CONDICIONADO')} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm text-white transition">Mal Condicionado</button>
        </div>
      </div>

      {/* Panel de Fórmulas */}
      <div className="bg-[#0b1120] border border-panelBorder rounded-lg p-6">
        <h2 className="text-lg font-semibold text-accent mb-4">Fundamento Matemático</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">1. EDOs (Sistema Masa-Resorte)</h3>
            <p className="text-slate-400 mb-2">Ecuaciones diferenciales de segundo orden:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              dx/dt = v(t)<br/>
              dv/dt = (F(t) - cv - kx) / m
            </div>
          </div>
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">2. Integración</h3>
            <p className="text-slate-400 mb-2">Para calcular la magnitud acumulada del movimiento:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              M = ∫ |x(t)| dt
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Masa m [kg]</label>
          <input type="text" value={params.m} onChange={e => updateParams({ m: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Amortig. c</label>
          <input type="text" value={params.c} onChange={e => updateParams({ c: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Rigidez k</label>
          <input type="text" value={params.k} onChange={e => updateParams({ k: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Fuerza F0</label>
          <input type="text" value={params.F0} onChange={e => updateParams({ F0: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Frec. ω</label>
          <input type="text" value={params.omega} onChange={e => updateParams({ omega: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Paso h</label>
          <input type="text" value={params.h} onChange={e => updateParams({ h: Number(e.target.value.replace(',', '.')) })} className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg flex items-end">
          <button onClick={runSimulation} className="w-full bg-accent hover:bg-cyan-400 text-black font-bold py-2 rounded transition">
            EJECUTAR
          </button>
        </div>
      </div>

      {results && (
        <>
          {/* Simulación Visual */}
          <OscillationScene />

          {/* Gráfica */}
          <div className="bg-panel border border-panelBorder rounded-lg p-4">
             <PlotlyChart data={chartData} layout={layout} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resultados EDO */}
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-green-400 font-bold mb-4 border-b border-panelBorder pb-2">Amplitud Máxima Registrada</h3>
               <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-2">Método</th>
                      <th className="pb-2">Desplazamiento Máximo (m)</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">RK4 (Runge-Kutta 4)</td>
                      <td className="text-green-400">{results.maxAmplitudes.rk4.toFixed(4)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">RK2 (Runge-Kutta 2)</td>
                      <td className="text-accent">{results.maxAmplitudes.rk2.toFixed(4)}</td>
                    </tr>
                  </tbody>
               </table>
               <p className="mt-4 text-xs text-slate-400 bg-panel p-2 rounded border border-panelBorder">
                 <strong>Conclusión Física:</strong> El viento genera un desplazamiento máximo de {results.maxAmplitudes.rk4.toFixed(2)} metros. Si el amortiguamiento (c) disminuye, las oscilaciones tardarán más en detenerse.
               </p>
            </div>

            {/* Resultados Integración */}
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-accent font-bold mb-4 border-b border-panelBorder pb-2">Magnitud Acumulada ( ∫ |x(t)| dt )</h3>
               <p className="text-xs text-slate-400 mb-3">Cálculo del área bajo la curva de oscilación usando métodos numéricos.</p>
               <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-2">Método</th>
                      <th className="pb-2">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Trapecio</td>
                      <td className="text-accent">{results.integration.trap.toFixed(4)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Simpson 1/3</td>
                      <td className="text-accent">{results.integration.simp.toFixed(4)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Romberg</td>
                      <td className="text-green-400">{results.integration.romb.toFixed(4)}</td>
                    </tr>
                  </tbody>
               </table>
               <p className="mt-4 text-xs text-slate-500 italic">
                 *Nota: Romberg suele ser el más preciso. El valor representa la "cantidad total de movimiento" de la cabina en el tiempo.
               </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}