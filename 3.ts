// Тема: Интерполирование функции в случае равноотстоящих узлов
// f(x) = x^4 + 1/x, узлы: 2, 2.5, 3, 3.5, 4, точки: x = 2.9 и x = 4.5

function f(x: number): number {
  return x ** 4 + 1 / x;
}

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

// Таблица конечных разностей: table[0] = y, table[1] = Δy, ... table[4] = Δ^4 y
function buildFiniteDifferenceTable(y: number[]): number[][] {
  const n = y.length;
  const table: number[][] = [y.slice()];

  for (let order = 1; order < n; order++) {
    const prev = table[order - 1];
    const current: number[] = [];
    for (let i = 0; i < n - order; i++) {
      current.push(prev[i + 1] - prev[i]);
    }
    table.push(current);
  }

  return table;
}

function format(value: number, digits = 4): string {
  return value.toFixed(digits);
}

function printFiniteDifferenceTable(xNodes: number[], table: number[][]): void {
  const widths = [3, 7, 12, 12, 12, 12, 12];
  const cell = (text: string, width: number): string => text.padStart(width, " ");

  const n = xNodes.length;
  console.log("Таблица конечных разностей (до 4-го порядка):");
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
      cell(format(xNodes[i], 1), widths[1]),
      cell(table[0][i] !== undefined ? format(table[0][i]) : "", widths[2]),
      cell(table[1][i] !== undefined ? format(table[1][i]) : "", widths[3]),
      cell(table[2][i] !== undefined ? format(table[2][i]) : "", widths[4]),
      cell(table[3][i] !== undefined ? format(table[3][i]) : "", widths[5]),
      cell(table[4][i] !== undefined ? format(table[4][i]) : "", widths[6]),
    ].join(" ");

    console.log(row);
  }
  console.log();
}

// Первая формула Ньютона (вперёд)
function newtonForwardInterpolation(
  x: number,
  x0: number,
  h: number,
  table: number[][],
): number {
  const q = (x - x0) / h;
  const n = table[0].length;
  let result = table[0][0];
  let qProduct = 1;

  for (let k = 1; k < n; k++) {
    qProduct *= q - (k - 1);
    result += (qProduct / factorial(k)) * table[k][0];
  }
  return result;
}

// Вторая формула Ньютона (назад)
function newtonBackwardInterpolation(
  x: number,
  xNodes: number[],
  h: number,
  table: number[][],
): number {
  const n = xNodes.length;
  const xn = xNodes[n - 1];
  const q = (x - xn) / h;
  let result = table[0][n - 1];
  let qProduct = 1;

  for (let k = 1; k < n; k++) {
    qProduct *= q + (k - 1);
    result += (qProduct / factorial(k)) * table[k][n - 1 - k];
  }
  return result;
}

// Формулы Гаусса (центральные):
// при t >= 0 используем первую формулу Гаусса,
// при t < 0  используем вторую формулу Гаусса.
function gaussCentralInterpolation(
  x: number,
  xNodes: number[],
  h: number,
  table: number[][],
): number {
  const n = xNodes.length;
  const m = Math.floor(n / 2); // центральный узел (x = 3)
  const t = (x - xNodes[m]) / h;

  let result = table[0][m];

  if (t >= 0) {
    // 1-я формула Гаусса
    result += t * table[1][m];
    result += (t * (t - 1) * table[2][m - 1]) / factorial(2);
    result += (t * (t - 1) * (t + 1) * table[3][m - 1]) / factorial(3);
    result +=
      (t * (t - 1) * (t + 1) * (t - 2) * table[4][m - 2]) / factorial(4);
  } else {
    // 2-я формула Гаусса
    result += t * table[1][m - 1];
    result += (t * (t + 1) * table[2][m - 1]) / factorial(2);
    result += (t * (t + 1) * (t - 1) * table[3][m - 2]) / factorial(3);
    result +=
      (t * (t + 1) * (t - 1) * (t + 2) * table[4][m - 2]) / factorial(4);
  }

  return result;
}

// Данные варианта
const xNodes: number[] = [2, 2.5, 3, 3.5, 4];
const h = 0.5;
const yNodes = xNodes.map((x) => f(x));
const diffTable = buildFiniteDifferenceTable(yNodes);

printFiniteDifferenceTable(xNodes, diffTable);

const xTargets = [2.9, 4.5];

for (const x of xTargets) {
  let approx: number;
  let method: string;

  // Подбор подходящей формулы:
  // - внутри интервала и около центра -> формула Гаусса
  // - правее последнего узла -> вторая формула Ньютона
  // - левее первого узла -> первая формула Ньютона
  if (x >= xNodes[0] && x <= xNodes[xNodes.length - 1]) {
    approx = gaussCentralInterpolation(x, xNodes, h, diffTable);
    method = "формула Гаусса (центральная)";
  } else if (x > xNodes[xNodes.length - 1]) {
    approx = newtonBackwardInterpolation(x, xNodes, h, diffTable);
    method = "вторая формула Ньютона";
  } else {
    approx = newtonForwardInterpolation(x, xNodes[0], h, diffTable);
    method = "первая формула Ньютона";
  }

  const exact = f(x);
  const absError = Math.abs(exact - approx);

  console.log(`x = ${x}`);
  console.log(`  Выбранная формула: ${method}`);
  console.log(`  Интерполированное значение: ${format(approx)}`);
  console.log(`  Точное значение:            ${format(exact)}`);
  console.log(`  Абсолютная погрешность:     ${format(absError)}`);
  console.log();
}
