import { RootResult, RootIteration } from '@/types/numerical';

export function biseccion(
  f: (x: number) => number,
  a: number,
  b: number,
  tol: number = 1e-5,
  maxIter: number = 100
): RootResult {
  const iteraciones: RootIteration[] = [];
  let fa = f(a);
  let fb = f(b);

  if (fa * fb > 0) {
    return {
      metodo: 'biseccion',
      raiz: null,
      convergio: false,
      iteraciones: [],
      tolerancia: tol,
      motivo: 'El intervalo inicial no contiene una raíz (no hay cambio de signo).',
    };
  }

  let c = a;
  let fc = fa;
  let iter = 0;

  while (iter < maxIter && Math.abs(b - a) > tol) {
    c = (a + b) / 2;
    fc = f(c);
    iter++;

    iteraciones.push({
      iteracion: iter,
      aproximacion: c,
      residual: fc,
    });

    if (Math.abs(fc) < tol) break;

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  return {
    metodo: 'biseccion',
    raiz: c,
    convergio: true,
    iteraciones,
    tolerancia: tol,
  };
}