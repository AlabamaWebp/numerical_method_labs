const A = [
  [-2, 2, 3],
  [2, -2, 5],
  [-3, 0, -2],
];

const b = [2, 1, 1];

const EPS = 1e-12;

// Метод Гаусса

function gaussianSolve(A: number[][], b: number[]): number[] {
  const n = A.length;

  // Расширенная матрица [A | b]
  const M = A.map((row, i) => [...row, b[i]]);

  // Прямой ход
  for (let k = 0; k < n; k++) {
    // Поиск строки с максимальным главным элементом
    let maxRow = k;

    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) {
        maxRow = i;
      }
    }

    // Меняем строки местами
    [M[k], M[maxRow]] = [M[maxRow], M[k]];

    if (Math.abs(M[k][k]) < EPS) {
      throw new Error("Система не имеет единственного решения");
    }

    // Зануляем элементы ниже главного
    for (let i = k + 1; i < n; i++) {
      const factor = M[i][k] / M[k][k];

      for (let j = k; j <= n; j++) {
        M[i][j] -= factor * M[k][j];
      }
    }
  }

  // Обратный ход
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

// LU-разложение с перестановкой строк
// PA = LU

function luDecompositionWithPivoting(A: number[][]): {
  P: number[][];
  L: number[][];
  U: number[][];
} {
  const n = A.length;

  const U = A.map(row => [...row]);

  const L = Array.from({ length: n }, () => Array(n).fill(0));

  const P = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
  }

  for (let k = 0; k < n; k++) {
    // Ищем строку с максимальным элементом в текущем столбце
    let maxRow = k;

    for (let i = k + 1; i < n; i++) {
      if (Math.abs(U[i][k]) > Math.abs(U[maxRow][k])) {
        maxRow = i;
      }
    }

    if (Math.abs(U[maxRow][k]) < EPS) {
      throw new Error("Матрица вырождена, LU-разложение невозможно");
    }

    // Меняем строки в U и P
    if (maxRow !== k) {
      [U[k], U[maxRow]] = [U[maxRow], U[k]];
      [P[k], P[maxRow]] = [P[maxRow], P[k]];

      // В L меняем только уже заполненную часть
      for (let j = 0; j < k; j++) {
        [L[k][j], L[maxRow][j]] = [L[maxRow][j], L[k][j]];
      }
    }

    // Зануляем элементы ниже диагонали
    for (let i = k + 1; i < n; i++) {
      const factor = U[i][k] / U[k][k];
      L[i][k] = factor;

      for (let j = k; j < n; j++) {
        U[i][j] -= factor * U[k][j];
      }
    }
  }

  return { P, L, U };
}

// Вспомогательные функции

function multiplyMatrixVector(A: number[][], v: number[]): number[] {
  return A.map(row =>
    row.reduce((sum, value, i) => sum + value * v[i], 0)
  );
}

function forwardSubstitution(L: number[][], b: number[]): number[] {
  const n = L.length;
  const y = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    let sum = b[i];

    for (let j = 0; j < i; j++) {
      sum -= L[i][j] * y[j];
    }

    y[i] = sum / L[i][i];
  }

  return y;
}

function backSubstitution(U: number[][], y: number[]): number[] {
  const n = U.length;
  const x = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    let sum = y[i];

    for (let j = i + 1; j < n; j++) {
      sum -= U[i][j] * x[j];
    }

    x[i] = sum / U[i][i];
  }

  return x;
}

function printMatrix(name: string, matrix: number[][]): void {
  console.log(`${name}:`);

  for (const row of matrix) {
    console.log(row.map(value => Number(value.toFixed(6))));
  }
}

function printVector(name: string, vector: number[]): void {
  console.log(`${name}:`, vector.map(value => Number(value.toFixed(6))));
}

// Запуск решения

console.log("Исходная матрица A:");
printMatrix("A", A);

console.log("Исходный вектор b:");
printVector("b", b);

// Решение методом Гаусса
const xGauss = gaussianSolve(A, b);

console.log("\nРешение методом Гаусса:");
printVector("x", xGauss);

// Решение через LU
const { P, L, U } = luDecompositionWithPivoting(A);

const Pb = multiplyMatrixVector(P, b);
const y = forwardSubstitution(L, Pb);
const xLU = backSubstitution(U, y);

console.log("\nLU-разложение с перестановкой строк:");
printMatrix("P", P);
printMatrix("L", L);
printMatrix("U", U);

console.log("\nПромежуточные вычисления:");
printVector("Pb", Pb);
printVector("y", y);

console.log("\nРешение через LU:");
printVector("x", xLU);

// Сравнение
console.log("\nСравнение решений:");
console.log("Метод Гаусса:", xGauss);
console.log("LU-разложение:", xLU);