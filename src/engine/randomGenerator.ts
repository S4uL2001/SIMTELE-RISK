/**
 * Generador determinista mulberry32.
 * Justificación: reproducible bit a bit dada la semilla; no depende de Math.random.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ruido uniforme en [-amplitud, +amplitud]. */
export function uniformNoise(rng: () => number, amplitud: number): number {
  return (rng() * 2 - 1) * amplitud;
}