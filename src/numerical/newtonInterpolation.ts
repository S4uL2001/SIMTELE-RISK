import { ReconstructionResult } from '@/types/numerical';
import { Node } from './lagrange';

/**
 * Construye la tabla de diferencias divididas de Newton.
 */
export function tablaDiferenciasDivididas(nodos: Node[]): number[][] {
  const n = nodos.length;
  const tabla: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Primera columna son los valores de y
  for (let i = 0; i < n; i++) {
    tabla[i][0] = nodos[i].y;
  }

  // Llenamos la tabla
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      tabla[i][j] = (tabla[i + 1][j - 1] - tabla[i][j - 1]) / (nodos[i + j].t - nodos[i].t);
    }
  }

  return tabla;
}

/**
 * Evalúa el polinomio de Newton usando la tabla de diferencias divididas.
 */
export function evaluarNewton(nodos: Node[], tabla: number[][], x: number): number {
  let resultado = tabla[0][0];
  let producto = 1;

  for (let i = 1; i < nodos.length; i++) {
    producto *= (x - nodos[i - 1].t);
    resultado += tabla[0][i] * producto;
  }

  return resultado;
}

/**
 * Reconstruye instantes faltantes usando Newton.
 */
export function interpolarNewton(nodos: Node[], tiemposFaltantes: number[]): ReconstructionResult {
  const tabla = tablaDiferenciasDivididas(nodos);
  const valores = tiemposFaltantes.map((t) => evaluarNewton(nodos, tabla, t));

  return {
    tiempos: tiemposFaltantes,
    valores,
    nodosUsados: nodos,
    grado: nodos.length - 1,
    detalle: { metodo: 'Newton', tabla },
  };
}