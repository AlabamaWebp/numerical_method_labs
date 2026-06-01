function f(x: number): number {
    return 8 * x ** 3 - 0.7 * x - 0.5;
}

function df(x: number): number {
    return 24 * x ** 2 - 0.7;
}

let x = 0.475;

for (let i = 1; i <= 3; i++) {
    x = x - f(x) / df(x);

    console.log(`Итерация ${i}:`);
    console.log(`x = ${x.toFixed(2)}`);
    console.log(`f(x) = ${f(x).toFixed(6)}`);
}

console.log(`Приближённый корень: x ≈ ${x.toFixed(2)}`);