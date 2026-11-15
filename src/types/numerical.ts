export interface ReconstructionResult {
  /** Instantes pedidos (faltantes). */
  tiempos: number[];
  /** Valores reconstruidos en esos instantes. */
  valores: number[];
  /** Nodos efectivamente usados (t, y) — solo observados. */
  nodosUsados: Array<{ t: number; y: number }>;
  /** Grado del polinomio (o 'spline' para splines cúbicos). */
  grado: number | 'spline';
  /** Metadatos específicos del método (tabla de dif. divididas, coeficientes, etc.). */
  detalle: unknown;
}

export interface ErrorMetrics {
  /** |y_ref - y_est|. */
  errorAbsoluto: number;
  /** |y_ref - y_est| / |y_ref|, o null si |y_ref| = 0. */
  errorRelativo: number | null;
  /** Error relativo porcentual, o null si no está definido. */
  errorPorcentual: number | null;
}

export type ThresholdMethod = 'biseccion' | 'newton-raphson' | 'secante';

export interface RootIteration {
  iteracion: number;
  aproximacion: number;
  residual: number;
}

export interface RootResult {
  metodo: ThresholdMethod;
  raiz: number | null;
  convergio: boolean;
  iteraciones: RootIteration[];
  tolerancia: number;
  motivo?: string;
}