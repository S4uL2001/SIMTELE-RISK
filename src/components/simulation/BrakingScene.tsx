import { useEffect, useRef, useState } from 'react';
import { useModule1Store } from '@/store/useModule1Store';
import { motion } from 'motion/react';

export default function BrakingScene() {
  const { results, params } = useModule1Store();
  const [animTime, setAnimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    setIsPlaying(false);
    setAnimTime(0);
  }, [results]);

  useEffect(() => {
    if (!isPlaying || !results) return;
    const animate = (time: number) => {
      if (lastTimeRef.current !== 0) {
        const dt = (time - lastTimeRef.current) / 1000;
        setAnimTime((prev) => {
          const next = prev + dt;
          if (next >= results.exact.tStop) {
            setIsPlaying(false);
            return results.exact.tStop;
          }
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

  const t = animTime;
  const exactT = results.exact.tStop;
  const maxDist = results.exact.dist;
  const currentX = Math.min(maxDist, params.v0 * t - 0.5 * params.a * t * t);
  const currentV = Math.max(0, params.v0 - params.a * t);

  const startPx = 100;
  const endPx = 700;
  const currentPx = startPx + (currentX / maxDist) * (endPx - startPx);

  return (
    <div className="bg-panel border border-panelBorder rounded-xl p-4 mb-6 relative overflow-hidden shadow-2xl">
      {/* Efecto de rejilla de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      <div className="absolute top-4 left-4 z-10 flex gap-3 items-center">
        <button
          onClick={() => {
            if (t >= exactT) setAnimTime(0);
            setIsPlaying(!isPlaying);
          }}
          className={`px-5 py-2 rounded-md text-sm font-bold shadow-lg transition-all ${
            isPlaying ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'
          }`}
        >
          {isPlaying ? 'PAUSAR SIMULACIÓN' : 'REPRODUCIR FRENADO'}
        </button>
        <div className="font-mono text-xs bg-black/60 border border-panelBorder px-3 py-1.5 rounded-md text-accent shadow-inner">
          T: {t.toFixed(2)} / {exactT.toFixed(2)} s
        </div>
      </div>

      <svg viewBox="0 0 800 250" className="w-full h-[250px] mt-12 relative z-0">
        <defs>
          <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <rect x="80" y="80" width="15" height="120" fill="#334155" />
        <rect x="705" y="80" width="15" height="120" fill="#334155" />
        <line x1="87.5" y1="90" x2="712.5" y2="90" stroke="#475569" strokeWidth="4" />

        {/* Meta con efecto Láser */}
        <line x1={endPx} y1="60" x2={endPx} y2="140" stroke="#ef4444" strokeWidth="3" strokeDasharray="8 4" filter="url(#glow-red)" />
        <text x={endPx} y="50" fill="#f87171" fontSize="14" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
          Detención: {maxDist.toFixed(1)}m
        </text>

        {/* Cabina */}
        <motion.g 
          animate={{ x: currentPx }}
          transition={{ type: "tween", ease: "linear", duration: 0.1 }}
        >
          <circle cx="0" cy="90" r="10" fill="#0ea5e9" filter="url(#glow-cyan)" />
          <line x1="0" y1="90" x2="0" y2="110" stroke="#94a3b8" strokeWidth="2" />
          <rect x="-22" y="110" width="44" height="45" rx="6" fill="#f59e0b" />
          <rect x="-15" y="115" width="30" height="15" rx="2" fill="#fef3c7" opacity="0.9" />
          
          {/* Chispas de frenado */}
          {isPlaying && t > 0 && t < exactT - 0.2 && (
             <motion.circle 
               cx="28" cy="130" r="3" fill="#f97316" 
               animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} 
               transition={{ repeat: Infinity, duration: 0.2 }}
             />
          )}
        </motion.g>

        <g transform="translate(20, 210)">
          <text x="0" y="0" fill="#64748b" fontSize="12" fontFamily="monospace">Velocidad: <tspan fill="#22d3ee">{currentV.toFixed(2)} m/s</tspan></text>
          <text x="0" y="20" fill="#64748b" fontSize="12" fontFamily="monospace">Distancia: <tspan fill="#22c55e">{currentX.toFixed(2)} m</tspan></text>
        </g>
      </svg>
    </div>
  );
}