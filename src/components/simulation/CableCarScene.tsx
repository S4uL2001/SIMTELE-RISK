import { useSimulationStore } from '@/store/useSimulationStore';
import { velocidadViento } from '@/engine/sensorModels';
import { motion } from 'motion/react';

export default function CableCarScene() {
  const { tiempoActual, config, status } = useSimulationStore();
  
  const vActual = velocidadViento(tiempoActual, config.sensores.anemometro);
  const intensidadViento = Math.min(Math.max((vActual - 5) / 15, 0), 1);
  const balanceo = Math.sin(tiempoActual * 2) * intensidadViento * 5;

  return (
    <div className="relative w-full h-[400px] bg-[#0b1120] rounded-xl border border-panelBorder overflow-hidden shadow-2xl">
      
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          status === 'running' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          status === 'paused' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
          'bg-slate-500/10 border-slate-500/30 text-slate-400'
        }`}>
          {status.toUpperCase()}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/50 border border-panelBorder text-accent">
          Viento: {vActual.toFixed(2)} m/s
        </span>
      </div>

      {/* Fondo con gradiente suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-transparent opacity-80" />

      <svg viewBox="0 0 800 400" className="w-full h-full relative z-0">
        <path d="M0,400 L0,300 Q100,200 200,300 T400,250 T600,320 T800,200 L800,400 Z" fill="#1e293b" opacity="0.6"/>
        
        <rect x="150" y="100" width="20" height="300" fill="#334155" />
        <polygon points="140,100 180,100 160,50" fill="#475569" />
        <rect x="650" y="100" width="20" height="300" fill="#334155" />
        <polygon points="640,100 680,100 660,50" fill="#475569" />

        <motion.path 
          d="M160,120 Q400,180 660,120" 
          fill="transparent" 
          stroke="#475569" 
          strokeWidth="4" 
          animate={{ d: `M160,120 Q400,${180 + balanceo * 2} 660,120` }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />

        <motion.g 
          animate={{ x: 400, y: 145 + balanceo, rotate: balanceo }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <circle cx="0" cy="0" r="12" fill="#0ea5e9" className="shadow-lg" />
          <circle cx="0" cy="0" r="5" fill="#0f172a" />
          <line x1="0" y1="0" x2="0" y2="30" stroke="#64748b" strokeWidth="2" />
          <rect x="-25" y="30" width="50" height="60" rx="6" fill="#f59e0b" />
          <rect x="-18" y="35" width="36" height="20" rx="2" fill="#fef3c7" opacity="0.9" />
        </motion.g>

        {/* Partículas de viento suaves */}
        {status === 'running' && Array.from({ length: Math.floor(intensidadViento * 15) }).map((_, i) => (
          <motion.line 
            key={i} 
            initial={{ x1: 800, y1: 50 + (i * 20) % 200, x2: 830 }}
            animate={{ 
              x1: [800, -100], 
              x2: [830, -70],
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 / (intensidadViento + 0.5), 
              delay: i * 0.1, 
              ease: "linear" 
            }}
            stroke="#22d3ee" 
            strokeWidth="2" 
          />
        ))}
      </svg>
    </div>
  );
}