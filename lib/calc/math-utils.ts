/**
 * 基础高精度数学与舍入工具
 * 规避浮点数 0.1 + 0.2 = 0.30000000000000004 精度问题
 */

export function roundTo(val: number, decimals: number = 2): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

export function isValidPositiveNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val) && isFinite(val) && val > 0;
}

export function isNonNegativeNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val) && isFinite(val) && val >= 0;
}

export function cycleToMonths(cycle: string): number {
  switch (cycle) {
    case 'monthly': return 1;
    case 'quarterly': return 3;
    case 'semiannual': return 6;
    case 'annual': return 12;
    case 'biennial': return 24;
    case 'one_time': return 1; // 一次性包按当期处理
    default: return 1;
  }
}
