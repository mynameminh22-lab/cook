import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const RESISTOR_COLORS: Record<number, string> = {
  0: '#000000', // Black
  1: '#8B4513', // Brown
  2: '#FF0000', // Red
  3: '#FFA500', // Orange
  4: '#FFFF00', // Yellow
  5: '#008000', // Green
  6: '#0000FF', // Blue
  7: '#EE82EE', // Violet
  8: '#808080', // Gray
  9: '#FFFFFF', // White
  [-1]: '#FFD700', // Gold (0.1 or 5%)
  [-2]: '#C0C0C0', // Silver (0.01 or 10%)
};

export function getResistorColors(resistance: number): string[] {
  if (resistance === 0) return [RESISTOR_COLORS[0]]; // Jumper (single black band)

  // Convert to scientific notation to find digits and multiplier
  let multiplier = 0;
  let value = resistance;
  
  while (value >= 100) {
    value /= 10;
    multiplier++;
  }
  while (value < 10 && value > 0) {
    value *= 10;
    multiplier--;
  }
  
  // Standard 4-band code uses first two digits
  const digits = Math.round(value); // Should be between 10 and 99
  const d1 = Math.floor(digits / 10);
  const d2 = digits % 10;
  
  // Adjust multiplier if we shifted
  // E.g. 100 -> value=10, mult=1. d1=1, d2=0. Band 3 (mult) = 1 (x10). 10 * 10 = 100. Correct.
  // E.g. 4700 -> value=47, mult=2. d1=4, d2=7. Band 3 (mult) = 2 (x100). 47 * 100 = 4700. Correct.
  
  return [
    RESISTOR_COLORS[d1],
    RESISTOR_COLORS[d2],
    RESISTOR_COLORS[multiplier] || RESISTOR_COLORS[8], // Fallback to gray if out of range
    RESISTOR_COLORS[-1] // Gold tolerance (5%)
  ];
}

export function formatValue(value: number, unit: string = ''): string {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M${unit}`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k${unit}`;
  }
  if (Math.abs(value) < 1 && value !== 0) {
      return `${(value * 1000).toFixed(1).replace(/\.0$/, '')}m${unit}`;
  }
  return `${parseFloat(value.toFixed(2))}${unit}`;
}

export function dist(p1: {x: number, y: number}, p2: {x: number, y: number}) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

export function distToSegment(p: {x: number, y: number}, v: {x: number, y: number}, w: {x: number, y: number}) {
  const l2 = (v.x - w.x)**2 + (v.y - w.y)**2;
  if (l2 === 0) return dist(p, v);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
}
