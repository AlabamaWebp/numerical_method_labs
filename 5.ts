// Практическая работа 5
// Вариант 4: f(x) = x^4 + 1/x
// Отрезок [7, 8], N = 5

const a = 7;
const b = 8;
const N = 5;

function f(x: number): number {
  return Math.pow(x, 4) + 1 / x;
}

// Первая производная не нужна для расчётов
// function f1(x: number): number {
//   return 4 * Math.pow(x, 3) - 1 / Math.pow(x, 2);
// }

// Вторая производная для оценки погрешности трапеций
function f2(x: number): number {
  return 12 * Math.pow(x, 2) + 2 / Math.pow(x, 3);
}

// Четвёртая производная для оценки погрешности Симпсона
function f4(x: number): number {
  return 24 + 24 / Math.pow(x, 5);
}

// Первообразная:
// ∫(x^4 + 1/x) dx = x^5/5 + ln|x|
function F(x: number): number {
  return Math.pow(x, 5) / 5 + Math.log(Math.abs(x));
}

// Точное значение интеграла
function exactIntegral(a: number, b: number): number {
  return F(b) - F(a);
}

// Формула трапеций
function trapezoidalRule(a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;

  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += f(x);
  }

  return h * sum;
}

// Формула парабол / Симпсона
// Так как N = 5 нечётное, применяем составную формулу Симпсона
// на каждом из N отрезков с использованием середины отрезка
function simpsonRule(a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const x0 = a + i * h;
    const x1 = x0 + h;
    const mid = (x0 + x1) / 2;

    sum += (h / 6) * (f(x0) + 4 * f(mid) + f(x1));
  }

  return sum;
}

// Поиск максимума |f''(x)| на [a,b]
function maxAbsF2(a: number, b: number, steps = 10000): number {
  let max = 0;

  for (let i = 0; i <= steps; i++) {
    const x = a + ((b - a) * i) / steps;
    max = Math.max(max, Math.abs(f2(x)));
  }

  return max;
}

// Поиск максимума |f''''(x)| на [a,b]
function maxAbsF4(a: number, b: number, steps = 10000): number {
  let max = 0;

  for (let i = 0; i <= steps; i++) {
    const x = a + ((b - a) * i) / steps;
    max = Math.max(max, Math.abs(f4(x)));
  }

  return max;
}

// Оценка погрешности формулы трапеций
function trapezoidalErrorEstimate(a: number, b: number, n: number): number {
  const h = (b - a) / n;
  const M2 = maxAbsF2(a, b);

  return ((b - a) * h * h * M2) / 12;
}

// Оценка погрешности формулы Симпсона
function simpsonErrorEstimate(a: number, b: number, n: number): number {
  const h = (b - a) / n;
  const M4 = maxAbsF4(a, b);

  return ((b - a) * Math.pow(h, 4) * M4) / 2880;
}

const exact = exactIntegral(a, b);

const trapezoidal = trapezoidalRule(a, b, N);
const simpson = simpsonRule(a, b, N);

const trapezoidalRealError = Math.abs(exact - trapezoidal);
const simpsonRealError = Math.abs(exact - simpson);

const trapezoidalEstimatedError = trapezoidalErrorEstimate(a, b, N);
const simpsonEstimatedError = simpsonErrorEstimate(a, b, N);

console.log("Точное значение интеграла:", exact);

console.log("\nМетод трапеций:");
console.log("Приближённое значение:", trapezoidal);
console.log("Реальная погрешность:", trapezoidalRealError);
console.log("Оценка погрешности:", trapezoidalEstimatedError);

console.log("\nМетод парабол / Симпсона:");
console.log("Приближённое значение:", simpson);
console.log("Реальная погрешность:", simpsonRealError);
console.log("Оценка погрешности:", simpsonEstimatedError);

console.log("\nСравнение:");
console.log(
  "Метод трапеций:",
  trapezoidalRealError <= trapezoidalEstimatedError
    ? "реальная погрешность не превышает оценку"
    : "реальная погрешность превышает оценку"
);

console.log(
  "Метод Симпсона:",
  simpsonRealError <= simpsonEstimatedError
    ? "реальная погрешность не превышает оценку"
    : "реальная погрешность превышает оценку"
);