import { useSimulationStore } from '@/store/useSimulationStore';
import { SENSOR_LABELS } from '@/types/sensor';

export default function Sensors() {
  const { config } = useSimulationStore();
  const { anemometro, celulaCarga } = config.sensores;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Sensores y Modelos Matemáticos</h1>
        <p className="text-slate-400">Ecuaciones analíticas de referencia (Verdad oculta).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta Anemómetro */}
        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h2 className="text-xl font-bold text-accent mb-4">{SENSOR_LABELS.anemometro}</h2>
          <div className="bg-[#0b1120] p-4 rounded border border-panelBorder font-mono text-center mb-4 text-green-400">
            v(t) = {anemometro.vMedia} + {anemometro.amplitud} · sin({anemometro.frecuenciaAngular} · t)
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li><strong className="text-slate-400">Variable:</strong> Velocidad del viento (v)</li>
            <li><strong className="text-slate-400">Unidad:</strong> m/s</li>
            <li><strong className="text-slate-400">Umbral de alerta:</strong> {anemometro.umbral} m/s</li>
            <li><strong className="text-slate-400">Fenómeno:</strong> Ráfagas oscilatorias.</li>
          </ul>
        </div>

        {/* Tarjeta Célula de Carga */}
        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h2 className="text-xl font-bold text-accent mb-4">{SENSOR_LABELS.celula_carga}</h2>
          <div className="bg-[#0b1120] p-4 rounded border border-panelBorder font-mono text-center mb-4 text-green-400 text-sm overflow-x-auto">
            T(t) = {celulaCarga.tMedia} + {celulaCarga.amplitudSeno} · sin({celulaCarga.frecuenciaAngular}t - {celulaCarga.desfase}) + {celulaCarga.amplitudExponencial} · e^(-{celulaCarga.amortiguamiento}t)
          </div>
          <ul className="text-sm text-slate-300 space-y-2">
            <li><strong className="text-slate-400">Variable:</strong> Tensión del cable (T)</li>
            <li><strong className="text-slate-400">Unidad:</strong> kN</li>
            <li><strong className="text-slate-400">Umbral de alerta:</strong> {celulaCarga.umbral} kN</li>
            <li><strong className="text-slate-400">Fenómeno:</strong> Respuesta amortiguada por el viento.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}