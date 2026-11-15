import { ReconstructionResult } from '@/types/numerical';

export interface Node {
  t: number;
  y: number;
}

/**
 * Evalúa el polinomio de Lagrange en un punto x dado un conjunto de nodos.
 */
export function evaluarLagrange(nodos: Node[], x: number): number {
  let resultado = 0;
  const n = nodos.length;

  for (let i = 0; i < n; i++) {
    let termino = nodos[i].y;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        termino *= (x - nodos[j].t) / (nodos[i].t - nodos[j].t);
      }
    }
    resultado += termino;
  }

  return resultado;
}

/**
 * Reconstruye un conjunto de instantes faltantes usando interpolación de Lagrange.
 */
export function interpolarLagrange(nodos: Node[], tiemposFaltantes: number[]): ReconstructionResult {
  const valores = tiemposFaltantes.map((t) => evaluarLagrange(nodos, t));

  return {
    tiempos: tiemposFaltantes,
    valores,
    nodosUsados: nodos,
    grado: nodos.length - 1,
    detalle: { metodo: 'Lagrange', cantidadNodos: nodos.length },
  };
}