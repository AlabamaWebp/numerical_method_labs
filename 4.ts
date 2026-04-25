// Практическая работа №4
// Тема: Численное дифференцирование
// Вариант: f(x) = x^4 + 1/x
// Узлы: 2, 2.5, 3, 3.5, 4 (равноотстоящие, h = 0.5)
// Точки для сравнения: x = 2.9 и x = 4.5

function f(x: number): number {
  // Исходная функция варианта: f(x) = x^4 + 1/x
  return x ** 4 + 1 / x;
}

function fPrimeExact(x: number): number {
  // Точная первая производная:
  // f'(x) = 4x^3 - 1/x^2
  return 4 * x ** 3 - 1 / x ** 2;
}

function fSecondExact(x: number): number {
  // Точная вторая производная:
  // f''(x) = 12x^2 + 2/x^3
  return 12 * x ** 2 + 2 / x ** 3;
}

function factorial(n: number): number {
  // Вспомогательная функция для k! в формулах Ньютона
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Таблица конечных разностей:
// table[0] = y, table[1] = Δy, table[2] = Δ²y, ...
function buildFiniteDifferenceTable(y: number[]): number[][] {
  const n = y.length;
  // Нулевая строка (нулевой порядок разностей) — сами значения функции y_i
  const table: number[][] = [y.slice()];

  for (let order = 1; order < n; order++) {
    // Каждая следующая строка: Δ^order y
    // Δ^k y_i = Δ^(k-1) y_(i+1) - Δ^(k-1) y_i
    const prev = table[order - 1];
    const current: number[] = [];
    for (let i = 0; i < n - order; i++) {
      current.push(prev[i + 1] - prev[i]);
    }
    table.push(current);
  }

  return table;
}

function format(value: number, digits = 6): string {
  // Единый формат вывода чисел в консоль
  return value.toFixed(digits);
}

function printFiniteDifferenceTable(xNodes: number[], table: number[][]): void {
  // Печать таблицы конечных разностей в читаемом виде
  const n = xNodes.length;
  const widths = [3, 8, 14, 14, 14, 14, 14];
  const cell = (text: string, width: number): string => text.padStart(width, " ");

  console.log("Таблица конечных разностей:");

  const header = [
    cell("i", widths[0]),
    cell("x_i", widths[1]),
    cell("y_i", widths[2]),
    cell("Δy_i", widths[3]),
    cell("Δ²y_i", widths[4]),
    cell("Δ³y_i", widths[5]),
    cell("Δ⁴y_i", widths[6]),
  ].join(" ");

  console.log(header);
  console.log("-".repeat(header.length));

  for (let i = 0; i < n; i++) {
    const row = [
      cell(String(i), widths[0]),
      cell(xNodes[i].toFixed(1), widths[1]),
      cell(table[0][i] !== undefined ? format(table[0][i], 6) : "", widths[2]),
      cell(table[1][i] !== undefined ? format(table[1][i], 6) : "", widths[3]),
      cell(table[2][i] !== undefined ? format(table[2][i], 6) : "", widths[4]),
      cell(table[3][i] !== undefined ? format(table[3][i], 6) : "", widths[5]),
      cell(table[4][i] !== undefined ? format(table[4][i], 6) : "", widths[6]),
    ].join(" ");

    console.log(row);
  }

  console.log();
}

// Полиномиальные множители в формуле Ньютона (вперёд)
function phi(k: number, q: number): number {
  // φ_k(q) = q(q-1)...(q-k+1)
  // (используется в первой формуле Ньютона)
  let result = 1;
  for (let j = 0; j < k; j++) result *= q - j;
  return result;
}

function phiPrime(k: number, q: number): number {
  // Первая производная φ'_k(q)
  // Вычисляется через сумму произведений
  // (правило производной произведения)
  let sum = 0;
  for (let m = 0; m < k; m++) {
    let product = 1;
    for (let j = 0; j < k; j++) {
      if (j !== m) product *= q - j;
    }
    sum += product;
  }
  return sum;
}

function phiSecond(k: number, q: number): number {
  // Вторая производная φ''_k(q)
  // Также через двойную сумму произведений
  let sum = 0;
  for (let m = 0; m < k; m++) {
    for (let r = 0; r < k; r++) {
      if (m === r) continue;

      let product = 1;
      for (let j = 0; j < k; j++) {
        if (j !== m && j !== r) product *= q - j;
      }
      sum += product;
    }
  }
  return sum;
}

// Полиномиальные множители в формуле Ньютона (назад):
// ψ_k(p) = p(p+1)...(p+k-1)
function psi(k: number, p: number): number {
  // ψ_k(p) для второй формулы Ньютона
  let result = 1;
  for (let j = 0; j < k; j++) result *= p + j;
  return result;
}

function psiPrime(k: number, p: number): number {
  // Первая производная ψ'_k(p)
  let sum = 0;
  for (let m = 0; m < k; m++) {
    let product = 1;
    for (let j = 0; j < k; j++) {
      if (j !== m) product *= p + j;
    }
    sum += product;
  }
  return sum;
}

function psiSecond(k: number, p: number): number {
  // Вторая производная ψ''_k(p)
  let sum = 0;
  for (let m = 0; m < k; m++) {
    for (let r = 0; r < k; r++) {
      if (m === r) continue;

      let product = 1;
      for (let j = 0; j < k; j++) {
        if (j !== m && j !== r) product *= p + j;
      }
      sum += product;
    }
  }
  return sum;
}

// Производные по первой формуле Ньютона (в начале таблицы)
function derivativeForward(
  x: number,
  x0: number,
  h: number,
  table: number[][],
): { first: number; second: number } {
  // q = (x - x0) / h — безразмерный аргумент для формулы Ньютона вперёд
  const n = table[0].length;
  const q = (x - x0) / h;

  let d1dq = 0;
  let d2dq2 = 0;

  for (let k = 1; k < n; k++) {
    // Для формулы вперёд используются Δ^k y_0 = table[k][0]
    const deltaK = table[k][0];
    // d/dq и d²/dq² для полинома Ньютона
    d1dq += (phiPrime(k, q) / factorial(k)) * deltaK;
    d2dq2 += (phiSecond(k, q) / factorial(k)) * deltaK;
  }

  return {
    // Переход от производных по q к производным по x:
    // dq/dx = 1/h, d²q/dx² = 0
    first: d1dq / h,
    second: d2dq2 / (h * h),
  };
}

// Производные по второй формуле Ньютона (в конце таблицы)
function derivativeBackward(
  x: number,
  xNodes: number[],
  h: number,
  table: number[][],
): { first: number; second: number } {
  const n = xNodes.length;
  // p = (x - x_n) / h — параметр для формулы Ньютона назад
  const p = (x - xNodes[n - 1]) / h;

  let d1dp = 0;
  let d2dp2 = 0;

  for (let k = 1; k < n; k++) {
    // ∇^k y_n = Δ^k y_{n-k}
    const nablaK = table[k][n - 1 - k];
    // d/dp и d²/dp² для полинома Ньютона назад
    d1dp += (psiPrime(k, p) / factorial(k)) * nablaK;
    d2dp2 += (psiSecond(k, p) / factorial(k)) * nablaK;
  }

  return {
    // Переход от производных по p к производным по x
    first: d1dp / h,
    second: d2dp2 / (h * h),
  };
}

type DifferentiationResult = {
  x: number;
  method: string;
  firstApprox: number;
  secondApprox: number;
  firstExact: number;
  secondExact: number;
  firstAbsError: number;
  secondAbsError: number;
};

function differentiateAt(
  x: number,
  xNodes: number[],
  h: number,
  table: number[][],
): DifferentiationResult {
  // Простой критерий выбора формулы:
  // ближе к началу таблицы — Ньютона вперёд,
  // ближе к концу таблицы — Ньютона назад.
  const middle = (xNodes[0] + xNodes[xNodes.length - 1]) / 2;

  const approx =
    x <= middle
      ? derivativeForward(x, xNodes[0], h, table)
      : derivativeBackward(x, xNodes, h, table);

  const method = x <= middle ? "первая формула Ньютона" : "вторая формула Ньютона";

  const firstExact = fPrimeExact(x);
  const secondExact = fSecondExact(x);

  return {
    x,
    method,
    firstApprox: approx.first,
    secondApprox: approx.second,
    firstExact,
    secondExact,
    firstAbsError: Math.abs(approx.first - firstExact),
    secondAbsError: Math.abs(approx.second - secondExact),
  };
}

// Данные варианта
// Равноотстоящие узлы (шаг h = 0.5)
const xNodes = [2, 2.5, 3, 3.5, 4];
const h = xNodes[1] - xNodes[0];
// Табличные значения функции в узлах
const yNodes = xNodes.map((x) => f(x));
const finiteDiffTable = buildFiniteDifferenceTable(yNodes);

// Вывод промежуточной таблицы, по которой строятся производные
printFiniteDifferenceTable(xNodes, finiteDiffTable);

// Точки из задания: одна внутри таблицы, другая за её пределами справа
const targetPoints = [2.9, 4.5];
const results = targetPoints.map((x) => differentiateAt(x, xNodes, h, finiteDiffTable));

console.log("Численное дифференцирование (1-я и 2-я производные):\n");

for (const r of results) {
  console.log(`x = ${r.x}`);
  console.log(`  Формула: ${r.method}`);

  console.log(`  f'(x) приближённо = ${format(r.firstApprox, 6)}`);
  console.log(`  f'(x) точно       = ${format(r.firstExact, 6)}`);
  console.log(`  |ошибка|          = ${format(r.firstAbsError, 6)}`);

  console.log(`  f''(x) приближённо = ${format(r.secondApprox, 6)}`);
  console.log(`  f''(x) точно       = ${format(r.secondExact, 6)}`);
  console.log(`  |ошибка|           = ${format(r.secondAbsError, 6)}`);

  console.log();
}
