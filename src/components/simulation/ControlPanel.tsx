import { useEffect, useRef, useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { saveSimulationToDB } from '@/services/simulationService'; // <-- IMPORTACIÓN CORREGIDA

export default function ControlPanel() {
  const { status, start, pause, resume, reset, tick, tiempoActual, config } = useSimulationStore();
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const animate = (time: number) => {
      if (lastTimeRef.current !== 0) {
        const dt = (time - lastTimeRef.current) / 1000;
        tick(dt);
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      const nombre = prompt(
        'Ingresa un nombre para este experimento:', 
        `Simulación ${new Date().toLocaleTimeString()}`
      );
      
      if (nombre) {
        // Usamos la nueva función que guarda cualquier módulo
        const exito = await saveSimulationToDB(
          'Módulo 4: Sensores', 
          config.escenario.tipo, 
          config, 
          { estado: 'completado' }
        );
        
        if (exito) {
          alert('¡Experimento guardado en Supabase con éxito!');
        } else {
          alert('Hubo un error al guardar en la base de datos.');
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(`Error técnico: ${error.message || 'Desconocido'}`); 
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-panel border border-panelBorder rounded-lg p-4 flex flex-col gap-4">
      <div className="bg-[#0b1120] rounded p-3 text-center border border-panelBorder">
        <div className="text-xs text-slate-400 mb-1">TIEMPO DE SIMULACIÓN</div>
        <div className="font-mono text-3xl text-accent">
          {tiempoActual.toFixed(2)} <span className="text-sm">s</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">Límite: {config.duracionSeg}s</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {status === 'idle' || status === 'finished' ? (
          <button onClick={start} className="col-span-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition">
            INICIAR SIMULACIÓN
          </button>
        ) : (
          <>
            {status === 'running' ? (
              <button onClick={pause} className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded transition">
                PAUSAR
              </button>
            ) : (
              <button onClick={resume} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition">
                CONTINUAR
              </button>
            )}
            <button onClick={reset} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded transition">
              REINICIAR
            </button>
          </>
        )}
      </div>

      <button 
        onClick={handleGuardar} 
        disabled={guardando || status === 'running'}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded transition"
      >
        {guardando ? 'GUARDANDO EN BD...' : 'GUARDAR EXPERIMENTO'}
      </button>

      <div className="mt-4 pt-4 border-t border-panelBorder flex flex-col gap-3">
        <label className="text-sm text-slate-300 flex justify-between">
          Velocidad de reproducción: <span className="font-mono text-accent">{config.playbackRate}x</span>
        </label>
        <input 
          type="range" min="0.5" max="3" step="0.5" 
          value={config.playbackRate}
          onChange={(e) => useSimulationStore.getState().updateConfig({ playbackRate: Number(e.target.value) })}
          className="w-full accent-accent"
        />
      </div>
    </div>
  );
}