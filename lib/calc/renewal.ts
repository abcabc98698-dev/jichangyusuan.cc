import { RenewalInput, RenewalOutput, ValidationResult } from './types.js';
import { roundTo, isValidPositiveNumber, isNonNegativeNumber } from './math-utils.js';

export function calculateRenewalCost(input: RenewalInput): ValidationResult<RenewalOutput> {
  const assumptions: string[] = ['纯演算：以当前既有订阅和账单为前提，不计未明确的退款或违约扣费。'];

  if (!isValidPositiveNumber(input.currentPlanRenewalPrice)) {
    return { success: false, error: '续费报价必须为大于 0 的有效数值', assumptions };
  }

  const renewalPrice = input.currentPlanRenewalPrice;
  const upgradeDiff = isNonNegativeNumber(input.upgradePriceDiff) ? input.upgradePriceDiff : 0;
  const baseTargetPrice = renewalPrice + upgradeDiff;

  // 抵扣顺序：先抵扣赠送/活动体验金，再抵扣账户现金余额
  const promoCredit = isNonNegativeNumber(input.promotionalCredit) ? input.promotionalCredit : 0;
  const accountCash = isNonNegativeNumber(input.accountBalance) ? input.accountBalance : 0;

  const promoCreditDeducted = Math.min(baseTargetPrice, promoCredit);
  const remainingAfterPromo = baseTargetPrice - promoCreditDeducted;

  const balanceDeducted = Math.min(remainingAfterPromo, accountCash);
  const nextCycleNetCash = roundTo(Math.max(0, remainingAfterPromo - balanceDeducted));

  // 迁移过渡成本
  const migrationMonths = isNonNegativeNumber(input.migrationParallelMonths) ? input.migrationParallelMonths : 0;
  const altPrice = isNonNegativeNumber(input.alternativeMonthlyPrice) ? input.alternativeMonthlyPrice : 0;
  const migrationCostTotal = roundTo(migrationMonths * altPrice);

  if (promoCreditDeducted > 0) {
    assumptions.push(`抵扣活动赠送余额 ${promoCreditDeducted} 元（不可提现，仅限抵扣账单）。`);
  }
  if (balanceDeducted > 0) {
    assumptions.push(`抵扣账户实际充值现金余额 ${balanceDeducted} 元。`);
  }
  if (migrationCostTotal > 0) {
    assumptions.push(`换服务并行过渡 ${migrationMonths} 个月，预留双订阅冗余支出 ${migrationCostTotal} 元。`);
  }

  return {
    success: true,
    data: {
      nextCycleNetCash,
      balanceDeducted,
      promoCreditDeducted,
      migrationCostTotal,
      assumptions
    },
    assumptions
  };
}
