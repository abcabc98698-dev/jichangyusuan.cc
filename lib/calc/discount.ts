import { DiscountInput, DiscountOutput, ValidationResult } from './types.js';
import { roundTo, isValidPositiveNumber, isNonNegativeNumber } from './math-utils.js';

export function calculateDiscount(input: DiscountInput): ValidationResult<DiscountOutput> {
  const assumptions: string[] = ['纯演算：以商家明确公开的优惠条款为准，不承诺任何未经核验的叠加。'];

  if (!isValidPositiveNumber(input.baseAmount)) {
    return {
      success: false,
      error: '基准金额必须为大于 0 的有效数值',
      assumptions
    };
  }

  // 1. 资格检查
  if (input.isEligible === false) {
    return {
      success: true,
      data: {
        finalAmount: input.baseAmount,
        savedAmount: 0,
        effectiveDiscountRate: 1.0,
        appliedOrder: '无（资格不符）',
        status: 'ineligible',
        explanation: '未满足该优惠的适用资格（如非新用户、套餐不在适用范围或已超出限额），仍按原价执行。'
      },
      assumptions
    };
  }

  const base = input.baseAmount;
  const rate = isValidPositiveNumber(input.discountRate) && input.discountRate > 0 && input.discountRate <= 1 
    ? input.discountRate 
    : 1.0;
  const fixed = isNonNegativeNumber(input.fixedOff) ? input.fixedOff : 0;
  const threshold = isNonNegativeNumber(input.minSpendThreshold) ? input.minSpendThreshold : 0;

  // 检查满减门槛
  const meetsThreshold = base >= threshold;
  if (!meetsThreshold && fixed > 0) {
    assumptions.push(`当前基准金额 ${base} 元未达到满减门槛 ${threshold} 元，满减优惠不生效。`);
  }

  const effectiveFixed = meetsThreshold ? fixed : 0;
  const hasPercentage = rate < 1.0;
  const hasFixed = effectiveFixed > 0;

  // 情况 A: 仅有百分比折扣
  if (hasPercentage && !hasFixed) {
    const finalAmount = roundTo(base * rate);
    const savedAmount = roundTo(base - finalAmount);
    return {
      success: true,
      data: {
        finalAmount,
        savedAmount,
        effectiveDiscountRate: rate,
        appliedOrder: `单一折扣（${rate * 10}折 / 优惠${roundTo((1 - rate) * 100)}%）`,
        status: 'valid',
        explanation: `基准价 ${base} 元按 ${rate * 10} 折结算，实付 ${finalAmount} 元，节省 ${savedAmount} 元。`
      },
      assumptions
    };
  }

  // 情况 B: 仅有固定满减
  if (!hasPercentage && hasFixed) {
    const finalAmount = Math.max(0, roundTo(base - effectiveFixed));
    const savedAmount = roundTo(base - finalAmount);
    return {
      success: true,
      data: {
        finalAmount,
        savedAmount,
        effectiveDiscountRate: roundTo(finalAmount / base, 4),
        appliedOrder: `单一立减 ${effectiveFixed} 元`,
        status: 'valid',
        explanation: `基准价 ${base} 元减免 ${effectiveFixed} 元，实付 ${finalAmount} 元，节省 ${savedAmount} 元。`
      },
      assumptions
    };
  }

  // 情况 C: 两者皆有，需要核验叠加规则
  if (hasPercentage && hasFixed) {
    const rule = input.stackingRule || 'unknown';

    if (rule === 'unknown') {
      return {
        success: true,
        data: {
          finalAmount: '待确认',
          savedAmount: '待确认',
          effectiveDiscountRate: null,
          appliedOrder: '叠加次序未知（待核验）',
          status: 'unknown_order',
          explanation: '商家活动条款未明确先折后减还是先减后折；禁止未经核对直接展示最优惠排列作为确定报价。'
        },
        assumptions
      };
    }

    if (rule === 'percentage_then_fixed') {
      // 先打折再减
      const afterPercent = roundTo(base * rate);
      const finalAmount = Math.max(0, roundTo(afterPercent - effectiveFixed));
      const savedAmount = roundTo(base - finalAmount);
      return {
        success: true,
        data: {
          finalAmount,
          savedAmount,
          effectiveDiscountRate: roundTo(finalAmount / base, 4),
          appliedOrder: '先打折后满减（经核验允许）',
          status: 'valid',
          explanation: `基准价 ${base} 元先打 ${rate * 10} 折为 ${afterPercent} 元，再立减 ${effectiveFixed} 元，最终实付 ${finalAmount} 元。`
        },
        assumptions
      };
    }

    if (rule === 'fixed_then_percentage') {
      // 先减再打折
      const afterFixed = Math.max(0, roundTo(base - effectiveFixed));
      const finalAmount = roundTo(afterFixed * rate);
      const savedAmount = roundTo(base - finalAmount);
      return {
        success: true,
        data: {
          finalAmount,
          savedAmount,
          effectiveDiscountRate: roundTo(finalAmount / base, 4),
          appliedOrder: '先满减后打折（经核验允许）',
          status: 'valid',
          explanation: `基准价 ${base} 元先减 ${effectiveFixed} 元为 ${afterFixed} 元，再打 ${rate * 10} 折，最终实付 ${finalAmount} 元。`
        },
        assumptions
      };
    }

    if (rule === 'single_best') {
      // 互斥，取更省者
      const percentOnly = roundTo(base * rate);
      const fixedOnly = Math.max(0, roundTo(base - effectiveFixed));
      const finalAmount = Math.min(percentOnly, fixedOnly);
      const savedAmount = roundTo(base - finalAmount);
      const bestName = percentOnly <= fixedOnly ? '折扣码' : '满减券';
      return {
        success: true,
        data: {
          finalAmount,
          savedAmount,
          effectiveDiscountRate: roundTo(finalAmount / base, 4),
          appliedOrder: `二选一最优（${bestName}）`,
          status: 'valid',
          explanation: `该套餐不允许叠加优惠码，计算器自动选择减免力度较大的方案（实付 ${finalAmount} 元）。`
        },
        assumptions
      };
    }
  }

  // 无任何有效优惠
  return {
    success: true,
    data: {
      finalAmount: base,
      savedAmount: 0,
      effectiveDiscountRate: 1.0,
      appliedOrder: '无可用优惠',
      status: 'valid',
      explanation: '未检测到可生效的折扣或满减金额。'
    },
    assumptions
  };
}
