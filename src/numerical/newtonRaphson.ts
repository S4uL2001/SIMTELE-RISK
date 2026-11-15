import { RootResult, RootIteration } from '@/types/numerical';

export function newtonRaphson(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  tol: number = 1e-5,
  maxIter: number = 100
): RootResult {
  const iteraciones: RootIteration[] = [];
  let x = x0;
  let iter = 0;
  let convergio = false;

  while (iter < maxIter) {
    const fx = f(x);
    const dfx = df(x);

    iteraciones.push({
      iteracion: iter + 1,
      aproximacion: x,
      residual: fx,
    });

    if (Math.abs(fx) < tol) {
      convergio = true;
      break;
    }

    if (Math.abs(dfx) < 1e-14) {
      return {
        metodo: 'newton-raphson',
        raiz: x,
        convergio: false,
        iteraciones,
        tolerancia: tol,
        motivo: 'Derivada cercana a cero (posible raíz múltiple o estancamiento).',
      };
    }

    x = x - fx / dfx;
    iter++;
  }

  return {
    metodo: 'newton-raphson',
    raiz: x,
    convergio,
    iteraciones,
    tolerancia: tol,
    motivo: convergio ? undefined : 'Máximo de iteraciones alcanzado.',
  };
}