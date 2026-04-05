// Тема: Интерполирование функции в случае равноотстоящих узлов
// f(x) = x^4 + 1/x   узлы: 2, 2.5, 3, 3.5, 4   x = 2.9, x = 4.5
function fx(x: number): number {
  return Number((Math.pow(x, 4) + 1 / x).toFixed(4));
}

// Построение таблицы конечных разностей
function buildFiniteDifferenceTable(y: number[]): number[][] {
  const n = y.length;
  const table: number[][] = [];
  table[0] = [...y];
  for (let order = 1; order < n; order++) {
    table[order] = [];
    for (let i = 0; i < n - order; i++) {
      table[order][i] = Number(
        (table[order - 1][i + 1] - table[order - 1][i]).toFixed(4),
      );
    }
  }
  return table;
}

// Вывод таблицы конечных разностей
function printFiniteDifferenceTable(table: number[][]): void {
  console.log("Таблица конечных разностей:");
  const n = table.length;
  for (let order = 0; order < n; order++) {
    const label = order === 0 ? "y" : `Δ^${order}y`;
    console.log(`${label}: ${table[order].join(", ")}`);
  }
  console.log("");
}

// Интерполяция первой формулой Ньютона (для узлов в начале таблицы)
function newtonForwardInterpolation(
  x0: number,
  h: number,
  y: number[],
  table: number[][],
  x: number,
): number {
  const q = (x - x0) / h;
  const n = y.length;
  let result = y[0];
  let qProduct = 1;
  for (let i = 1; i < n; i++) {
    qProduct *= (q - (i - 1));
    const factorial = getFactorial(i);
    result += (qProduct / factorial) * table[i][0];
  }
  return Number(result.toFixed(4));
}

// Интерполяция второй формулой Ньютона (для узлов в конце таблицы)
function newtonBackwardInterpolation(
  x0: number,
  h: number,
  y: number[],
  table: number[][],
  x: number,
): number {
  const n = y.length;
  const xn = x0 + (n - 1) * h;
  const q = (x - xn) / h;
  let result = y[n - 1];
  let qProduct = 1;
  for (let i = 1; i < n; i++) {
    qProduct *= (q + (i - 1));
    const factorial = getFactorial(i);
    result += (qProduct / factorial) * table[i][n - 1 - i];
  }
  return Number(result.toFixed(4));
}

// Вычисление факториала
function getFactorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Узлы интерполяции (равноотстоящие с шагом h=0.5)
const xNodes: number[] = [2, 2.5, 3, 3.5, 4];
const h = 0.5;
const yNodes: number[] = xNodes.map((xi) => fx(xi));

// Построение таблицы конечных разностей
const diffTable = buildFiniteDifferenceTable(yNodes);
printFiniteDifferenceTable(diffTable);

// Точки для интерполирования
const xTargets: number[] = [2.9, 4.5];

for (const x of xTargets) {
  let interpolatedValue: number;
  let formula: string;

  // Выбор формулы интерполяции
  // x = 2.9 ближе к началу таблицы -> первая формула Ньютона
  // x = 4.5 за пределами таблицы (справа) -> вторая формула Ньютона
  if (x <= xNodes[Math.floor(xNodes.length / 2)]) {
    interpolatedValue = newtonForwardInterpolation(
      xNodes[0],
      h,
      yNodes,
      diffTable,
      x,
    );
    formula = "первая формула Ньютона";
  } else {
    interpolatedValue = newtonBackwardInterpolation(
      xNodes[0],
      h,
      yNodes,
      diffTable,
      x,
    );
    formula = "вторая формула Ньютона";
  }

  const actualValue = fx(x);
  const error = Math.abs(actualValue - interpolatedValue);

  console.log(`Точка x = ${x}:`);
  console.log(`  Использована: ${formula}`);
  console.log(`  Интерполированное значение: ${interpolatedValue}`);
  console.log(`  Точное значение: ${actualValue}`);
  console.log(`  Погрешность: ${error.toFixed(4)}`);
  console.log("");
}
