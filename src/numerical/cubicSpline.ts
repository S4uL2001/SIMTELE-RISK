import { ReconstructionResult } from '@/types/numerical';
import { Node } from './lagrange';

export interface SplineCoeficientes {
  a: number;
  b: number;
  c: number;
  d: number;
  x: number;
}

/**
 * Calcula los coeficientes de los splines cúbicos naturales.
 */
export function calcularSplines(nodos: Node[]): SplineCoeficientes[] {
  const n = nodos.length;
  if (n < 3) throw new Error('Se necesitan al menos 3 nodos para Splines Cúbicos.');

  const h: number[] = [];
  const alpha: number[] = new Array(n).fill(0);
  
  for (let i = 0; i < n - 1; i++) {
    h[i] = nodos[i + 1].t - nodos[i].t;
  }

  for (let i = 1; i < n - 1; i++) {
    alpha[i] = (3 / h[i]) * (nodos[i + 1].y - nodos[i].y) - (3 / h[i - 1]) * (nodos[i].y - nodos[i - 1].y);
  }

  const l: number[] = new Array(n).fill(0);
  const mu: number[] = new Array(n).fill(0);
  const z: number[] = new Array(n).fill(0);

  l[0] = 1;
  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (nodos[i + 1].t - nodos[i - 1].t) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n - 1] = 1;
  const c: number[] = new Array(n).fill(0);
  const b: number[] = new Array(n).fill(0);
  const d: number[] = new Array(n).fill(0);

  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] = (nodos[j + 1].y - nodos[j].y) / h[j] - (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  const coefs: SplineCoeficientes[] = [];
  for (let i = 0; i < n - 1; i++) {
    coefs.push({ a: nodos[i].y, b: b[i], c: c[i], d: d[i], x: nodos[i].t });
  }
  return coefs;
}

/**
 * Evalúa el valor de un spline en un punto x.
 */
export function evaluarSpline(coefs: SplineCoeficientes[], x: number): number {
  let i = 0;
  // Encontrar el intervalo correcto
  while (i < coefs.length - 1 && x > coefs[i + 1].x) {
    i++;
  }
  const dx = x - coefs[i].x;
  return coefs[i].a + coefs[i].b * dx + coefs[i].c * dx * dx + coefs[i].d * dx * dx * dx;
}

/**
 * Reconstruye instantes faltantes usando Splines.
 */
export function interpolarSpline(nodos: Node[], tiemposFaltantes: number[]): ReconstructionResult {
  const coefs = calcularSplines(nodos);
  const valores = tiemposFaltantes.map((t) => evaluarSpline(coefs, t));

  return {
    tiempos: tiemposFaltantes,
    valores,
    nodosUsados: nodos,
    grado: 'spline',
    detalle: { metodo: 'Spline Cúbico', coeficientes: coefs },
  };
}