import { useModule1Store } from '@/store/useModule1Store';
import { useModule2Store } from '@/store/useModule2Store';
import { useModule3Store } from '@/store/useModule3Store';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function Results() {
  const m1 = useModule1Store();
  const m2 = useModule2Store();
  const m3 = useModule3Store();
  const m4 = useSimulationStore();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Resumen Global de Resultados</h1>
        <p className="text-slate-400">Estado y hallazgos de las últimas simulaciones ejecutadas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Módulo 1 */}
        <div className="bg-panel border border-panelBorder p-6 rounded-lg border-l-4 border-l-green-500">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Módulo 1: Frenado</h2>
          {m1.results ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="flex justify-between"><span className="text-slate-400">Distancia Exacta:</span> <span className="text-green-400">{m1.results.exact.dist.toFixed(2)} m</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Tiempo de Frenado:</span> <span className="text-accent">{m1.results.exact.tStop.toFixed(2)} s</span></p>
            </div>
          ) : <p className="text-slate-500 italic">No hay datos ejecutados.</p>}
        </div>

        {/* Módulo 2 */}
        <div className="bg-panel border border-panelBorder p-6 rounded-lg border-l-4 border-l-yellow-500">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Módulo 2: Deterioro</h2>
          {m2.results ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="flex justify-between"><span className="text-slate-400">Año de Fallo:</span> <span className="text-red-400">{m2.results.roots.newt.raiz?.toFixed(2)} Años</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Método más rápido:</span> <span className="text-accent">Gradiente Conjugado</span></p>
            </div>
          ) : <p className="text-slate-500 italic">No hay datos ejecutados.</p>}
        </div>

        {/* Módulo 3 */}
        <div className="bg-panel border border-panelBorder p-6 rounded-lg border-l-4 border-l-cyan-500">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Módulo 3: Viento</h2>
          {m3.results ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="flex justify-between"><span className="text-slate-400">Amplitud Máxima:</span> <span className="text-accent">{m3.results.maxAmplitudes.rk4.toFixed(2)} m</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Energía (Romberg):</span> <span className="text-green-400">{m3.results.integration.romb.toFixed(2)}</span></p>
            </div>
          ) : <p className="text-slate-500 italic">No hay datos ejecutados.</p>}
        </div>

        {/* Módulo 4 */}
        <div className="bg-panel border border-panelBorder p-6 rounded-lg border-l-4 border-l-indigo-500">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Módulo 4: Sensores</h2>
          {m4.snapshot ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="flex justify-between"><span className="text-slate-400">Escenario:</span> <span className="text-indigo-400">{m4.config.escenario.tipo}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Datos Totales:</span> <span className="text-accent">{m4.snapshot.medidas.anemometro.length} muestras</span></p>
            </div>
          ) : <p className="text-slate-500 italic">No hay datos ejecutados.</p>}
        </div>

      </div>
    </div>
  );
}