import { useMemo } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Node, interpolarLagrange } from '@/numerical/lagrange';
import { interpolarNewton } from '@/numerical/newtonInterpolation';
import { interpolarSpline } from '@/numerical/cubicSpline';
import { errorAbsoluto } from '@/numerical/errors';
import PlotlyChart from '@/components/charts/PlotlyChart';
import type { Data, Layout } from 'plotly.js';

export default function ErrorAnalysis() {
  const { snapshot } = useSimulationStore();

  // Tipamos explícitamente el retorno del useMemo
  const { chartData, layout } = useMemo((): { chartData: Data[]; layout: Partial<Layout> } => {
    if (!snapshot) return { chartData: [], layout: {} };

    const serieViento = snapshot.medidas.anemometro;
    const faltantes = serieViento.filter((m) => m.estadoTransmision === 'perdido');
    
    if (faltantes.length === 0) return { chartData: [], layout: {} };

    const primerFaltante = faltantes[0].t;
    const nodosTransmitidos = serieViento.filter((m) => m.estadoTransmision === 'transmitido');
    
    const izq = nodosTransmitidos.filter((m) => m.t < primerFaltante).slice(-3).map((m) => ({ t: m.t, y: m.valorObservado! }));
    const der = nodosTransmitidos.filter((m) => m.t > primerFaltante).slice(0, 3).map((m) => ({ t: m.t, y: m.valorObservado! }));
    const nodos: Node[] = [...izq, ...der];

    const tiemposFaltantes = faltantes.map((m) => m.t);
    const verdadesOcultas = faltantes.map((m) => m.valorReferencia);

    const resLag = interpolarLagrange(nodos, tiemposFaltantes);
    const resNew = interpolarNewton(nodos, tiemposFaltantes);
    const resSpl = interpolarSpline(nodos, tiemposFaltantes);

    const errLag = tiemposFaltantes.map((_, i) => errorAbsoluto(verdadesOcultas[i], resLag.valores[i]));
    const errNew = tiemposFaltantes.map((_, i) => errorAbsoluto(verdadesOcultas[i], resNew.valores[i]));
    const errSpl = tiemposFaltantes.map((_, i) => errorAbsoluto(verdadesOcultas[i], resSpl.valores[i]));

    const data: Data[] = [
      {
        x: tiemposFaltantes,
        y: errLag,
        type: 'scatter' as const,         // El as const es clave para Plotly
        mode: 'lines+markers' as const,   // El as const es clave para Plotly
        name: 'Error Lagrange',
        line: { color: '#f59e0b', width: 2 },
      },
      {
        x: tiemposFaltantes,
        y: errNew,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Error Newton',
        line: { color: '#3b82f6', width: 2, dash: 'dot' as const },
      },
      {
        x: tiemposFaltantes,
        y: errSpl,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        name: 'Error Spline',
        line: { color: '#22c55e', width: 2 },
      }
    ];

    return { 
      chartData: data, 
      layout: { 
        title: { text: 'Evolución del Error Absoluto en la Reconstrucción' },
        xaxis: { title: { text: 'Tiempo (s)' } },
        yaxis: { title: { text: 'Error Absoluto (m/s)' }, type: 'log' as const }
      } 
    };
  }, [snapshot]);

  if (!snapshot || chartData.length === 0) {
    return (
      <div className="text-center p-10 text-slate-400">
        No hay datos perdidos para analizar. Genera una simulación primero.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Análisis de Errores</h1>
        <p className="text-slate-400">Comparación de la precisión de los métodos numéricos frente a la verdad oculta.</p>
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg p-4 mb-6">
        <PlotlyChart data={chartData} layout={layout} />
      </div>

      <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 text-sm text-blue-200">
        <strong>Interpretación:</strong> La gráfica muestra el Error Absoluto en escala logarítmica. 
        Si el error crece hacia la derecha, significa que el método se vuelve menos confiable al alejarse de los nodos conocidos (extrapolación). 
        Un Error Absoluto cercano a 0 indica una reconstrucción perfecta.
      </div>
    </div>
  );
}