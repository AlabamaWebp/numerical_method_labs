// Практическая работа 4
// Вариант 4
// Численное дифференцирование по формуле Ньютона
//
// f(x) = x^4 + 1/x
// Узлы: 2, 2.5, 3, 3.5, 4
// Точки: x = 2.9, x = 4.5

function f(x: number): number {
  return Math.pow(x, 4) + 1 / x;
}

// Точная первая производная:
// f'(x) = 4x^3 - 1/x^2
function exactFirstDerivative(x: number): number {
  return 4 * Math.pow(x, 3) - 1 / Math.pow(x, 2);
}

// Точная вторая производная:
// f''(x) = 12x^2 + 2/x^3
function exactSecondDerivative(x: number): number {
  return 12 * Math.pow(x, 2) + 2 / Math.pow(x, 3);
}

// Факториал
function factorial(n: number): number {
  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

// Построение таблицы конечных разностей
function buildDifferenceTable(values: number[]): number[][] {
  const table: number[][] = [];
  table.push([...values]);

  for (let level = 1; level < values.length; level++) {
    const previous = table[level - 1];
    const current: number[] = [];

    for (let i = 0; i < previous.length - 1; i++) {
      current.push(previous[i + 1] - previous[i]);
    }

    table.push(current);
  }

  return table;
}

// Произведение q(q-1)(q-2)... для формулы Ньютона вперед
function qProductForward(q: number, k: number): number {
  let result = 1;

  for (let i = 0; i < k; i++) {
    result *= q - i;
  }

  return result;
}

// Произведение q(q+1)(q+2)... для формулы Ньютона назад
function qProductBackward(q: number, k: number): number {
  let result = 1;

  for (let i = 0; i < k; i++) {
    result *= q + i;
  }

  return result;
}

// Полином Ньютона вперед
function newtonForwardPolynomial(
  x: number,
  nodes: number[],
  diffTable: number[][],
): number {
  const h = nodes[1] - nodes[0];
  const x0 = nodes[0];
  const q = (x - x0) / h;

  let result = diffTable[0][0];

  for (let k = 1; k < nodes.length; k++) {
    result += (qProductForward(q, k) / factorial(k)) * diffTable[k][0];
  }

  return result;
}

// Полином Ньютона назад
function newtonBackwardPolynomial(
  x: number,
  nodes: number[],
  diffTable: number[][],
): number {
  const h = nodes[1] - nodes[0];
  const xn = nodes[nodes.length - 1];
  const q = (x - xn) / h;

  let result = diffTable[0][nodes.length - 1];

  for (let k = 1; k < nodes.length; k++) {
    const lastDifference = diffTable[k][nodes.length - 1 - k];
    result += (qProductBackward(q, k) / factorial(k)) * lastDifference;
  }

  return result;
}

// Первая производная полинома Ньютона.
// Производная считается численно от интерполяционного многочлена Ньютона.
function firstDerivativeNewton(
  x: number,
  nodes: number[],
  diffTable: number[][],
): number {
  const eps = 1e-5;

  const useForward = x <= nodes[Math.floor(nodes.length / 2)];

  const polynomial = useForward
    ? newtonForwardPolynomial
    : newtonBackwardPolynomial;

  return (
    (polynomial(x + eps, nodes, diffTable) -
      polynomial(x - eps, nodes, diffTable)) /
    (2 * eps)
  );
}

// Вторая производная полинома Ньютона.
// Производная считается численно от интерполяционного многочлена Ньютона.
function secondDerivativeNewton(
  x: number,
  nodes: number[],
  diffTable: number[][],
): number {
  const eps = 1e-4;

  const useForward = x <= nodes[Math.floor(nodes.length / 2)];

  const polynomial = useForward
    ? newtonForwardPolynomial
    : newtonBackwardPolynomial;

  return (
    (polynomial(x + eps, nodes, diffTable) -
      2 * polynomial(x, nodes, diffTable) +
      polynomial(x - eps, nodes, diffTable)) /
    (eps * eps)
  );
}

// Вывод таблицы конечных разностей
function printDifferenceTable(nodes: number[], diffTable: number[][]): void {
  console.log("Таблица конечных разностей:");

  for (let i = 0; i < nodes.length; i++) {
    let row = `x = ${nodes[i].toFixed(2)}, y = ${diffTable[0][i].toFixed(4)}`;

    for (let level = 1; level < diffTable.length; level++) {
      if (i < diffTable[level].length) {
        row += `, Δ^${level}y = ${diffTable[level][i].toFixed(4)}`;
      }
    }

    console.log(row);
  }

  console.log("");
}

// Исходные данные
const nodes: number[] = [2, 2.5, 3, 3.5, 4];
const values: number[] = nodes.map(f);
const diffTable = buildDifferenceTable(values);

const points: number[] = [2.9, 4.5];

console.log("Практическая работа 4");
console.log("Вариант 4");
console.log("f(x) = x^4 + 1/x");
console.log("Узлы:", nodes);
console.log("Шаг h =", nodes[1] - nodes[0]);
console.log("");

printDifferenceTable(nodes, diffTable);

for (const x of points) {
  const approxFirst = firstDerivativeNewton(x, nodes, diffTable);
  const approxSecond = secondDerivativeNewton(x, nodes, diffTable);

  const exactFirst = exactFirstDerivative(x);
  const exactSecond = exactSecondDerivative(x);

  const errorFirst = Math.abs(exactFirst - approxFirst).toFixed(4);
  const errorSecond = Math.abs(exactSecond - approxSecond).toFixed(4);

  console.log(`x = ${x}`);

  console.log(`Приближенное f'(${x}) = ${approxFirst.toFixed(4)}`);
  console.log(`Точное f'(${x}) = ${exactFirst.toFixed(4)}`);
  console.log(`Погрешность f'(${x}) = ${errorFirst}`);
  console.log("");

  console.log(`Приближенное f''(${x}) = ${approxSecond.toFixed(4)}`);
  console.log(`Точное f''(${x}) = ${exactSecond.toFixed(4)}`);
  console.log(`Погрешность f''(${x}) = ${errorSecond}`);

  console.log("-----------------------------------");
}
