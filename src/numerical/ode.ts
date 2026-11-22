export interface OdeResult {
  t: number[];
  y: number[][]; // Arreglo de arreglos [x, v]
}

// Runge-Kutta 2do Orden (Método de Heun)
export function rk2(
  f: (t: number, y: number[]) => number[],
  t0: number,
  y0: number[],
  tf: number,
  h: number
): OdeResult {
  const t: number[] = [t0];
  const y: number[][] = [[...y0]];
  let currT = t0;
  let currY = [...y0];

  while (currT < tf - 1e-9) {
    const k1 = f(currT, currY);
    const yPredict = currY.map((val, i) => val + h * k1[i]);
    const k2 = f(currT + h, yPredict);
    
    const nextY = currY.map((val, i) => val + (h / 2) * (k1[i] + k2[i]));
    currT += h;
    currY = nextY;
    
    t.push(currT);
    y.push([...currY]);
  }
  return { t, y };
}

// Runge-Kutta 4to Orden
export function rk4(
  f: (t: number, y: number[]) => number[],
  t0: number,
  y0: number[],
  tf: number,
  h: number
): OdeResult {
  const t: number[] = [t0];
  const y: number[][] = [[...y0]];
  let currT = t0;
  let currY = [...y0];

  while (currT < tf - 1e-9) {
    const k1 = f(currT, currY);
    const k2 = f(currT + h / 2, currY.map((val, i) => val + (h / 2) * k1[i]));
    const k3 = f(currT + h / 2, currY.map((val, i) => val + (h / 2) * k2[i]));
    const k4 = f(currT + h, currY.map((val, i) => val + h * k3[i]));

    const nextY = currY.map((val, i) => 
      val + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])
    );
    
    currT += h;
    currY = nextY;
    
    t.push(currT);
    y.push([...currY]);
  }
  return { t, y };
}