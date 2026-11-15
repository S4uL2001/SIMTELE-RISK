import CableCarScene from '@/components/simulation/CableCarScene';
import ControlPanel from '@/components/simulation/ControlPanel';
import SensorCard from '@/components/sensors/SensorCard';

export default function Simulation() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Simulador de Telemetría Dual</h1>
        <p className="text-slate-400">Reconstrucción y auditoría de viento y tensión ante pérdida de señal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Controles */}
        <div className="lg:col-span-1">
          <ControlPanel />
        </div>

        {/* Columna Derecha: Escena y Sensores */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CableCarScene />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SensorCard tipo="anemometro" />
            <SensorCard tipo="celula_carga" />
          </div>
        </div>

      </div>
    </div>
  );
}