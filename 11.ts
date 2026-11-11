const X0 = 0;
const X_MIN = -0.5;
const X_MAX = 0.5;
const Y0 = 1;
// Десять шагов включают начальную точку x = 0 в равномерную сетку.
const N = 10;
const h = (X_MAX - X_MIN) / N;
const REFERENCE_SUBSTEPS = 100;

function f(x: number, y: number): number {
  return x * x + y * y;
}

// При q = 1: Δ(h) = y(x + h) - y(x) - A0·φ0 - A1·φ1,
// φ0 = h·f(x, y), φ1 = h·f(x + α1·h, y + β10·φ0).
// Условия Δ'(0) = Δ''(0) = 0 дают A0 + A1 = 1,
// A1·α1 = 1/2 и A1·β10 = 1/2. Порядок метода — второй.

// Усовершенствованный метод Эйлера (метод средней точки, A0 = 0)
function improvedEuler(x0: number, y0: number, h: number, n: number): number[] {
  const values = [y0];
  let y = y0;

  for (let i = 0; i < n; i++) {
    const x = x0 + i * h;
    const k1 = f(x, y);
    const k2 = f(x + h / 2, y + h * k1 / 2);
    y += h * k2;
    values.push(y);
  }

  return values;
}

// Метод Эйлера-Коши (A0 = 0.5)
function eulerCauchy(x0: number, y0: number, h: number, n: number): number[] {
  const values = [y0];
  let y = y0;

  for (let i = 0; i < n; i++) {
    const x = x0 + i * h;
    const k1 = f(x, y);
    const k2 = f(x + h, y + h * k1);
    y += (h / 2) * (k1 + k2);
    values.push(y);
  }

  return values;
}

// Решение Рунге — Кутты четвёртого порядка с мелким шагом для сравнения.
function referenceSolve(x0: number, y0: number, h: number, n: number): number[] {
  const values = [y0];
  const step = h / REFERENCE_SUBSTEPS;
  let y = y0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < REFERENCE_SUBSTEPS; j++) {
      const x = x0 + i * h + j * step;
      const k1 = f(x, y);
      const k2 = f(x + step / 2, y + step * k1 / 2);
      const k3 = f(x + step / 2, y + step * k2 / 2);
      const k4 = f(x + step, y + step * k3);
      y += (step / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    }
    values.push(y);
  }
  return values;
}

// Начальное условие задано в середине: считаем в обе стороны от нуля.
function solveInterval(solve: (x0: number, y0: number, h: number, n: number) => number[]): number[] {
  const leftSteps = Math.round((X0 - X_MIN) / h);
  const rightSteps = N - leftSteps;
  const left = solve(X0, Y0, -h, leftSteps).reverse();
  const right = solve(X0, Y0, h, rightSteps);
  return [...left, ...right.slice(1)];
}

// Кубическая интерполяция Эрмита: значения и производные в концах участка.
function midpointResidual(x: number, yLeft: number, yRight: number, h: number): number {
  const leftSlope = f(x, yLeft);
  const rightSlope = f(x + h, yRight);
  const midpointY = (yLeft + yRight) / 2 + (h / 8) * (leftSlope - rightSlope);
  const midpointSlope = (3 * (yRight - yLeft)) / (2 * h) - (leftSlope + rightSlope) / 4;
  return midpointSlope - f(x + h / 2, midpointY);
}

const improvedValues = solveInterval(improvedEuler);
const cauchyValues = solveInterval(eulerCauchy);
const referenceValues = solveInterval(referenceSolve);

console.log("Задача Коши: y' = x² + y², y(0) = 1");
console.log(`Отрезок [${X_MIN}, ${X_MAX}], шаг h = ${h.toFixed(4)}, число шагов N = ${N}`);
console.log("\nСравнение методов:");
console.log("n\tx\tЭйлер (середина)\tЭйлер-Коши\tРазличие\tОриентир\tОшибка середины\tОшибка Коши");
for (let i = 0; i <= N; i++) {
  const difference = Math.abs(improvedValues[i] - cauchyValues[i]);
  const improvedError = Math.abs(improvedValues[i] - referenceValues[i]);
  const cauchyError = Math.abs(cauchyValues[i] - referenceValues[i]);
  console.log(`${i}\t${(X_MIN + i * h).toFixed(4)}\t${improvedValues[i].toFixed(4)}\t\t\t${cauchyValues[i].toFixed(4)}\t\t${difference.toFixed(4)}\t\t${referenceValues[i].toFixed(4)}\t\t${improvedError.toFixed(4)}\t\t${cauchyError.toFixed(4)}`);
}

console.log("\nОриентир вычислен методом Рунге — Кутты 4-го порядка с шагом 0.001.");
console.log("Ошибки — разности с ориентиром.");

console.log("\nНевязка r(x) = ỹ'(x) - (x² + ỹ(x)²) в серединах участков:");
console.log("x\tЭйлер (середина)\tЭйлер-Коши");
for (let i = 0; i < N; i++) {
  const x = X_MIN + i * h;
  const improvedResidual = midpointResidual(x, improvedValues[i], improvedValues[i + 1], h);
  const cauchyResidual = midpointResidual(x, cauchyValues[i], cauchyValues[i + 1], h);
  console.log(`${(x + h / 2).toFixed(4)}\t${improvedResidual.toFixed(6)}\t\t${cauchyResidual.toFixed(6)}`);
}
console.log("Невязка рассчитана по кубической интерполяции между узлами.");

