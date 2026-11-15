import { RootResult, RootIteration } from '@/types/numerical';

export function secante(
  f: (x: number) => number,
  x0: number,
  x1: number,
  tol: number = 1e-5,
  maxIter: number = 100
): RootResult {
  const iteraciones: RootIteration[] = [];
  let iter = 0;
  let convergio = false;

  let xPrev = x0;
  let xCurr = x1;
  let fPrev = f(xPrev);
  let fCurr = f(xCurr);

  while (iter < maxIter) {
    iteraciones.push({
      iteracion: iter + 1,
      aproximacion: xCurr,
      residual: fCurr,
    });

    if (Math.abs(fCurr) < tol) {
      convergio = true;
      break;
    }

    const denominador = fCurr - fPrev;
    if (Math.abs(denominador) < 1e-14) {
      return {
        metodo: 'secante',
        raiz: xCurr,
        convergio: false,
        iteraciones,
        tolerancia: tol,
        motivo: 'División por cero en la fórmula de la secante.',
      };
    }

    const xNext = xCurr - (fCurr * (xCurr - xPrev)) / denominador;
    
    xPrev = xCurr;
    fPrev = fCurr;
    xCurr = xNext;
    fCurr = f(xCurr);
    
    iter++;
  }

  return {
    metodo: 'secante',
    raiz: xCurr,
    convergio,
    iteraciones,
    tolerancia: tol,
    motivo: convergio ? undefined : 'Máximo de iteraciones alcanzado.',
  };
}