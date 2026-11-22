import { create } from 'zustand';
import { solveBraking, BrakingParams } from '@/engine/module1Engine';

interface Module1State {
  params: BrakingParams;
  results: ReturnType<typeof solveBraking> | null;
  updateParams: (newParams: Partial<BrakingParams>) => void;
  runSimulation: () => void;
}

export const useModule1Store = create<Module1State>((set, get) => ({
  params: { v0: 15, a: 2, h: 0.5 }, // Escenario Normal
  results: null,
  updateParams: (newParams) => set((state) => ({ params: { ...state.params, ...newParams } })),
  runSimulation: () => {
    const res = solveBraking(get().params);
    set({ results: res });
  },
}));