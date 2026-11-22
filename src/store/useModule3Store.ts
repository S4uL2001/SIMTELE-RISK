import { create } from 'zustand';
import { solveOscillation, OscillationParams } from '@/engine/module3Engine';

interface Module3State {
  params: OscillationParams;
  results: ReturnType<typeof solveOscillation> | null;
  updateParams: (newParams: Partial<OscillationParams>) => void;
  runSimulation: () => void;
}

export const useModule3Store = create<Module3State>((set, get) => ({
  params: { m: 1000, c: 50, k: 200, F0: 100, omega: 1.5, tMax: 20, h: 0.1 },
  results: null,
  updateParams: (newParams) => set((state) => ({ params: { ...state.params, ...newParams } })),
  runSimulation: () => {
    const res = solveOscillation(get().params);
    set({ results: res });
  },
}));