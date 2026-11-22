import { rk2, rk4 } from '@/numerical/ode';
import { trapecio, simpson13, romberg } from '@/numerical/integration';

export interface OscillationParams {
  m: number;      // Masa (kg)
  c: number;      // Amortiguamiento (Ns/m)
  k: number;      // Constante del resorte/cable (N/m)
  F0: number;     // Amplitud de la fuerza del viento (N)
  omega: number;  // Frecuencia de la ráfaga (rad/s)
  tMax: number;   // Tiempo total de simulación (s)
  h: number;      // Paso de integración (s)
}

export function solveOscillation(p: OscillationParams) {
  // Sistema de EDOs: y[0] = x (posición), y[1] = v (velocidad)
  // dx/dt = v
  // dv/dt = (F0*cos(omega*t) - c*v - k*x) / m
  const f = (t: number, y: number[]) => {
    const x = y[0];
    const v = y[1];
    const F = p.F0 * Math.cos(p.omega * t);
    const a = (F - p.c * v - p.k * x) / p.m;
    return [v, a];
  };

  const y0 = [0, 0]; // Inicia en reposo (x=0, v=0)

  // 1. Resolver EDOs
  const resRK2 = rk2(f, 0, y0, p.tMax, p.h);
  const resRK4 = rk4(f, 0, y0, p.tMax, p.h);

  // 2. Integración de |x(t)| para calcular la magnitud acumulada
  // Usamos los datos generados por RK4 para integrar
  const tArray = resRK4.t;
  const xArray = resRK4.y.map(y => Math.abs(y[0])); // Valor absoluto de la posición

  // Creamos una función interpolada simple para los métodos de integración
  const interpX = (t: number) => {
    const index = Math.min(Math.floor(t / p.h), xArray.length - 1);
    return xArray[index] || 0;
  };

  const n = Math.floor(p.tMax / p.h);
  
  const intTrap = trapecio(interpX, 0, p.tMax, n);
  const intSimp = simpson13(interpX, 0, p.tMax, n % 2 === 0 ? n : n + 1);
  const intRomb = romberg(interpX, 0, p.tMax, 5);

  // Encontrar amplitud máxima
  const maxX_RK2 = Math.max(...resRK2.y.map(y => Math.abs(y[0])));
  const maxX_RK4 = Math.max(...resRK4.y.map(y => Math.abs(y[0])));

  return {
    history: {
      t: resRK4.t,
      x_rk4: resRK4.y.map(y => y[0]),
      x_rk2: resRK2.y.map(y => y[0])
    },
    maxAmplitudes: { rk2: maxX_RK2, rk4: maxX_RK4 },
    integration: { trap: intTrap, simp: intSimp, romb: intRomb }
  };
}