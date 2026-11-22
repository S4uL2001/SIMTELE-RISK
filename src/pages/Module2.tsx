import { useEffect } from 'react';
import { useModule2Store } from '@/store/useModule2Store';
import PlotlyChart from '@/components/charts/PlotlyChart';
import type { Data, Layout } from 'plotly.js';
import DeteriorationScene from '@/components/simulation/DeteriorationScene';

export default function Module2() {
  const { params, results, updateParams, runSimulation } = useModule2Store();

  useEffect(() => {
    if (!results) runSimulation();
  }, [results, runSimulation]);

  const loadScenario = (type: 'NORMAL' | 'ESTRES' | 'MAL_CONDICIONADO') => {
    if (type === 'NORMAL') updateParams({ d0: 0, alpha: 0.5, beta: 0.1, umbral: 50 });
    if (type === 'ESTRES') updateParams({ d0: 10, alpha: 1.5, beta: 0.3, umbral: 50 }); 
    if (type === 'MAL_CONDICIONADO') updateParams({ d0: 0, alpha: 0.5, beta: 0.1, umbral: 100 }); 
    setTimeout(runSimulation, 50);
  };

  let chartData: Data[] = [];
  let layout: Partial<Layout> = {};

  if (results) {
    chartData = [
      {
        x: results.history.t,
        y: results.history.d,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Deterioro Acumulado D(t)',
        line: { color: '#f59e0b', width: 3 }
      },
      {
        x: [0, results.history.t[results.history.t.length - 1]],
        y: [params.umbral, params.umbral],
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Umbral Crítico',
        line: { color: '#ef4444', width: 2, dash: 'dash' as const }
      }
    ];
    layout = { 
      title: 'Curva de Deterioro Mecánico', 
      xaxis: { title: 'Tiempo (Años)' }, 
      yaxis: { title: 'Nivel de Deterioro' },
      legend: { orientation: 'h', y: 1.1 }
    };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header y Escenarios */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Módulo 2: Deterioro Mecánico</h1>
          <p className="text-slate-400">Predicción de fallos mediante Raíces y Calibración con Sistemas Lineales.</p>
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
            <h3 className="font-bold text-slate-200 mb-2">1. Raíces (Bisección, Newton, Secante)</h3>
            <p className="text-slate-400 mb-2">Para predecir el año de fallo resolviendo:</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              D(t) - Umbral = 0<br/>
              D(t) = d₀ + αt + βt²
            </div>
          </div>
          <div className="bg-panel p-4 rounded border border-panelBorder/50">
            <h3 className="font-bold text-slate-200 mb-2">2. Sistemas Lineales</h3>
            <p className="text-slate-400 mb-2">Para calibrar los sensores (Jacobi, Gauss-Seidel, LU, GC):</p>
            <div className="font-mono text-green-400 bg-black/30 p-2 rounded text-center">
              A · x = b
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Deterioro inicial (d0)</label>
          <input 
            type="text" 
            value={params.d0} 
            onChange={e => updateParams({ d0: Number(e.target.value.replace(',', '.')) })} 
            className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" 
          />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Tasa α</label>
          <input 
            type="text" 
            value={params.alpha} 
            onChange={e => updateParams({ alpha: Number(e.target.value.replace(',', '.')) })} 
            className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" 
          />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Tasa β</label>
          <input 
            type="text" 
            value={params.beta} 
            onChange={e => updateParams({ beta: Number(e.target.value.replace(',', '.')) })} 
            className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" 
          />
        </div>
        <div className="bg-panel border border-panelBorder p-4 rounded-lg">
          <label className="text-xs text-slate-400 block mb-1">Umbral Crítico</label>
          <input 
            type="text" 
            value={params.umbral} 
            onChange={e => updateParams({ umbral: Number(e.target.value.replace(',', '.')) })} 
            className="w-full bg-[#0b1120] p-2 rounded border border-panelBorder text-accent font-mono" 
          />
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
          <DeteriorationScene />

          {/* Gráfica */}
          <div className="bg-panel border border-panelBorder rounded-lg p-4">
             <PlotlyChart data={chartData} layout={layout} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resultados de Raíces */}
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-green-400 font-bold mb-4 border-b border-panelBorder pb-2">Predicción de Fallo (Raíces)</h3>
               <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-2">Método</th>
                      <th className="pb-2">Año de Fallo</th>
                      <th className="pb-2">Iteraciones</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Bisección</td>
                      <td className="text-green-400">{results.roots.bis.raiz?.toFixed(4)}</td>
                      <td>{results.roots.bis.iteraciones.length}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Newton-Raphson</td>
                      <td className="text-green-400">{results.roots.newt.raiz?.toFixed(4)}</td>
                      <td>{results.roots.newt.iteraciones.length}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Secante</td>
                      <td className="text-green-400">{results.roots.sec.raiz?.toFixed(4)}</td>
                      <td>{results.roots.sec.iteraciones.length}</td>
                    </tr>
                  </tbody>
               </table>
               <p className="mt-4 text-xs text-slate-400 bg-panel p-2 rounded border border-panelBorder">
                 <strong>Conclusión Física:</strong> Se debe programar mantenimiento antes del año <strong>{results.roots.newt.raiz?.toFixed(1)}</strong> para evitar fallas catastróficas.
               </p>
            </div>

            {/* Resultados de Sistemas Lineales */}
            <div className="bg-[#0b1120] p-6 rounded-lg border border-panelBorder">
               <h3 className="text-lg text-accent font-bold mb-4 border-b border-panelBorder pb-2">Calibración de Sensores (Sistemas Ax=b)</h3>
               <p className="text-xs text-slate-400 mb-3">Comparación de los 4 métodos para resolver un sistema SPD 4x4.</p>
               <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="pb-2">Método</th>
                      <th className="pb-2">Iteraciones</th>
                      <th className="pb-2">Error Residual</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Jacobi</td>
                      <td>{results.linearSystems.jacobi.iteraciones}</td>
                      <td className="text-red-400">{results.linearSystems.jacobi.error.toExponential(2)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Gauss-Seidel</td>
                      <td className="text-green-400">{results.linearSystems.gs.iteraciones}</td>
                      <td className="text-red-400">{results.linearSystems.gs.error.toExponential(2)}</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">LU (Directo)</td>
                      <td>{results.linearSystems.lu.iteraciones}</td>
                      <td className="text-green-400">~0</td>
                    </tr>
                    <tr className="border-t border-panelBorder/30">
                      <td className="py-2 text-slate-300">Gradiente Conj.</td>
                      <td className="text-accent">{results.linearSystems.cg.iteraciones}</td>
                      <td className="text-red-400">{results.linearSystems.cg.error.toExponential(2)}</td>
                    </tr>
                  </tbody>
               </table>
               <p className="mt-4 text-xs text-slate-500 italic">
                 *Nota: Gauss-Seidel converge más rápido que Jacobi. El Gradiente Conjugado es óptimo para matrices simétricas definidas positivas (SPD).
               </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}