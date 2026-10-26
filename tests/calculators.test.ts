import { describe, it, expect } from 'vitest';
import { 
  calculateBudget, 
  compareMonthlyAnnual, 
  calculateDiscount, 
  calculateTrafficCost, 
  calculateRenewalCost 
} from '../lib/calc/index.js';
import { buildMainSiteHandoffUrl } from '../lib/links/handoff.js';

describe('契约测试：五大纯函数计算库与算例校验', () => {

  describe('1. 月付与年付对比演算 (compareMonthlyAnnual)', () => {
    it('月付15元、年付120元：第8个月相等 (120/120)，6个月90/120，12个月180/120', () => {
      const res = compareMonthlyAnnual({
        monthlyPlanPrice: 15,
        annualPlanPrice: 120,
        comparisonMonths: 12
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (!res.data) return;

      const t = res.data.timeline;
      // 6个月: 月付 90, 年付 120
      const m6 = t.find(p => p.month === 6);
      expect(m6?.monthlyCumulativeCash).toBe(90);
      expect(m6?.annualCumulativeCash).toBe(120);

      // 8个月: 月付 120, 年付 120 (平衡点)
      const m8 = t.find(p => p.month === 8);
      expect(m8?.monthlyCumulativeCash).toBe(120);
      expect(m8?.annualCumulativeCash).toBe(120);
      expect(res.data.breakEvenMonth).toBe(8);

      // 12个月: 月付 180, 年付 120
      const m12 = t.find(p => p.month === 12);
      expect(m12?.monthlyCumulativeCash).toBe(180);
      expect(m12?.annualCumulativeCash).toBe(120);

      // 年付120折算10元/月，但首付款仍为120元，首付款差额105元
      expect(res.data.annualEquivalentMonthly).toBe(10);
      expect(res.data.firstPaymentDifference).toBe(105);
    });

    it('异常输入应返回明确校验失败，而非 NaN 或崩溃', () => {
      const resNegative = compareMonthlyAnnual({
        monthlyPlanPrice: -15,
        annualPlanPrice: 120,
        comparisonMonths: 12
      });
      expect(resNegative.success).toBe(false);
      expect(resNegative.error).toContain('必须为大于 0');

      const resZero = compareMonthlyAnnual({
        monthlyPlanPrice: 15,
        annualPlanPrice: 0,
        comparisonMonths: 12
      });
      expect(resZero.success).toBe(false);
    });
  });

  describe('2. 折扣与满减核算 (calculateDiscount)', () => {
    it('120元八折为96元', () => {
      const res = calculateDiscount({
        baseAmount: 120,
        discountRate: 0.8
      });
      expect(res.success).toBe(true);
      expect(res.data?.finalAmount).toBe(96);
      expect(res.data?.savedAmount).toBe(24);
    });

    it('次序未知时返回“待确认”，不能默认最优惠排列', () => {
      const res = calculateDiscount({
        baseAmount: 120,
        discountRate: 0.8,
        fixedOff: 10,
        minSpendThreshold: 100,
        stackingRule: 'unknown'
      });
      expect(res.success).toBe(true);
      expect(res.data?.finalAmount).toBe('待确认');
      expect(res.data?.status).toBe('unknown_order');
    });

    it('明确允许“先八折再减10元”时结果为86元', () => {
      const res = calculateDiscount({
        baseAmount: 120,
        discountRate: 0.8,
        fixedOff: 10,
        minSpendThreshold: 100,
        stackingRule: 'percentage_then_fixed'
      });
      expect(res.success).toBe(true);
      expect(res.data?.finalAmount).toBe(86);
      expect(res.data?.savedAmount).toBe(34);
    });

    it('优惠资格不符合时返回原因与原价，而非折扣价格', () => {
      const res = calculateDiscount({
        baseAmount: 120,
        discountRate: 0.8,
        isEligible: false
      });
      expect(res.success).toBe(true);
      expect(res.data?.finalAmount).toBe(120);
      expect(res.data?.savedAmount).toBe(0);
      expect(res.data?.status).toBe('ineligible');
      expect(res.data?.explanation).toContain('未满足该优惠的适用资格');
    });

    it('满减大于套餐价格时金额封顶为0，不可为负', () => {
      const res = calculateDiscount({
        baseAmount: 50,
        fixedOff: 80,
        minSpendThreshold: 0
      });
      expect(res.success).toBe(true);
      expect(res.data?.finalAmount).toBe(0);
      expect(res.data?.savedAmount).toBe(50);
    });
  });

  describe('3. 流量与倍率成本 (calculateTrafficCost)', () => {
    it('10元/100GB额度、实际用40GB、倍率1：额度0.10元/GB，实际用量0.25元/GB', () => {
      const res = calculateTrafficCost({
        planPrice: 10,
        nominalQuotaGB: 100,
        multiplier: 1,
        actualUsageGB: 40
      });
      expect(res.success).toBe(true);
      expect(res.data?.unitCostByQuota).toBe(0.1);
      expect(res.data?.unitCostByActualUsage).toBe(0.25);
    });

    it('用量为0时实际单位成本显示“不可计算”，不输出 Infinity', () => {
      const resZero = calculateTrafficCost({
        planPrice: 10,
        nominalQuotaGB: 100,
        multiplier: 1,
        actualUsageGB: 0
      });
      expect(resZero.success).toBe(true);
      expect(resZero.data?.unitCostByActualUsage).toBe('不可计算');
    });

    it('100GB额度且统一倍率2，对应50GB实际传输预算', () => {
      const res = calculateTrafficCost({
        planPrice: 20,
        nominalQuotaGB: 100,
        multiplier: 2
      });
      expect(res.success).toBe(true);
      expect(res.data?.effectiveBudgetGB).toBe(50);
      expect(res.data?.unitCostByEffectiveBudget).toBe(0.4);
    });

    it('倍率0或负数应校验拦截', () => {
      const res = calculateTrafficCost({
        planPrice: 20,
        nominalQuotaGB: 100,
        multiplier: 0
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('倍率必须为大于 0');
    });
  });

  describe('4. 预算与总成本 (calculateBudget)', () => {
    it('月付20元、客户端买断40元、观察6个月现金支出160元，月均26.67元', () => {
      const res = calculateBudget({
        currency: 'CNY',
        planPrice: 20,
        billingCycle: 'monthly',
        comparisonMonths: 6,
        clientOneTimeCost: 40
      });
      expect(res.success).toBe(true);
      expect(res.data?.firstPaymentCash).toBe(60); // 20 + 40
      expect(res.data?.totalCashSpend).toBe(160); // 20*6 + 40
      expect(res.data?.averageMonthlyCost).toBe(26.67);
      expect(res.data?.paymentEventsCount).toBe(6);
    });
  });

  describe('5. 续费与抵扣成本 (calculateRenewalCost)', () => {
    it('续费100元，有赠送体验金20元、账户充值现金15元，下一期净实付65元', () => {
      const res = calculateRenewalCost({
        currentPlanRenewalPrice: 100,
        promotionalCredit: 20,
        accountBalance: 15
      });
      expect(res.success).toBe(true);
      expect(res.data?.promoCreditDeducted).toBe(20);
      expect(res.data?.balanceDeducted).toBe(15);
      expect(res.data?.nextCycleNetCash).toBe(65);
    });
  });

  describe('6. 主站安全转介 UTM 链接', () => {
    it('安全生成主站 Pricing 承接 URL，包含安全参数且无用户隐私', () => {
      const url = buildMainSiteHandoffUrl({
        target: 'pricing',
        campaign: 'budget_selection',
        content: 'home_calc_result'
      });

      expect(url).toContain('https://jichangbang.org/pricing/');
      expect(url).toContain('utm_source=jichangyusuan.cc');
      expect(url).toContain('utm_medium=referral');
      expect(url).toContain('utm_campaign=budget_selection');
      expect(url).toContain('utm_content=home_calc_result');
      expect(url).not.toContain('planPrice');
      expect(url).not.toContain('quotaGB');
    });
  });
});
