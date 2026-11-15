import type { AnemometroParams, CelulaCargaParams } from '@/types/sensor';

export function velocidadViento(t: number, p: AnemometroParams): number {
  return p.vMedia + p.amplitud * Math.sin(p.frecuenciaAngular * t);
}

export function tensionCable(t: number, p: CelulaCargaParams): number {
  return (
    p.tMedia +
    p.amplitudSeno * Math.sin(p.frecuenciaAngular * t - p.desfase) +
    p.amplitudExponencial * Math.exp(-p.amortiguamiento * t)
  );
}

/** Derivadas analíticas — necesarias para Newton-Raphson en auditoría de umbrales. */
export function dVelocidadViento(t: number, p: AnemometroParams): number {
  return p.amplitud * p.frecuenciaAngular * Math.cos(p.frecuenciaAngular * t);
}

export function dTensionCable(t: number, p: CelulaCargaParams): number {
  return (
    p.amplitudSeno * p.frecuenciaAngular * Math.cos(p.frecuenciaAngular * t - p.desfase) -
    p.amortiguamiento * p.amplitudExponencial * Math.exp(-p.amortiguamiento * t)
  );
}