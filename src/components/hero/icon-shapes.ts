import { Shape } from 'three';

export interface IconLayers {
  /** Extrusion-ready shapes for the white parts (braces, quote marks, face outline). */
  white: Shape[];
  /** Extrusion-ready shapes for the blue parts (goggles). */
  blue: Shape[];
}

interface Pt {
  x: number;
  y: number;
}

const DIRS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`icon failed to load: ${src}`));
    image.src = src;
  });
}

/** Morphological close (1px dilate then erode) to despeckle antialiased edges. */
function closeMask(mask: Uint8Array, w: number, h: number): Uint8Array {
  const dilated = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      dilated[i] = 1;
      if (x > 0) dilated[i - 1] = 1;
      if (x < w - 1) dilated[i + 1] = 1;
      if (y > 0) dilated[i - w] = 1;
      if (y < h - 1) dilated[i + w] = 1;
    }
  }
  const closed = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!dilated[i]) continue;
      const left = x > 0 && dilated[i - 1];
      const right = x < w - 1 && dilated[i + 1];
      const up = y > 0 && dilated[i - w];
      const down = y < h - 1 && dilated[i + w];
      if (left && right && up && down) closed[i] = 1;
    }
  }
  return closed;
}

/** Moore-neighbor boundary tracing on a padded-binary raster. */
function traceContours(mask: Uint8Array, w: number, h: number): Pt[][] {
  const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < w && y < h ? mask[y * w + x] : 0);
  const visited = new Uint8Array(w * h);
  const contours: Pt[][] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!at(x, y) || visited[y * w + x]) continue;
      if (at(x - 1, y)) continue; // not a left boundary pixel

      const contour: Pt[] = [];
      let px = x;
      let py = y;
      let dir = 0;
      const maxSteps = w * h;

      for (let step = 0; step < maxSteps; step++) {
        contour.push({ x: px, y: py });
        visited[py * w + px] = 1;

        let next = -1;
        for (let i = 0; i < 8; i++) {
          const d = (dir + 5 + i) % 8;
          const nx = px + DIRS[d][0];
          const ny = py + DIRS[d][1];
          if (at(nx, ny)) {
            next = d;
            px = nx;
            py = ny;
            dir = d;
            break;
          }
        }
        if (next === -1) break; // isolated pixel
        if (px === x && py === y) break; // closed the loop
      }
      if (contour.length > 8) contours.push(contour);
    }
  }
  return contours;
}

function rdp(points: Pt[], eps: number): Pt[] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack: Array<[number, number]> = [[0, points.length - 1]];

  while (stack.length) {
    const [start, end] = stack.pop()!;
    const a = points[start];
    const b = points[end];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;

    let maxDist = 0;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const p = points[i];
      const dist = Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / len;
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    if (maxDist > eps && index > 0) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function signedArea(pts: Pt[]): number {
  let area = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % n];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

/**
 * Build one solid Shape per contour. The emblem is a stack of disjoint parts
 * (braces, quote marks, goggle rings) rather than outer-boundary-with-holes,
 * so even-odd hole assignment does not apply — each traced boundary extrudes
 * as its own solid. Contours are pre-filtered by raw pixel area upstream.
 */
function assembleShapes(contours: Pt[][]): Shape[] {
  return contours.map((pts) => {
    const shape = new Shape();
    shape.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i].x, pts[i].y);
    shape.closePath();
    return shape;
  });
}

/**
 * Traces the brand icon into two extrusion-ready shape sets: the white parts
 * (braces, quote marks, face outline) and the blue parts (goggles). The
 * wordmark band at the bottom of the source image is excluded, everything is
 * centred and scaled to a common world-space height, and y is flipped from
 * raster to scene orientation.
 */
export async function buildIconLayers(src: string, worldHeight = 2.9): Promise<IconLayers> {
  const image = await loadImage(src);
  const w = image.naturalWidth;
  const h = image.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;

  const cropY = Math.floor(h * 0.74); // exclude the wordmark band
  const makeMask = (predicate: (r: number, g: number, b: number, a: number) => boolean) => {
    const mask = new Uint8Array(w * h);
    for (let y = 0; y < cropY; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (predicate(data[i], data[i + 1], data[i + 2], data[i + 3])) mask[y * w + x] = 1;
      }
    }
    return closeMask(mask, w, h);
  };

  const whiteMask = makeMask((r, g, b, a) => a > 128 && r > 170 && g > 170 && b > 170);
  const blueMask = makeMask((r, g, b, a) => a > 128 && b > 110 && b > r + 30 && b > g + 15);

  const whiteContours = traceContours(whiteMask, w, h);
  const blueContours = traceContours(blueMask, w, h);

  // Despeckle + simplify, keeping only parts with real pixel area (pre-scale).
  const keepMeaningful = (contours: Pt[][]) =>
    contours
      .map((pts) => rdp(pts, 1.4))
      .filter((pts) => Math.abs(signedArea(pts)) >= 60);
  const rawWhite = keepMeaningful(whiteContours);
  const rawBlue = keepMeaningful(blueContours);
  if (!rawWhite.length && !rawBlue.length) throw new Error('icon trace produced no contours');

  // Common bbox across both masks so the layers stay aligned.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const pts of [...rawWhite, ...rawBlue]) {
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const scale = worldHeight / (maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const place = (pts: Pt[]): Pt[] => pts.map((p) => ({ x: (p.x - cx) * scale, y: -(p.y - cy) * scale }));

  const white = assembleShapes(rawWhite.map(place));
  const blue = assembleShapes(rawBlue.map(place));
  if (!white.length && !blue.length) throw new Error('icon trace produced no shapes');

  return { white, blue };
}
