import { rk2, rk4 } from '@/numerical/ode';
import { trapecio, simpson13, romberg } from '@/numerical/integration';
import { biseccion } from '@/numerical/bisection';
import { newtonRaphson } from '@/numerical/newtonRaphson';
import { secante } from '@/numerical/secant';

export interface BrakingParams {
  v0: number; 
  a: number;  
  h: number;  
}

export function solveBraking(p: BrakingParams) {
  const tStopExact = p.v0 / p.a;
  const distExact = Math.pow(p.v0, 2) / (2 * p.a);

  // 1. EDO (RK2 y RK4) -> dx/dt = v, dv/dt = -a
  const f = (_t: number, y: number[]) => [y[1], -p.a];
  const y0 = [0, p.v0]; 
  
  const resRK2 = rk2(f, 0, y0, tStopExact, p.h);
  const resRK4 = rk4(f, 0, y0, tStopExact, p.h);

  // 2. Integración numérica de v(t) = v0 - a*t
  const vFunc = (t: number) => p.v0 - p.a * t;
  const n = Math.floor(tStopExact / p.h);
  
  const distTrap = trapecio(vFunc, 0, tStopExact, n > 1 ? n : 2);
  const distSimp = simpson13(vFunc, 0, tStopExact, n > 1 ? n : 2);
  const distRomb = romberg(vFunc, 0, tStopExact, 5);

  // 3. Raíces (v(t)=0)
  const vF = (t: number) => p.v0 - p.a * t;
  const dvF = () => -p.a;
  
  const rootBis = biseccion(vF, 0, tStopExact + 1, 1e-4);
  const rootNewt = newtonRaphson(vF, dvF, tStopExact / 2, 1e-4);
  const rootSec = secante(vF, 0, tStopExact + 1, 1e-4);

  return {
    exact: { tStop: tStopExact, dist: distExact },
    rk2: { dist: resRK2.y[resRK2.y.length - 1][0], data: resRK2 },
    rk4: { dist: resRK4.y[resRK4.y.length - 1][0], data: resRK4 },
    integration: { trap: distTrap, simp: distSimp, romb: distRomb },
    roots: { bis: rootBis, newt: rootNewt, sec: rootSec },
    history: { t: resRK4.t, x_rk2: resRK2.y.map(y => y[0]), x_rk4: resRK4.y.map(y => y[0]) }
  };
}