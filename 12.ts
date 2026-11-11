// Лабораторная работа 12, вариант 4: явная разностная схема.
const M = 4;
const L = 1;
const T = 1;
const A2 = 0.5;
const h = L / M;

function source(x: number): number {
  return x * (x - x * x);
}

function initial(x: number): number {
  return x - x * x;
}

function solve(N: number): number[][] {
  const tau = T / N;
  const r = A2 * tau / (h * h);
  const layers: number[][] = [Array.from({ length: M + 1 }, (_, m) => initial(m * h))];
  for (let n = 0; n < N; n++) {
    const previous = layers[n];
    const next = Array<number>(M + 1).fill(0);
    for (let m = 1; m < M; m++) {
      next[m] = previous[m] + r * (previous[m - 1] - 2 * previous[m] + previous[m + 1])
        + tau * source(m * h);
    }
    layers.push(next);
  }
  return layers;
}

for (const N of [4, 16]) {
  const tau = T / N;
  const r = A2 * tau / (h * h);
  const layers = solve(N);
  console.log(`\nM=${M}, N=${N}, h=${h}, tau=${tau}, r=${r}`);
  console.log('t\\x\t0\t0.25\t0.5\t0.75\t1');
  for (let n = 0; n <= N; n++) {
    if (N === 4 || n === N) {
      console.log(`${(n * tau).toFixed(4)}\t${layers[n].map(value => value.toFixed(8)).join('\t')}`);
    }
  }
}
