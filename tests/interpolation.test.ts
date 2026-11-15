import { describe, expect, it } from 'vitest';
import { interpolarLagrange, Node } from '@/numerical/lagrange';
import { interpolarNewton } from '@/numerical/newtonInterpolation';
import { interpolarSpline } from '@/numerical/cubicSpline';

// Datos de prueba extraídos del documento (Anemómetro)
const nodosViento: Node[] = [
  { t: 1, y: 16 },
  { t: 3, y: 18 },
  { t: 5, y: 12 },
];

// Datos de tensión del documento para Splines
const nodosTension: Node[] = [
  { t: 0, y: 450 },
  { t: 1, y: 465 },
  { t: 2, y: 460 },
  { t: 3, y: 455 },
];

describe('Métodos de Interpolación', () => {
  it('Lagrange debe reconstruir t=2 con v=18 (Documento)', () => {
    const res = interpolarLagrange(nodosViento, [2]);
    expect(res.valores[0]).toBeCloseTo(18, 4);
  });

  it('Newton debe producir el mismo resultado que Lagrange', () => {
    const res = interpolarNewton(nodosViento, [2]);
    expect(res.valores[0]).toBeCloseTo(18, 4);
  });

  it('Spline Cúbico debe interpolar exactamente en los nodos', () => {
    const res = interpolarSpline(nodosTension, [0, 1, 2, 3]);
    expect(res.valores[0]).toBeCloseTo(450, 4);
    expect(res.valores[1]).toBeCloseTo(465, 4);
    expect(res.valores[2]).toBeCloseTo(460, 4);
    expect(res.valores[3]).toBeCloseTo(455, 4);
  });

  it('Spline Cúbico debe reconstruir t=1.5 con T=464.0 (Documento)', () => {
    const res = interpolarSpline(nodosTension, [1.5]);
    // El documento calcula manualmente 464.0 kN
    expect(res.valores[0]).toBeCloseTo(464.0, 1);
  });
});