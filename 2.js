// вариант 4
// 4.   f(x)=2+4/(x3-1.5)   x0=2, x1=2.7, x2=5, x3=3, x=4
function fx(x) {
    return Number((2 + 4 / (x * 3 - 1.5)).toFixed(4));
}
// 1. Построение интерполяционного многочлена Ньютона
export function newtonInterpolation(xNodes, yNodes, x) {
    const n = xNodes.length;
    const coeffs = [...yNodes];
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
export function lagrangeInterpolation(xNodes, yNodes, x) {
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
const x = [2, 2.7, 5, 3];
const y = [];
for (let i = 0; i < 4; i++) {
    y.push(fx(x[i]));
}
// значение многочлена Ньютона в точке x=4
const newtonValue = newtonInterpolation(x, y, 4);
// значение многочлена Лагранжа в точке x=4
const lagrangeValue = lagrangeInterpolation(x, y, 4);
// фактическое значение функции в точке x=4
const actualValue = fx(4);
console.log(`
  x: ${x}
  y: ${y}
  Предсказание по Лагранжу: ${lagrangeValue.toFixed(4)}
  Предсказание по Ньютону: ${newtonValue.toFixed(4)}
  Посчитанное функцией: ${actualValue}`);
