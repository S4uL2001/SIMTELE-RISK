import { create } from 'zustand';
import { SimulationConfig, SimulationStatus } from '@/types/simulation';
import { defaultSensorConfig } from '@/types/sensor';
import { SimulationEngine } from '@/engine/simulationEngine';

interface SimulationState {
  config: SimulationConfig;
  status: SimulationStatus;
  tiempoActual: number;
  snapshot: ReturnType<typeof SimulationEngine.generateDataset> | null;
  
  // Acciones
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: (dt: number) => void;
  updateConfig: (newConfig: Partial<SimulationConfig>) => void;
  generateData: () => void;
}

const defaultConfig: SimulationConfig = {
  duracionSeg: 15,
  frecuenciaMuestreoHz: 10,
  playbackRate: 1,
  semilla: 42,
  escenario: {
    tipo: 'NORMAL',
    descripcion: 'Pérdida de 2 paquetes',
    loss: { instantesIndividuales: [4, 8] },
    noiseAmplitude: 0.5,
  },
  sensores: defaultSensorConfig(),
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  config: defaultConfig,
  status: 'idle',
  tiempoActual: 0,
  snapshot: null,

  start: () => {
    set({ status: 'running', tiempoActual: 0 });
    get().generateData();
  },
  
  pause: () => set({ status: 'paused' }),
  
  resume: () => set({ status: 'running' }),
  
  reset: () => set({ status: 'idle', tiempoActual: 0, snapshot: null }),
  
  tick: (dt) => {
    const { status, tiempoActual, config } = get();
    if (status !== 'running') return;
    
    // Avanzamos el tiempo físico según el playbackRate
    const nuevoTiempo = tiempoActual + dt * config.playbackRate;
    
    if (nuevoTiempo >= config.duracionSeg) {
      set({ tiempoActual: config.duracionSeg, status: 'finished' });
    } else {
      set({ tiempoActual: nuevoTiempo });
    }
  },

  updateConfig: (newConfig) => {
    set((state) => ({ config: { ...state.config, ...newConfig } }));
    if (get().status === 'idle') get().generateData(); // Actualizar previsualización
  },

  generateData: () => {
    const { config } = get();
    const snapshot = SimulationEngine.generateDataset(config);
    set({ snapshot });
  }
}));