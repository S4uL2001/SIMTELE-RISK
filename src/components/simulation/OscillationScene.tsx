import { useEffect, useRef, useState } from 'react';
import { useModule3Store } from '@/store/useModule3Store';
import { motion } from 'motion/react';

export default function OscillationScene() {
  const { results, params } = useModule3Store();
  const [animTime, setAnimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => { setIsPlaying(false); setAnimTime(0); }, [results]);

  useEffect(() => {
    if (!isPlaying || !results) return;
    const animate = (time: number) => {
      if (lastTimeRef.current !== 0) {
        const dt = (time - lastTimeRef.current) / 1000;
        setAnimTime((prev) => {
          const next = prev + dt * 2; 
          if (next >= params.tMax) { setIsPlaying(false); return params.tMax; }
          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    lastTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, results, params.tMax]);

  if (!results) return null;

  const t = animTime;
  const history = results.history;
  let currentX = 0;
  for (let i = 0; i < history.t.length - 1; i++) {
    if (t >= history.t[i] && t <= history.t[i + 1]) {
      const fraction = (t - history.t[i]) / (history.t[i + 1] - history.t[i]);
      currentX = history.x_rk4[i] + fraction * (history.x_rk4[i + 1] - history.x_rk4[i]);
      break;
    }
  }

  const posicionPx = currentX * 5;
  const angulo = posicionPx * 0.1; 

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-4 mb-6 relative overflow-hidden shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex gap-3 items-center">
        <button
          onClick={() => { if (t >= params.tMax) setAnimTime(0); setIsPlaying(!isPlaying); }}
          className={`px-5 py-2 rounded-md text-sm font-bold shadow-lg transition-all ${
            isPlaying ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'
          }`}
        >
          {isPlaying ? 'PAUSAR VIENTO' : 'SIMULAR VIENTO'}
        </button>
        <div className="font-mono text-xs bg-black/60 border border-panelBorder px-3 py-1.5 rounded-md text-accent">
          T: {t.toFixed(2)} / {params.tMax.toFixed(2)} s
        </div>
      </div>

      <svg viewBox="0 0 800 300" className="w-full h-[300px] mt-12">
        {/* Montañas de fondo */}
        <path d="M0,300 L0,200 Q100,150 200,200 T400,180 T600,220 T800,150 L800,300 Z" fill="#1e293b" opacity="0.4" />

        <rect x="100" y="80" width="15" height="220" fill="#334155" />
        <rect x="685" y="80" width="15" height="220" fill="#334155" />

        {/* Cable Bezier Dinámico */}
        <motion.path 
          animate={{ d: `M107.5,90 Q${400 + posicionPx * 0.5},${90 + Math.abs(posicionPx) * 0.3} 692.5,90` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          fill="transparent" 
          stroke="#475569" 
          strokeWidth="4" 
        />

        {/* Cabina */}
        <motion.g 
          animate={{ 
            x: 400 + posicionPx, 
            y: 100 + Math.abs(posicionPx) * 0.1,
            rotate: angulo
          }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <circle cx="0" cy="0" r="10" fill="#0ea5e9" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <rect x="-25" y="20" width="50" height="60" rx="6" fill="#f59e0b" />
          <rect x="-18" y="25" width="36" height="20" rx="2" fill="#fef3c7" opacity="0.9" />
        </motion.g>

        {/* Líneas de viento fluidas */}
        {isPlaying && [...Array(6)].map((_, i) => (
          <motion.line 
            key={i}
            initial={{ x1: 800, y1: 50 + i * 30, x2: 600, y2: 50 + i * 30, opacity: 0 }}
            animate={{ 
              x1: [800, 200], 
              x2: [600, 0], 
              opacity: [0, 0.6, 0] 
            }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2, ease: "linear" }}
            stroke="#22d3ee" 
            strokeWidth="2" 
          />
        ))}

        <g transform="translate(20, 270)">
          <text x="0" y="0" fill="#64748b" fontSize="12" fontFamily="monospace">Desplazamiento: <tspan fill="#22d3ee">{currentX.toFixed(2)} m</tspan></text>
        </g>
      </svg>
    </div>
  );
}