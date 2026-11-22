import { useSimulationStore } from '@/store/useSimulationStore';
import { SENSOR_LABELS, SENSOR_UNITS, SensorType } from '@/types/sensor';
import { AlertTriangle } from 'lucide-react';

export default function SensorCard({ tipo }: { tipo: SensorType }) {
  const { tiempoActual, snapshot } = useSimulationStore();
  
  if (!snapshot) return null;

  const medidas = snapshot.medidas[tipo];
  if (!medidas || medidas.length === 0) return null;

  const medicionActual = medidas.reduce((prev, curr) => 
    Math.abs(curr.t - tiempoActual) < Math.abs(prev.t - tiempoActual) ? curr : prev
  );

  const isLost = medicionActual.estadoTransmision === 'perdido';
  const valorMostrar = isLost ? '---' : (medicionActual.valorObservado?.toFixed(2) ?? 'N/A');

  return (
    <div className={`p-5 rounded-xl border shadow-lg transition-all ${
      isLost ? 'bg-red-900/10 border-red-500/30' : 'bg-panel border-panelBorder'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm text-slate-300">{SENSOR_LABELS[tipo]}</h3>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
          isLost ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isLost ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          {isLost ? 'DESCONECTADO' : 'EN LÍNEA'}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-4xl font-bold tracking-tight ${isLost ? 'text-red-400/50' : 'text-accent'}`}>
          {valorMostrar}
        </span>
        <span className="text-sm font-medium text-slate-500">{SENSOR_UNITS[tipo]}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-panelBorder/50">
        {isLost ? (
          <div className="flex items-center gap-2 text-xs text-red-400 font-mono">
            <AlertTriangle className="w-4 h-4" />
            <span>PÉRDIDA DE TELEMETRÍA</span>
          </div>
        ) : (
            <div className="text-xs text-slate-500 font-mono flex justify-between">
              <span>Ref. oculta:</span>
              <span>{medicionActual.valorReferencia.toFixed(2)}</span>
            </div>
        )}
      </div>
    </div>
  );
}