/** Wilson score interval — well-behaved for small samples and rates near 0. */
export function wilson(successes: number, n: number, z = 1.96) {
  if (!n) return { p: 0, lo: 0, hi: 0 }
  const p = successes / n
  const z2 = z * z
  const denom = 1 + z2 / n
  const center = (p + z2 / (2 * n)) / denom
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom
  return { p, lo: Math.max(0, center - half), hi: Math.min(1, center + half) }
}

function randn() {
  let u = 0
  let v = 0
  while (!u) u = Math.random()
  while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// Marsaglia–Tsang; shape is always >= 1 here because of the Beta(1, 1) prior.
function gamma(shape: number) {
  const d = shape - 1 / 3
  const c = 1 / Math.sqrt(9 * d)
  for (;;) {
    let x: number
    let v: number
    do {
      x = randn()
      v = 1 + c * x
    } while (v <= 0)
    v = v * v * v
    const u = Math.random()
    if (u < 1 - 0.0331 * x ** 4) return d * v
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v
  }
}

function beta(a: number, b: number) {
  const x = gamma(a)
  return x / (x + gamma(b))
}

/** Probability that each arm has the highest true conversion rate (Beta-Binomial, uniform prior). */
export function probabilityBest(arms: { successes: number; n: number }[], draws = 20000): number[] {
  const wins = arms.map(() => 0)
  for (let d = 0; d < draws; d++) {
    let best = -1
    let bestIdx = 0
    arms.forEach((arm, i) => {
      const s = Math.min(arm.successes, arm.n)
      const x = beta(1 + s, 1 + arm.n - s)
      if (x > best) {
        best = x
        bestIdx = i
      }
    })
    wins[bestIdx]++
  }
  return wins.map((w) => w / draws)
}

/** Visitors per arm to tell p1 from p2 apart (two-sided α=0.05, power 80%). */
export function sampleSizePerArm(p1: number, p2: number) {
  if (p1 === p2) return Infinity
  const za = 1.96
  const zb = 0.8416
  return Math.ceil(((za + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2))) / (p1 - p2) ** 2)
}
