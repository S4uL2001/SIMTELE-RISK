// Métodos iterativos para resolver Ax = b
export interface LinearSystemResult {
  x: number[];
  iteraciones: number;
  convergio: boolean;
  error: number;
}

// 1. Método de Jacobi
export function jacobi(A: number[][], b: number[], tol: number = 1e-5, maxIter: number = 100): LinearSystemResult {
  const n = A.length;
  let x = new Array(n).fill(0);
  let xNew = new Array(n).fill(0);
  let iter = 0;
  let error = Infinity;

  while (iter < maxIter && error > tol) {
    for (let i = 0; i < n; i++) {
      let suma = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) suma += A[i][j] * x[j];
      }
      xNew[i] = (b[i] - suma) / A[i][i];
    }
    
    error = Math.max(...x.map((val, i) => Math.abs(val - xNew[i])));
    x = [...xNew];
    iter++;
  }
  return { x, iteraciones: iter, convergio: error <= tol, error };
}

// 2. Método de Gauss-Seidel
export function gaussSeidel(A: number[][], b: number[], tol: number = 1e-5, maxIter: number = 100): LinearSystemResult {
  const n = A.length;
  let x = new Array(n).fill(0);
  let iter = 0;
  let error = Infinity;

  while (iter < maxIter && error > tol) {
    const xOld = [...x];
    for (let i = 0; i < n; i++) {
      let suma = 0;
      for (let j = 0; j < n; j++) {
        if (i !== j) suma += A[i][j] * x[j]; // Usa los valores actualizados
      }
      x[i] = (b[i] - suma) / A[i][i];
    }
    error = Math.max(...x.map((val, i) => Math.abs(val - xOld[i])));
    iter++;
  }
  return { x, iteraciones: iter, convergio: error <= tol, error };
}

// 3. Factorización LU
export function luDecomposition(A: number[][], b: number[]): LinearSystemResult {
  const n = A.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  const U = Array.from({ length: n }, () => new Array(n).fill(0));

  // Descomposición
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
    for (let j = i; j < n; j++) {
      let suma = 0;
      for (let k = 0; k < i; k++) suma += L[i][k] * U[k][j];
      U[i][j] = A[i][j] - suma;
    }
    for (let j = i + 1; j < n; j++) {
      let suma = 0;
      for (let k = 0; k < i; k++) suma += L[j][k] * U[k][i];
      L[j][i] = (A[j][i] - suma) / U[i][i];
    }
  }

  // Sustitución hacia adelante (Ly = b)
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let suma = 0;
    for (let j = 0; j < i; j++) suma += L[i][j] * y[j];
    y[i] = b[i] - suma;
  }

  // Sustitución hacia atrás (Ux = y)
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let suma = 0;
    for (let j = i + 1; j < n; j++) suma += U[i][j] * x[j];
    x[i] = (y[i] - suma) / U[i][i];
  }

  return { x, iteraciones: 1, convergio: true, error: 0 };
}

// 4. Gradiente Conjugado (Requiere matriz SPD)
export function gradienteConjugado(A: number[][], b: number[], tol: number = 1e-5, maxIter: number = 100): LinearSystemResult {
  const n = A.length;
  let x = new Array(n).fill(0);
  let r = b.map((bi, i) => bi - A[i].reduce((sum, aij, j) => sum + aij * x[j], 0));
  let p = [...r];
  let rsold = r.reduce((sum, val) => sum + val * val, 0);
  let iter = 0;

  while (iter < maxIter && Math.sqrt(rsold) > tol) {
    const Ap = A.map(row => row.reduce((sum, aij, j) => sum + aij * p[j], 0));
    const alpha = rsold / p.reduce((sum, val, i) => sum + val * Ap[i], 0);

    x = x.map((xi, i) => xi + alpha * p[i]);
    r = r.map((ri, i) => ri - alpha * Ap[i]);
    
    const rsnew = r.reduce((sum, val) => sum + val * val, 0);
    const beta = rsnew / rsold;
    p = p.map((pi, i) => r[i] + beta * pi);
    
    rsold = rsnew;
    iter++;
  }

  return { x, iteraciones: iter, convergio: Math.sqrt(rsold) <= tol, error: Math.sqrt(rsold) };
}