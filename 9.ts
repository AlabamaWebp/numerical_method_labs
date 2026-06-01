const EPS = 1e-12;
function printVector(name: string, vector: number[]): void {
  console.log(
    `${name}:`,
    vector.map((value) => Number(value.toFixed(4))),
  );
}
function gaussSeidel(
  A: number[][],
  b: number[],
  x0: number[],
  iterations: number = 5,
): number[] {
  const n = A.length;
  const x = [...x0];

  for (let iter = 1; iter <= iterations; iter++) {
    const previousX = [...x];

    for (let i = 0; i < n; i++) {
      let sum = b[i];

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum -= A[i][j] * x[j];
        }
      }

      if (Math.abs(A[i][i]) < EPS) {
        throw new Error(
          "На диагонали есть нулевой элемент, метод Зейделя невозможен",
        );
      }

      x[i] = sum / A[i][i];
    }

    console.log(
      `Итерация ${iter}:`,
      x.map((value) => Number(value.toFixed(4))),
    );

    const diff = Math.max(
      ...x.map((value, i) => Math.abs(value - previousX[i])),
    );

    if (diff < EPS) {
      break;
    }
  }

  return x;
}

// 3
// 1
// 2

const ASeidel = [
  [-3, 0, -2],
  [-2, 2, 3],
  [2, -2, 5],
];

const bSeidel = [1, 2, 1];

// Начальное приближение из варианта 4
const x0 = [0, 0.01, 0.1];

console.log("\nМетод Зейделя:");
const xSeidel = gaussSeidel(ASeidel, bSeidel, x0, 20);

console.log("\nРешение методом Зейделя:");
printVector("x", xSeidel);