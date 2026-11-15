import { describe, expect, it } from 'vitest';
import { createRng, uniformNoise } from '@/engine/randomGenerator';

describe('randomGenerator (mulberry32)', () => {
  it('es determinista para la misma semilla', () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 1000; i++) {
      expect(a()).toBe(b());
    }
  });

  it('produce valores en [0, 1)', () => {
    const rng = createRng(123);
    for (let i = 0; i < 1000; i++) {
      const x = rng();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('ruido uniforme queda en [-a, a]', () => {
    const rng = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const n = uniformNoise(rng, 0.5);
      expect(n).toBeGreaterThanOrEqual(-0.5);
      expect(n).toBeLessThanOrEqual(0.5);
    }
  });
});