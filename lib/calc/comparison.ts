import { ComparisonInput, ComparisonOutput, ComparisonTimelinePoint, ValidationResult } from './types.js';
import { roundTo, isValidPositiveNumber, isNonNegativeNumber } from './math-utils.js';

export function compareMonthlyAnnual(input: ComparisonInput): ValidationResult<ComparisonOutput> {
  const assumptions: string[] = ['纯数学模型演算：比较只在两方案权益、节点稳定性、速率和软件支持完全相同的前提下成立。'];

  if (!isValidPositiveNumber(input.monthlyPlanPrice)) {
    return { success: false, error: '月付金额必须为大于 0 的有效数值', assumptions };
  }
  if (!isValidPositiveNumber(input.annualPlanPrice)) {
    return { success: false, error: '年付金额必须为大于 0 的有效数值', assumptions };
  }

  const comparisonMonths = isValidPositiveNumber(input.comparisonMonths) && input.comparisonMonths > 0
    ? Math.min(Math.floor(input.comparisonMonths), 36)
    : 12;

  const monthlyExtra = isNonNegativeNumber(input.monthlyExtraFee) ? input.monthlyExtraFee : 0;
  const annualExtra = isNonNegativeNumber(input.annualExtraFee) ? input.annualExtraFee : 0;

  const monthlyPerMonthCash = input.monthlyPlanPrice + monthlyExtra;
  const annualPerEventCash = input.annualPlanPrice + annualExtra;

  const timeline: ComparisonTimelinePoint[] = [];
  let breakEvenMonth = -1;

  for (let m = 1; m <= comparisonMonths; m++) {
    // 月付：每个月支付 1 次
    const monthlyCumulativeCash = roundTo(monthlyPerMonthCash * m);

    // 年付：第 1 个月发生第 1 次年付 (12个月)，第 13 个月发生第 2 次年付，第 25 个月发生第 3 次年付
    const annualEvents = Math.ceil(m / 12);
    const annualCumulativeCash = roundTo(annualPerEventCash * annualEvents);

    const difference = roundTo(monthlyCumulativeCash - annualCumulativeCash);

    // 平衡点定义：年付累计现金支出 <= 月付累计现金支出的首个月份
    if (breakEvenMonth === -1 && annualCumulativeCash <= monthlyCumulativeCash) {
      breakEvenMonth = m;
    }

    timeline.push({
      month: m,
      monthlyCumulativeCash,
      annualCumulativeCash,
      difference
    });
  }

  const annualEquivalentMonthly = roundTo(annualPerEventCash / 12);
  const firstPaymentDifference = roundTo(annualPerEventCash - monthlyPerMonthCash);

  assumptions.push(`年付首次付款仍为 ${annualPerEventCash} 元，虽然月均折算为 ${annualEquivalentMonthly} 元/月，但不能拆分为单月 10 元付款。`);
  if (breakEvenMonth > 0) {
    assumptions.push(`在第 ${breakEvenMonth} 个月时，月付累计支出达到或超过年付累计支出；若在第 ${breakEvenMonth} 个月前停止使用，月付现金支出更低。`);
  } else {
    assumptions.push(`在观察的 ${comparisonMonths} 个月内，月付累计支出始终未超过年付单次预付额。`);
  }

  return {
    success: true,
    data: {
      breakEvenMonth,
      timeline,
      annualEquivalentMonthly,
      firstPaymentDifference,
      assumptions
    },
    assumptions
  };
}
