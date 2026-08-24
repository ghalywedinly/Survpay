// Deterministic PRNG so seed data looks the same across server restarts.
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed = 42) {
  const rand = mulberry32(seed);
  return {
    float: () => rand(),
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(rand() * arr.length)];
    },
    pickMany<T>(arr: readonly T[], count: number): T[] {
      const pool = [...arr];
      const out: T[] = [];
      for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(rand() * pool.length);
        out.push(pool.splice(idx, 1)[0]);
      }
      return out;
    },
    bool: (p = 0.5) => rand() < p,
    dateWithinDays: (days: number) => {
      const now = Date.now();
      const past = now - Math.floor(rand() * days) * 24 * 60 * 60 * 1000;
      return new Date(past).toISOString();
    },
  };
}
