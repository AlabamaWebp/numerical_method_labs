// Вариант 4: 8x^3 - 0.7x - 0.5 = 0

function f(x: number): number {
  return 8 * x ** 3 - 0.7 * x - 0.5;
}

// Метод половинного деления
function bisection(a: number, b: number, steps: number): [number, number] {
  for (let i = 1; i <= steps; i++) {
    const mid = (a + b) / 2;

    console.log(`Половинное деление ${i}:`);
    console.log(`a = ${a}, b = ${b}, mid = ${mid}, f(mid) = ${f(mid)}`);

    if (f(a) * f(mid) < 0) {
      b = mid;
    } else {
      a = mid;
    }
  }

  return [a, b];
}

// Метод секущих
function secant(xPrev: number, xCurr: number, steps: number): number {
  for (let i = 1; i <= steps; i++) {
    const xNext =
      (xPrev * f(xCurr) - xCurr * f(xPrev)) /
      (f(xCurr) - f(xPrev));

    console.log(`Секущая ${i}:`);
    console.log(`x = ${xNext}, f(x) = ${f(xNext)}`);

    xPrev = xCurr;
    xCurr = xNext;
  }

  return xCurr;
}

// Начальный интервал: [0.4; 0.5]
// f(0.4) < 0, f(0.5) > 0, значит корень внутри
const a0 = 0.4;
const b0 = 0.5;

console.log(`f(0.4) = ${f(a0)}`);
console.log(`f(0.5) = ${f(b0)}`);

const [a, b] = bisection(a0, b0, 2);

console.log(`После 2 итераций половинного деления: [${a}; ${b}]`);

const root = secant(a, b, 3);

console.log(`Приближенный корень: x = ${root}`);
console.log(`Проверка: f(x) = ${f(root)}`);