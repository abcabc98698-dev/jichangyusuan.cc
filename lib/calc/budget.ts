import { BudgetInput, BudgetOutput, ValidationResult } from './types.js';
import { roundTo, isNonNegativeNumber, isValidPositiveNumber, cycleToMonths } from './math-utils.js';

export function calculateBudget(input: BudgetInput): ValidationResult<BudgetOutput> {
  const assumptions: string[] = ['本结果为基于输入参数的数学纯演算，不是任何特定品牌的官方报价。'];

  // 1. 校验输入
  if (!isValidPositiveNumber(input.planPrice)) {
    return { success: false, error: '套餐价格必须为大于 0 的有效数值', assumptions };
  }
  if (!isValidPositiveNumber(input.comparisonMonths) || input.comparisonMonths <= 0) {
    return { success: false, error: '比较期限必须为大于 0 的月份数', assumptions };
  }

  const cycleMonths = cycleToMonths(input.billingCycle);
  const clientCost = isNonNegativeNumber(input.clientOneTimeCost) ? input.clientOneTimeCost : 0;
  const fixedFee = isNonNegativeNumber(input.paymentFeeFixed) ? input.paymentFeeFixed : 0;
  const feeRate = isNonNegativeNumber(input.paymentFeeRate) ? input.paymentFeeRate : 0;

  // 2. 付款事件计算
  // 按照实际发生的付款事件求和，首期立即付款，之后每满 cycleMonths 发生一次续费
  // 比如月付在 6 个月内付 6 次；年付在 6 个月内仅首付 1 次；年付在 13 个月内付 2 次 (第1月与第13月初)
  const paymentEventsCount = Math.ceil(input.comparisonMonths / cycleMonths);
  const singlePaymentPlanPrice = input.planPrice;
  const singlePaymentFee = roundTo(fixedFee + singlePaymentPlanPrice * feeRate);
  const singlePaymentTotal = singlePaymentPlanPrice + singlePaymentFee;

  // 首期现金实付 = 首次套餐款 + 首期手续费 + 客户端买断费
  const firstPaymentCash = roundTo(singlePaymentTotal + clientCost);

  // 比较期总现金支出 = 发生的所有付款事件之和 + 一次性客户端费用
  const totalCashSpend = roundTo(singlePaymentTotal * paymentEventsCount + clientCost);

  // 月均折算成本
  const averageMonthlyCost = roundTo(totalCashSpend / input.comparisonMonths);

  assumptions.push(`在 ${input.comparisonMonths} 个月的比较期内，按 ${input.billingCycle} 周期共发生 ${paymentEventsCount} 次全额支付事件。`);
  if (paymentEventsCount * cycleMonths > input.comparisonMonths) {
    assumptions.push(`周期剩余未消费时长不代表服务商承诺按日按比例退款，总现金支出按已发生的不可撤销预付计算。`);
  }

  // 3. 流量与每GB成本
  let effectiveQuotaGB: number | null = null;
  let costPerQuotaGB: number | null = null;
  let costPerActualGB: number | '不可计算' = '不可计算';

  if (isValidPositiveNumber(input.quotaGB)) {
    const multiplier = isValidPositiveNumber(input.multiplier) ? input.multiplier : 1;
    effectiveQuotaGB = roundTo(input.quotaGB / multiplier);
    costPerQuotaGB = roundTo(singlePaymentPlanPrice / input.quotaGB);

    assumptions.push(`标称周期流量 ${input.quotaGB}GB，按综合倍率 ${multiplier} 计算，折合真实可用传输额度为 ${effectiveQuotaGB}GB。`);

    if (isValidPositiveNumber(input.actualUsageGB)) {
      // 当期实际用量消耗成本 = 当期套餐费 / 当期实际用量
      costPerActualGB = roundTo(singlePaymentPlanPrice / input.actualUsageGB);
    } else {
      costPerActualGB = '不可计算';
      assumptions.push('实际月用量为 0 或未填，实际单 GB 成本无分母，标记为不可计算。');
    }
  }

  return {
    success: true,
    data: {
      currency: input.currency || 'CNY',
      firstPaymentCash,
      totalCashSpend,
      averageMonthlyCost,
      effectiveQuotaGB,
      costPerQuotaGB,
      costPerActualGB,
      paymentEventsCount,
      assumptions
    },
    assumptions
  };
}
