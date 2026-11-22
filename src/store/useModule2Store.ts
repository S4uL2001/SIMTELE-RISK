import { create } from 'zustand';
import { solveDeterioration, DeteriorationParams } from '@/engine/module2Engine';

interface Module2State {
  params: DeteriorationParams;
  results: ReturnType<typeof solveDeterioration> | null;
  updateParams: (newParams: Partial<DeteriorationParams>) => void;
  runSimulation: () => void;
}

export const useModule2Store = create<Module2State>((set, get) => ({
  params: { d0: 0, alpha: 0.5, beta: 0.1, umbral: 50 },
  results: null,
  updateParams: (newParams) => set((state) => ({ params: { ...state.params, ...newParams } })),
  runSimulation: () => {
    const res = solveDeterioration(get().params);
    set({ results: res });
  },
}));