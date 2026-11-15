import type { ErrorMetrics } from '@/types/numerical';

export function errorAbsoluto(yReal: number, yEst: number): number {
  return Math.abs(yReal - yEst);
}

/** Devuelve null si |yReal| = 0 (error relativo no definido). */
export function errorRelativo(yReal: number, yEst: number): number | null {
  if (yReal === 0) return null;
  return Math.abs(yReal - yEst) / Math.abs(yReal);
}

export function errorPorcentual(yReal: number, yEst: number): number | null {
  const er = errorRelativo(yReal, yEst);
  return er === null ? null : er * 100;
}

export function errorMetrics(yReal: number, yEst: number): ErrorMetrics {
  return {
    errorAbsoluto: errorAbsoluto(yReal, yEst),
    errorRelativo: errorRelativo(yReal, yEst),
    errorPorcentual: errorPorcentual(yReal, yEst),
  };
}

export function mean(values: number[]): number {
  if (values.length === 0) return NaN;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function maxAbs(values: number[]): number {
  return values.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
}