export function trapecio(f: (x: number) => number, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let suma = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    suma += 2 * f(a + i * h);
  }
  return (h / 2) * suma;
}

export function simpson13(f: (x: number) => number, a: number, b: number, n: number): number {
  if (n % 2 !== 0) n++; // Simpson requiere un número par de intervalos
  const h = (b - a) / n;
  let suma = f(a) + f(b);
  for (let i = 1; i < n; i++) {
    suma += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  }
  return (h / 3) * suma;
}

export function romberg(f: (x: number) => number, a: number, b: number, maxIter: number = 5): number {
  const R: number[][] = Array.from({ length: maxIter }, () => []);
  for (let i = 0; i < maxIter; i++) {
    R[i][0] = trapecio(f, a, b, Math.pow(2, i));
    for (let j = 1; j <= i; j++) {
      const factor = Math.pow(4, j);
      R[i][j] = R[i][j - 1] + (R[i][j - 1] - R[i - 1][j - 1]) / (factor - 1);
    }
  }
  return R[maxIter - 1][maxIter - 1];
}