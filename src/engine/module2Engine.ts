import { biseccion } from '@/numerical/bisection';
import { newtonRaphson } from '@/numerical/newtonRaphson';
import { secante } from '@/numerical/secant';
import { jacobi, gaussSeidel, luDecomposition, gradienteConjugado } from '@/numerical/linearSystems';

export interface DeteriorationParams {
  d0: number;     // Deterioro inicial
  alpha: number;  // Tasa lineal
  beta: number;   // Tasa cuadrática
  umbral: number; // Límite crítico
}

export function solveDeterioration(p: DeteriorationParams) {
  // Ecuación: D(t) = d0 + alpha*t + beta*t^2 - umbral = 0
  const f = (t: number) => p.d0 + p.alpha * t + p.beta * t * t - p.umbral;
  const df = (t: number) => p.alpha + 2 * p.beta * t;

  // 1. Raíces (Buscando el tiempo de fallo)
  // Estimamos un intervalo de búsqueda de 0 a 50 años
  const rootBis = biseccion(f, 0, 50, 1e-4);
  const rootNewt = newtonRaphson(f, df, 10, 1e-4); // Semilla en t=10
  const rootSec = secante(f, 0, 20, 1e-4);

  // 2. Sistema Lineal para Calibración de Sensores (Matriz SPD 4x4)
  // A * x = b. Conocemos x* = [1, 2, 3, 4]
  const A = [
    [ 4, -1,  0,  0],
    [-1,  4, -1,  0],
    [ 0, -1,  4, -1],
    [ 0,  0, -1,  3]
  ];
  const b = [2, 4, 6, 5]; // 4(1)-1(2)=2; -1(1)+4(2)-1(3)=4; -1(2)+4(3)-1(4)=6; -1(3)+3(4)=5
  
  const sysJacobi = jacobi(A, b, 1e-5);
  const sysGS = gaussSeidel(A, b, 1e-5);
  const sysLU = luDecomposition(A, b);
  const sysCG = gradienteConjugado(A, b, 1e-5);

  // Generar datos para la gráfica de deterioro (0 a t_fallo + 5)
  const tMax = (rootNewt.raiz || 30) + 5;
  const historyT = [];
  const historyD = [];
  for (let t = 0; t <= tMax; t += tMax / 50) {
    historyT.push(t);
    historyD.push(p.d0 + p.alpha * t + p.beta * t * t);
  }

  return {
    roots: { bis: rootBis, newt: rootNewt, sec: rootSec },
    linearSystems: { jacobi: sysJacobi, gs: sysGS, lu: sysLU, cg: sysCG },
    history: { t: historyT, d: historyD }
  };
}