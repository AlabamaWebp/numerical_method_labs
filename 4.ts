// Практическая работа 4
// Вариант 4
// f(x) = x^4 + 1/x
// Узлы: 2, 2.5, 3, 3.5, 4
// Точки для вычисления: x = 2.9 и x = 4.5

function f(x: number): number {
    return Number((Math.pow(x, 4) + 1 / x).toFixed(4));
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

// Значение базисного полинома Лагранжа L_i(x)
function lagrangeBasis(x: number, nodes: number[], i: number): number {
    let result = 1;

    for (let j = 0; j < nodes.length; j++) {
        if (j !== i) {
            result *= (x - nodes[j]) / (nodes[i] - nodes[j]);
        }
    }

    return result;
}

// Интерполяционный многочлен Лагранжа
function lagrangePolynomial(x: number, nodes: number[], values: number[]): number {
    let result = 0;

    for (let i = 0; i < nodes.length; i++) {
        result += values[i] * lagrangeBasis(x, nodes, i);
    }

    return result;
}

// Численная первая производная интерполяционного многочлена
function firstDerivativeApprox(x: number, nodes: number[], values: number[]): number {
    const eps = 1e-5;

    return (
        lagrangePolynomial(x + eps, nodes, values) -
        lagrangePolynomial(x - eps, nodes, values)
    ) / (2 * eps);
}

// Численная вторая производная интерполяционного многочлена
function secondDerivativeApprox(x: number, nodes: number[], values: number[]): number {
    const eps = 1e-4;

    return (
        lagrangePolynomial(x + eps, nodes, values) -
        2 * lagrangePolynomial(x, nodes, values) +
        lagrangePolynomial(x - eps, nodes, values)
    ) / (eps * eps);
}

// Исходные данные варианта 4
const nodes: number[] = [2, 2.5, 3, 3.5, 4];
const values: number[] = nodes.map(f);

const points: number[] = [2.9, 4.5];

console.log("Практическая работа 4");
console.log("Вариант 4");
console.log("f(x) = x^4 + 1/x");
console.log("Узлы:", nodes);
console.log("Значения функции в узлах:", values);
console.log("");

for (const x of points) {
    const approxFirst = firstDerivativeApprox(x, nodes, values);
    const approxSecond = secondDerivativeApprox(x, nodes, values);

    const exactFirst = exactFirstDerivative(x);
    const exactSecond = exactSecondDerivative(x);

    const errorFirst = Math.abs(exactFirst - approxFirst);
    const errorSecond = Math.abs(exactSecond - approxSecond);

    console.log(`x = ${x}`);
    console.log(`Приближенное f'(${x}) = ${approxFirst.toFixed(4)}`);
    console.log(`Точное f'(${x}) = ${exactFirst.toFixed(4)}`);
    console.log(`Погрешность первой производной = ${errorFirst.toFixed(4)}`);
    console.log("");

    console.log(`Приближенное f''(${x}) = ${approxSecond.toFixed(4)}`);
    console.log(`Точное f''(${x}) = ${exactSecond.toFixed(4)}`);
    console.log(`Погрешность второй производной = ${errorSecond.toFixed(4)}`);
    console.log("-----------------------------------");
}