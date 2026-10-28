const A = [
  [-2, 2, 3],
  [2, -2, 5],
  [-3, 0, -2],
];

const b = [2, 1, 1];
const x0 = [0, 0.01, 0.1];
const EPS = 1e-12;
const IMPROVEMENT_TOLERANCE = 0.01;
const MAX_ITERATIONS = 10_000;

function multiplyMatrixVector(A: number[][], x: number[]): number[] {
  return A.map((row) => row.reduce((sum, value, i) => sum + value * x[i], 0));
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function printVector(name: string, vector: number[]): void {
  console.log(`${name}: [${vector.map((value) => value.toFixed(4)).join(", ")}]`);
}

// Метод наискорейшего градиентного спуска для F(x) = ||Ax - b||² / 2
function gradientDescent(A: number[][], b: number[], x0: number[]): number[] {
  const transpose = A[0].map((_, i) => A.map((row) => row[i]));
  let x = [...x0];

  for (let iter = 1; iter <= MAX_ITERATIONS; iter++) {
    const residual = multiplyMatrixVector(A, x).map((value, i) => value - b[i]);
    const residualNorm = Math.hypot(...residual);
    const gradient = multiplyMatrixVector(transpose, residual);
    const squaredGradient = dotProduct(gradient, gradient);
    const AGradient = multiplyMatrixVector(A, gradient);
    const denominator = dotProduct(AGradient, AGradient);

    if (squaredGradient === 0) {
      console.log("Остановка: градиент равен нулю.");
      return x;
    }
    if (denominator === 0) {
      throw new Error("Невозможно вычислить шаг градиентного спуска");
    }

    const step = squaredGradient / denominator;
    const nextX = x.map((value, i) => value - step * gradient[i]);
    const nextResidual = multiplyMatrixVector(A, nextX).map((value, i) => value - b[i]);
    const nextResidualNorm = Math.hypot(...nextResidual);
    const improvement = residualNorm - nextResidualNorm;

    if (!Number.isFinite(nextResidualNorm)) {
      throw new Error("Получена неконечная норма невязки");
    }
    // Сохраняем лучшее приближение, в том числе при погрешностях округления.
    if (nextResidualNorm <= residualNorm) {
      x = nextX;
    }

    console.log(`Итерация ${iter}:`);
    console.log(`Шаг = ${step.toFixed(4)}`);
    printVector("x", x);
    console.log(`Норма невязки = ${nextResidualNorm.toFixed(4)}`);
    console.log(`Уменьшение невязки = ${improvement.toFixed(4)}`);

    if (improvement <= IMPROVEMENT_TOLERANCE * Math.max(1, residualNorm)) {
      console.log("Остановка: точность перестала значимо улучшаться.");
      return x;
    }
  }

  throw new Error(`Не удалось достичь стабилизации за ${MAX_ITERATIONS} итераций`);
}

// Метод Гаусса с выбором главного элемента
function gaussianSolve(A: number[][], b: number[]): number[] {
  const n = A.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let k = 0; k < n; k++) {
    let maxRow = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) {
        maxRow = i;
      }
    }
    [M[k], M[maxRow]] = [M[maxRow], M[k]];

    if (Math.abs(M[k][k]) < EPS) {
      throw new Error("Система не имеет единственного решения");
    }

    for (let i = k + 1; i < n; i++) {
      const factor = M[i][k] / M[k][k];
      for (let j = k; j <= n; j++) {
        M[i][j] -= factor * M[k][j];
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = sum / M[i][i];
  }
  return x;
}

console.log("Метод наискорейшего градиентного спуска:");
const xGradient = gradientDescent(A, b, x0);
const xExact = gaussianSolve(A, b);

console.log("\nСравнение решений:");
printVector("Приближённое решение", xGradient);
printVector("Точное решение", xExact);
printVector("Разность", xGradient.map((value, i) => value - xExact[i]));
const residual = multiplyMatrixVector(A, xGradient).map((value, i) => value - b[i]);
console.log(`Норма невязки: ${Math.hypot(...residual).toFixed(4)}`);
