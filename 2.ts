// вариант 4
// 4.   f(x)=2+4/(x3-1.5)   x0=2, x1=2.7, x2=5, x3=3, x=4
function fx(x: number): number {
  return Number((2 + 4 / (x * 3 - 1.5)).toFixed(4));
}
// 1. Построение интерполяционного многочлена Ньютона
export function newtonInterpolation(
  xNodes: number[],
  yNodes: number[],
  x: number,
): number {
  const n = xNodes.length;
  const coeffs: number[] = [...yNodes];
  // вычисление разделенных разностей
  for (let i = 1; i < n; i++) {
    for (let j = n - 1; j >= i; j--) {
      coeffs[j] = (coeffs[j] - coeffs[j - 1]) / (xNodes[j] - xNodes[j - i]);
    }
  }
  // вычисление значения многочлена Ньютона в точке x
  let result = coeffs[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    result = result * (x - xNodes[i]) + coeffs[i];
  }
  return Number(result.toFixed(4));
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
  return Number(result.toFixed(4));
}

function buildDividedDifferenceTable(
  xNodes: number[],
  yNodes: number[],
): number[][] {
  const n = xNodes.length;
  const table: number[][] = Array.from({ length: n }, () => Array(n).fill(NaN));

  for (let i = 0; i < n; i++) {
    table[i][0] = yNodes[i];
  }

  for (let order = 1; order < n; order++) {
    for (let i = 0; i < n - order; i++) {
      table[i][order] =
        (table[i + 1][order - 1] - table[i][order - 1]) /
        (xNodes[i + order] - xNodes[i]);
    }
  }

  return table;
}

function printDividedDifferenceTable(xNodes: number[], table: number[][]): void {
  const n = xNodes.length;
  const diffColumns = Array.from({ length: n }, (_, order) =>
    order === 0 ? "f[x_i]" : `Разн.${order}-го порядка`,
  );

  const rows = xNodes.map((xValue, i) => {
    const row: Record<string, string | number> = {
      i,
      x_i: xValue,
    };

    for (let order = 0; order < n; order++) {
      const columnName = diffColumns[order];
      row[columnName] =
        i + order < n && !Number.isNaN(table[i][order])
          ? Number(table[i][order].toFixed(6))
          : "";
    }

    return row;
  });

  console.log("Таблица разделённых разностей:");
  console.table(rows);
}

const x: number[] = [2, 2.7, 5, 3];
const y: number[] = [];
for (let i = 0; i < 4; i++) {
  y.push(fx(x[i]));
}

const dividedDifferenceTable = buildDividedDifferenceTable(x, y);
printDividedDifferenceTable(x, dividedDifferenceTable);

// значение многочлена Ньютона в точке x=4
const newtonValue = newtonInterpolation(x, y, 4);
// значение многочлена Лагранжа в точке x=4
const lagrangeValue = lagrangeInterpolation(x, y, 4);
// фактическое значение функции в точке x=4
const actualValue = fx(4);

console.log(
  `
  x: ${x}
  y: ${y}
  Предсказание по Лагранжу: ${lagrangeValue.toFixed(4)}
  Предсказание по Ньютону: ${newtonValue.toFixed(4)}
  Посчитанное функцией: ${actualValue}`
);

