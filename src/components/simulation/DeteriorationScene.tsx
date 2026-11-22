import { useEffect, useRef, useState } from 'react';
import { useModule2Store } from '@/store/useModule2Store';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export default function DeteriorationScene() {
  const { results, params } = useModule2Store();
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
          const next = prev + dt * 5; 
          const tFallo = results.roots.newt.raiz || 30;
          if (next >= tFallo) { setIsPlaying(false); return tFallo; }
          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    lastTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isPlaying, results]);

  if (!results) return null;

  const tFallo = results.roots.newt.raiz || 30;
  const t = animTime;
  const deterioroActual = params.d0 + params.alpha * t + params.beta * t * t;
  const porcentaje = Math.min(100, (deterioroActual / params.umbral) * 100);
  const color = porcentaje < 50 ? '#22c55e' : porcentaje < 80 ? '#f59e0b' : '#ef4444';
  const rotacion = t * 45;

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-4 mb-6 relative overflow-hidden shadow-2xl">
      {porcentaje >= 99 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-20 bg-red-900/90 border border-red-500 text-red-200 px-4 py-2 rounded-md font-bold text-sm shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          UMBRAL CRÍTICO ALCANZADO
        </motion.div>
      )}

      <div className="absolute top-4 left-4 z-10 flex gap-3 items-center">
        <button
          onClick={() => { if (t >= tFallo) setAnimTime(0); setIsPlaying(!isPlaying); }}
          className={`px-5 py-2 rounded-md text-sm font-bold shadow-lg transition-all ${
            isPlaying ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'
          }`}
        >
          {isPlaying ? 'PAUSAR DESGASTE' : 'SIMULAR DESGASTE'}
        </button>
        <div className="font-mono text-xs bg-black/60 border border-panelBorder px-3 py-1.5 rounded-md text-accent">
          Año {t.toFixed(1)} / {tFallo.toFixed(1)}
        </div>
      </div>

      <svg viewBox="0 0 800 250" className="w-full h-[250px] mt-12">
        <defs>
          <filter id="glow-gear">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="400" cy="125" r="85" fill="none" stroke="#1e293b" strokeWidth="8" strokeDasharray="10 10" />
        
        <motion.g 
          transform={`translate(400, 125)`}
          animate={{ rotate: rotacion }}
          transition={{ type: "tween", ease: "linear", duration: 0.5 }}
        >
          {[...Array(8)].map((_, i) => (
            <rect key={i} x="-15" y="-95" width="30" height="30" fill={color} transform={`rotate(${i * 45})`} className="transition-colors duration-500" />
          ))}
          <circle cx="0" cy="0" r="60" fill={color} className="transition-colors duration-500" filter="url(#glow-gear)" />
          <circle cx="0" cy="0" r="25" fill="#0f172a" />
        </motion.g>

        <g transform="translate(150, 220)">
          <text x="0" y="-8" fill="#64748b" fontSize="12" fontFamily="monospace">Nivel de Deterioro:</text>
          <rect x="0" y="0" width="500" height="12" fill="#1e293b" rx="6" />
          <motion.rect 
            x="0" y="0" 
            animate={{ width: Math.min(500, (porcentaje / 100) * 500) }}
            height="12" 
            fill={color} 
            rx="6"
            className="transition-colors duration-500"
          />
          <text x="510" y="10" fill={color} fontSize="14" fontFamily="monospace" fontWeight="bold">
            {porcentaje.toFixed(1)}%
          </text>
        </g>
      </svg>
    </div>
  );
}