import { describe, expect, it } from 'vitest';
import { errorAbsoluto, errorMetrics, errorRelativo } from '@/numerical/errors';

describe('teoría de errores', () => {
  it('error absoluto del documento: v_real=17.9974, v_interp=17.2212 → 0.7762', () => {
    expect(errorAbsoluto(17.9974, 17.2212)).toBeCloseTo(0.7762, 4);
  });

  it('error relativo porcentual del documento ≈ 4.31%', () => {
    const er = errorRelativo(17.9974, 17.2212);
    expect(er).not.toBeNull();
    expect(er! * 100).toBeCloseTo(4.31, 1);
  });

  it('error relativo no definido cuando y_real = 0', () => {
    expect(errorRelativo(0, 1)).toBeNull();
    const m = errorMetrics(0, 1);
    expect(m.errorRelativo).toBeNull();
    expect(m.errorPorcentual).toBeNull();
    expect(m.errorAbsoluto).toBe(1);
  });
});