import { useMemo } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Node, interpolarLagrange } from '@/numerical/lagrange';
import { interpolarNewton } from '@/numerical/newtonInterpolation';
import { interpolarSpline } from '@/numerical/cubicSpline';
import { errorMetrics } from '@/numerical/errors';

export default function MathematicalLab() {
  const { snapshot } = useSimulationStore();

  const resultados = useMemo(() => {
    if (!snapshot) return null;

    const serieViento = snapshot.medidas.anemometro;
    const faltantes = serieViento.filter((m) => m.estadoTransmision === 'perdido');
    
    if (faltantes.length === 0) return null;

    const primerFaltante = faltantes[0].t;

    // CORRECCIÓN: En lugar de tomar TODOS los nodos de la ventana (que causan Runge),
    // tomamos un máximo de 6 nodos: 3 antes del hueco y 3 después.
    const nodosTransmitidos = serieViento.filter((m) => m.estadoTransmision === 'transmitido');
    
    // Filtramos los más cercanos a la izquierda del hueco
    const izq = nodosTransmitidos
      .filter((m) => m.t < primerFaltante)
      .slice(-3)
      .map((m) => ({ t: m.t, y: m.valorObservado! }));

    // Filtramos los más cercanos a la derecha
    const der = nodosTransmitidos
      .filter((m) => m.t > primerFaltante)
      .slice(0, 3)
      .map((m) => ({ t: m.t, y: m.valorObservado! }));

    const nodos: Node[] = [...izq, ...der];

    const tiemposFaltantes = faltantes.map((m) => m.t);
    const verdadesOcultas = faltantes.map((m) => m.valorReferencia);

    const resLagrange = interpolarLagrange(nodos, tiemposFaltantes);
    const resNewton = interpolarNewton(nodos, tiemposFaltantes);
    const resSpline = interpolarSpline(nodos, tiemposFaltantes);

    const tabla = tiemposFaltantes.map((t, i) => {
      const vReal = verdadesOcultas[i];
      const valLag = resLagrange.valores[i];
      const valNew = resNewton.valores[i];
      const valSpl = resSpline.valores[i];

      return {
        t,
        vReal,
        valLag,
        errLag: errorMetrics(vReal, valLag).errorAbsoluto,
        valNew,
        errNew: errorMetrics(vReal, valNew).errorAbsoluto,
        valSpl,
        errSpl: errorMetrics(vReal, valSpl).errorAbsoluto,
      };
    });

    return { nodosCount: nodos.length, tabla };
  }, [snapshot]);

  if (!snapshot) {
    return <div className="text-center p-10 text-slate-400">Por favor, ve al <strong>Simulador</strong> e inicia una simulación primero.</div>;
  }

  if (!resultados) {
    return <div className="text-center p-10 text-slate-400">La simulación no tiene datos perdidos o no ha finalizado.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Laboratorio Matemático</h1>
        <p className="text-slate-400">Comparación de métodos de interpolación para reconstruir la señal del anemómetro.</p>
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-accent mb-2">Metodología aplicada</h2>
        <p className="text-sm text-slate-300 mb-4">
          Se han utilizado <strong>{resultados.nodosCount} nodos</strong> válidos (3 a la izquierda y 3 a la derecha del apagón). 
          A continuación se muestra el valor real y las estimaciones calculadas por cada algoritmo.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-panelBorder text-slate-400 text-sm">
                <th className="py-2 px-4">Tiempo (s)</th>
                <th className="py-2 px-4 text-green-400">Verdad Oculta</th>
                <th className="py-2 px-4 border-l border-panelBorder">Lagrange (Error)</th>
                <th className="py-2 px-4 border-l border-panelBorder">Newton (Error)</th>
                <th className="py-2 px-4 border-l border-panelBorder">Spline (Error)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {resultados.tabla.map((row, i) => (
                <tr key={i} className="border-b border-panelBorder/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4">{row.t.toFixed(2)}</td>
                  <td className="py-3 px-4 text-green-400 font-bold">{row.vReal.toFixed(4)}</td>
                  
                  <td className="py-3 px-4 border-l border-panelBorder">
                    <div>{row.valLag.toFixed(4)}</div>
                    <div className="text-xs text-red-400">Ea: {row.errLag.toExponential(2)}</div>
                  </td>

                  <td className="py-3 px-4 border-l border-panelBorder">
                    <div>{row.valNew.toFixed(4)}</div>
                    <div className="text-xs text-red-400">Ea: {row.errNew.toExponential(2)}</div>
                  </td>

                  <td className="py-3 px-4 border-l border-panelBorder">
                    <div>{row.valSpl.toFixed(4)}</div>
                    <div className="text-xs text-red-400">Ea: {row.errSpl.toExponential(2)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-200">
        <strong>Nota matemática:</strong> Lagrange y Newton producen el mismo polinomio (son matemáticamente idénticos). 
        Los Splines Cúbicos a menudo logran un error menor porque no sufren el Fenómeno de Runge (las oscilaciones violentas que ocurren al usar polinomios de grado muy alto).
      </div>
    </div>
  );
}