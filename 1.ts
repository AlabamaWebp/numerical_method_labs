// вариант 4
// 4.   f(x)=2+4/(x3-1.5)   x0=2, x1=2.7, x2=5, x3=3, x=4

export function fx(x: number): number {
  return Number((2 + 4 / (x * 3 - 1.5)).toFixed(4));
}

// четвертая производная функции f(x)
// f(x) = 2 + 4·(3x - 1.5)⁻¹
// f'(x) = -12·(3x - 1.5)⁻²
// f''(x) = 72·(3x - 1.5)⁻³
// f'''(x) = -648·(3x - 1.5)⁻⁴
// f''''(x) = 7776·(3x - 1.5)⁻⁵ = 7776 / (3x - 1.5)⁵
export function fx4(x: number): number {
  const denominator = Math.pow(3 * x - 1.5, 5);
  return 7776 / denominator;
}

// оценка погрешности интерполирования
export function errorEstimation(xNodes: number[], x: number): number {
  const n = xNodes.length;
  // вычисление ω_n(x) = ∏(x - x_i)
  let omega = 1;
  for (let i = 0; i < n; i++) {
    omega *= x - xNodes[i];
  }
  // находим интервал, содержащий все узлы и точку x
  const allPoints = [...xNodes, x];
  const minX = Math.min(...allPoints);
  const maxX = Math.max(...allPoints);
  // максимальное значение производной на интервале
  // f''''(x) = 7776 / (3x - 1.5)^5 - убывает при увеличении x
  const maxDerivative = fx4(minX);
  const factorial = 1 * 2 * 3 * 4; // (n+1)! = 4! = 24
  const errorBound = Math.abs((maxDerivative * omega) / factorial);
  return errorBound;
}

export function lagrangeInterpolation(
  xNodes: number[],
  yNodes: number[],
  x: number,
): number {
  const n = xNodes.length;
  if (yNodes.length !== n) {
    throw new Error("Количество узлов x и y должно совпадать");
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    let basisPolynomial = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        basisPolynomial *= (x - xNodes[j]) / (xNodes[i] - xNodes[j]);
      }
    }
    result += yNodes[i] * basisPolynomial;
  }
  return result;
}

const x: number[] = [2, 2.7, 5, 3];
const y: number[] = [];
for (let i = 0; i < 4; i++) {
  y.push(fx(x[i]));
}

const Pn = lagrangeInterpolation(x, y, 4);
const actualValue = fx(4);
const errorBound = errorEstimation(x, 4);

console.log(
  `
  x: ${x}
  y: ${y}
  Предсказание по Лагранжу: ${Pn.toFixed(4)}
  Посчитанное функцией: ${actualValue}
  Оценка погрешности: ${errorBound.toFixed(4)}`,
);
