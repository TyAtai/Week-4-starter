/**
 * Generates a deterministic, wavy "route" path from a string seed so every
 * trail gets a stable, distinctive map-preview illustration without any
 * network request or bundled map imagery.
 */
function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RoutePath {
  d: string;
  markerX: number;
  markerY: number;
  width: number;
  height: number;
}

export function generateRoutePath(seed: string, width = 320, height = 170): RoutePath {
  const random = mulberry32(hashSeed(seed));
  const points = 5;
  const marginX = width * 0.1;
  const marginY = height * 0.18;
  const usableWidth = width - marginX * 2;
  const usableHeight = height - marginY * 2;

  const coords: { x: number; y: number }[] = [];
  for (let i = 0; i < points; i += 1) {
    const x = marginX + (usableWidth * i) / (points - 1);
    const y = marginY + random() * usableHeight;
    coords.push({ x, y });
  }

  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 1; i < coords.length; i += 1) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }

  return {
    d,
    markerX: coords[0].x,
    markerY: coords[0].y,
    width,
    height,
  };
}
