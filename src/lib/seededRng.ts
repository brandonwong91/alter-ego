function xmur3(str: string) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return h >>> 0
  }
}

function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSeededRng(seed: string) {
  const seedGen = xmur3(seed)
  return mulberry32(seedGen())
}

export function randomSeed() {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(2)
    crypto.getRandomValues(buf)
    return `${buf[0].toString(16)}${buf[1].toString(16)}`.padStart(16, '0')
  }
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`.slice(
    0,
    16,
  )
}

