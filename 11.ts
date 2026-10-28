const X0 = 0;
const X = 1;
const Y0 = 1;
const N = 5;
const h = (X - X0) / N;

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

const improvedValues = improvedEuler(X0, Y0, h, N);
const cauchyValues = eulerCauchy(X0, Y0, h, N);

console.log("Задача Коши: y' = x² + y², y(0) = 1");
console.log(`Шаг h = ${h.toFixed(4)}, число шагов N = ${N}`);
console.log("\nСравнение методов:");
console.log("n\tx\tУсовершенствованный Эйлер\tЭйлер-Коши");
for (let i = 0; i <= N; i++) {
  console.log(`${i}\t${(X0 + i * h).toFixed(4)}\t${improvedValues[i].toFixed(4)}\t\t\t\t${cauchyValues[i].toFixed(4)}`);
}

// Для положительного решения (1/y)' = -1 - x²/y² < -1 при x > 0.
// Поэтому решение обращается в бесконечность до x = 1; значения сеточных
// методов за точкой разрыва не являются приближением точного решения.
console.log("\nВнимание: точное решение имеет особенность до x = 1.");
