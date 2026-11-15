import { useSimulationStore } from '@/store/useSimulationStore';
import { SENSOR_LABELS, SENSOR_UNITS, SensorType } from '@/types/sensor';

export default function SensorCard({ tipo }: { tipo: SensorType }) {
  const { tiempoActual, snapshot } = useSimulationStore();
  
  if (!snapshot) return null;

  const medidas = snapshot.medidas[tipo];
  if (!medidas || medidas.length === 0) return null;

  // Buscamos la medida más cercana al tiempo actual
  const medicionActual = medidas.reduce((prev, curr) => 
    Math.abs(curr.t - tiempoActual) < Math.abs(prev.t - tiempoActual) ? curr : prev
  );

  const isLost = medicionActual.estadoTransmision === 'perdido';
  const valorMostrar = isLost ? '---' : (medicionActual.valorObservado?.toFixed(2) ?? 'N/A');

  return (
    <div className={`p-4 rounded-lg border transition-colors ${
      isLost ? 'bg-red-900/20 border-red-500/50' : 'bg-panel border-panelBorder'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-sm text-slate-300">{SENSOR_LABELS[tipo]}</h3>
        <div className={`w-3 h-3 rounded-full ${isLost ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-4xl font-bold ${isLost ? 'text-red-400' : 'text-accent'}`}>
          {valorMostrar}
        </span>
        <span className="text-sm text-slate-400">{SENSOR_UNITS[tipo]}</span>
      </div>

      {isLost && (
        <div className="text-xs text-red-400 mt-2 font-mono">
          ⚠ SEÑAL PERDIDA (Pérdida de Telemetría)
        </div>
      )}
      
      {!isLost && (
        <div className="text-xs text-slate-500 mt-2 font-mono">
          Ref. oculta: {medicionActual.valorReferencia.toFixed(2)}
        </div>
      )}
    </div>
  );
}