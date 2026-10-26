import { TrafficCostInput, TrafficCostOutput, ValidationResult } from './types.js';
import { roundTo, isValidPositiveNumber, isNonNegativeNumber } from './math-utils.js';

export function calculateTrafficCost(input: TrafficCostInput): ValidationResult<TrafficCostOutput> {
  const assumptions: string[] = ['纯演算：流量按服务计量口径核算，倍率按统一节点加权折算。'];

  if (!isValidPositiveNumber(input.planPrice)) {
    return { success: false, error: '套餐金额必须为大于 0 的有效数值', assumptions };
  }
  if (!isValidPositiveNumber(input.nominalQuotaGB)) {
    return { success: false, error: '标称流量额度必须为大于 0 的数值 (GB)', assumptions };
  }
  if (!isValidPositiveNumber(input.multiplier) || input.multiplier <= 0) {
    return { success: false, error: '倍率必须为大于 0 的有效数值，倍率不可为 0 或负数', assumptions };
  }

  const price = input.planPrice;
  const nominalGB = input.nominalQuotaGB;
  const multiplier = input.multiplier;

  // 真实可用传输预算 = 标称流量 / 节点倍率
  const effectiveBudgetGB = roundTo(nominalGB / multiplier, 2);

  // 按标称额度的单位成本 (元/GB)
  const unitCostByQuota = roundTo(price / nominalGB, 4);

  // 按真实可用传输预算的单位成本
  const unitCostByEffectiveBudget = roundTo(price / effectiveBudgetGB, 4);

  // 按实际消耗计算单位成本
  let unitCostByActualUsage: number | '不可计算' = '不可计算';
  if (isNonNegativeNumber(input.actualUsageGB) && input.actualUsageGB > 0) {
    unitCostByActualUsage = roundTo(price / input.actualUsageGB, 4);
    assumptions.push(`当期实际传输消耗 ${input.actualUsageGB}GB，实际摊到每 GB 的实付成本为 ${unitCostByActualUsage} 元/GB。`);
  } else {
    unitCostByActualUsage = '不可计算';
    assumptions.push('实际使用量为 0 或未填写，分母无意义，实际单位成本显示为“不可计算”，严禁输出 Infinity。');
  }

  assumptions.push(`标称 ${nominalGB}GB 额度在倍率 ${multiplier} 下，对应 ${effectiveBudgetGB}GB 实际传输预算。计量条件不同需重新核对。`);

  return {
    success: true,
    data: {
      effectiveBudgetGB,
      unitCostByQuota,
      unitCostByEffectiveBudget,
      unitCostByActualUsage,
      assumptions
    },
    assumptions
  };
}
