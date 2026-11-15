import { useSimulationStore } from '@/store/useSimulationStore';
import { velocidadViento } from '@/engine/sensorModels';

export default function CableCarScene() {
  const { tiempoActual, config, status } = useSimulationStore();
  
  // Calculamos el viento en tiempo real para la animación
  const vActual = velocidadViento(tiempoActual, config.sensores.anemometro);
  // Normalizamos el viento para efectos visuales (0 a 1)
  const intensidadViento = Math.min(Math.max((vActual - 5) / 15, 0), 1);
  
  // Balanceo de la cabina basado en el viento
  const balanceo = Math.sin(tiempoActual * 2) * intensidadViento * 5;

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-[#0f172a] to-[#1e293b] rounded-lg border border-panelBorder overflow-hidden">
      
      {/* Indicador de Estado */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          status === 'running' ? 'bg-green-500/20 text-green-400' :
          status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>

      <svg viewBox="0 0 800 400" className="w-full h-full">
        {/* Cielo y Montañas (Fondo estático) */}
        <path d="M0,400 L0,300 Q100,200 200,300 T400,250 T600,320 T800,200 L800,400 Z" fill="#1e293b" opacity="0.5"/>
        
        {/* Torres */}
        <rect x="150" y="100" width="20" height="300" fill="#475569" />
        <polygon points="140,100 180,100 160,50" fill="#64748b" />
        
        <rect x="650" y="100" width="20" height="300" fill="#475569" />
        <polygon points="640,100 680,100 660,50" fill="#64748b" />

        {/* Cable */}
        <path d="M160,120 Q400,180 660,120" fill="transparent" stroke="#94a3b8" strokeWidth="4" />

        {/* Cabina y Polea */}
        <g transform={`translate(400, 145) rotate(${balanceo})`}>
          {/* Polea */}
          <circle cx="0" cy="0" r="10" fill="#0ea5e9" />
          <circle cx="0" cy="0" r="4" fill="#0f172a" />
          {/* Cable vertical */}
          <line x1="0" y1="0" x2="0" y2="30" stroke="#94a3b8" strokeWidth="2" />
          {/* Cabina */}
          <rect x="-20" y="30" width="40" height="50" rx="4" fill="#f59e0b" />
          {/* Ventanas */}
          <rect x="-14" y="35" width="28" height="15" fill="#fef3c7" opacity="0.8" />
        </g>

        {/* Partículas de Viento */}
        {status === 'running' && Array.from({ length: Math.floor(intensidadViento * 20) }).map((_, i) => {
          // Usamos el tiempo para animar las líneas de viento de derecha a izquierda
          const x = 800 - ((tiempoActual * 100 * intensidadViento + i * 40) % 900);
          const y = 50 + (i * 15) % 200;
          return (
            <line 
              key={i} 
              x1={x} y1={y} 
              x2={x + 20 + intensidadViento * 30} y2={y} 
              stroke="#22d3ee" 
              strokeWidth="2" 
              opacity={0.3 + intensidadViento * 0.5}
            />
          );
        })}
      </svg>
    </div>
  );
}