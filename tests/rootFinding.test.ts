import { describe, expect, it } from 'vitest';
import { biseccion } from '@/numerical/bisection';
import { newtonRaphson } from '@/numerical/newtonRaphson';
import { secante } from '@/numerical/secant';

const f = (t: number) => -Math.pow(t, 2) + 5 * t - 5;
const df = (t: number) => -2 * t + 5;
const raizReal = (5 - Math.sqrt(5)) / 2; // ~1.381966

describe('Búsqueda de Raíces (Auditoría de Umbrales)', () => {
  it('Bisección converge a la raíz en [1, 2]', () => {
    const res = biseccion(f, 1, 2, 1e-4);
    expect(res.convergio).toBe(true);
    expect(res.raiz).toBeCloseTo(raizReal, 3); // Precisión 1e-4
  });

  it('Newton-Raphson converge rápidamente desde t=1', () => {
    const res = newtonRaphson(f, df, 1, 1e-5);
    expect(res.convergio).toBe(true);
    expect(res.raiz).toBeCloseTo(raizReal, 4);
    expect(res.iteraciones.length).toBeLessThan(5); // Convergencia cuadrática
  });

  it('Secante converge usando semillas t0=1, t1=1.5', () => {
    const res = secante(f, 1, 1.5, 1e-5);
    expect(res.convergio).toBe(true);
    expect(res.raiz).toBeCloseTo(raizReal, 4);
  });
});