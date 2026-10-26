<template>
  <div class="calculator-card" data-pagefind-ignore>
    <div class="calc-header">
      <div class="calc-badge">续期与生命周期评估</div>
      <h3>续费成本与换站迁移预算评估器</h3>
      <p class="calc-sub">以既有订单为基准核算下一期净实付，评估升级补差与换站双订阅冗余</p>
    </div>

    <div class="calc-grid">
      <div class="form-group">
        <label for="r-price">下期套餐续费原价 (元)</label>
        <input id="r-price" type="number" min="1" v-model.number="renewalPrice" />
      </div>
      <div class="form-group">
        <label for="r-balance">账户可用充值现金余额 (元)</label>
        <input id="r-balance" type="number" min="0" v-model.number="accountBalance" />
      </div>
      <div class="form-group">
        <label for="r-promo">活动赠送/体验金余额 (元)</label>
        <input id="r-promo" type="number" min="0" v-model.number="promotionalCredit" />
      </div>
      <div class="form-group">
        <label for="r-upgrade">升档补差预计费用 (元，可选)</label>
        <input id="r-upgrade" type="number" min="0" v-model.number="upgradeDiff" />
      </div>
      <div class="form-group">
        <label for="r-mig-months">考虑换站时的双订阅过渡月数</label>
        <input id="r-mig-months" type="number" min="0" max="6" v-model.number="migrationMonths" />
      </div>
      <div class="form-group">
        <label for="r-mig-price">替代新服务的月付费用 (元/月)</label>
        <input id="r-mig-price" type="number" min="0" v-model.number="altPrice" />
      </div>
    </div>

    <div v-if="result.success && result.data" class="calc-results">
      <div class="result-highlight-row">
        <div class="highlight-box">
          <div class="h-label">下一期净掏出现金</div>
          <div class="h-val">¥{{ result.data.nextCycleNetCash }}</div>
          <div class="h-note">已自动扣减赠金与现金余额</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">抵扣体验金</div>
          <div class="h-val">¥{{ result.data.promoCreditDeducted }}</div>
          <div class="h-note">优先消耗不可提现赠金</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">抵扣现金余额</div>
          <div class="h-val">¥{{ result.data.balanceDeducted }}</div>
          <div class="h-note">消耗已有充值余额</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">换站迁移过渡成本</div>
          <div class="h-val">¥{{ result.data.migrationCostTotal }}</div>
          <div class="h-note">{{ migrationMonths }} 个月并行保障成本</div>
        </div>
      </div>

      <div class="calc-assumptions">
        <strong>评估说明：</strong>
        <ul>
          <li v-for="(asm, idx) in result.data.assumptions" :key="idx">{{ asm }}</li>
        </ul>
      </div>

      <div class="calc-cta-bridge">
        <a :href="handoffUrl" target="_blank" rel="noopener noreferrer" class="cta-link-btn">
          前往主站「机场榜一」挑选迁移备选机场与稳定度评测 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateRenewalCost } from '@lib/calc';
import { buildMainSiteHandoffUrl } from '@lib/links/handoff';

const renewalPrice = ref(100);
const accountBalance = ref(15);
const promotionalCredit = ref(20);
const upgradeDiff = ref(0);
const migrationMonths = ref(1);
const altPrice = ref(25);

const result = computed(() => {
  return calculateRenewalCost({
    currentPlanRenewalPrice: renewalPrice.value,
    accountBalance: accountBalance.value,
    promotionalCredit: promotionalCredit.value,
    upgradePriceDiff: upgradeDiff.value,
    migrationParallelMonths: migrationMonths.value,
    alternativeMonthlyPrice: altPrice.value
  });
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: 'compare',
    campaign: 'renewal_eval',
    content: 'renewal_estimator_result'
  });
});
</script>

<style scoped>
.calculator-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}
.calc-header { margin-bottom: 1.25rem; }
.calc-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.calc-header h3 { margin: 0 0 0.25rem; font-size: 1.25rem; color: #0f172a; }
.calc-sub { margin: 0; font-size: 0.875rem; color: #64748b; }
.calc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.form-group { display: flex; flex-direction: column; gap: 0.35rem; }
.form-group label { font-size: 0.8125rem; font-weight: 500; color: #334155; }
.form-group input {
  padding: 0.5rem 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
  background: #ffffff;
  color: #0f172a;
}
.calc-results {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.25rem;
}
.result-highlight-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.highlight-box {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}
.h-label { font-size: 0.75rem; color: #475569; }
.h-val { font-size: 1.35rem; font-weight: 700; color: #0369a1; margin: 0.2rem 0; }
.h-note { font-size: 0.7rem; color: #94a3b8; }
.calc-assumptions {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}
.calc-assumptions ul { margin: 0.25rem 0 0; padding-left: 1.25rem; }
.calc-cta-bridge { margin-top: 1.25rem; text-align: center; }
.cta-link-btn {
  display: inline-block;
  background: #0284c7;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
}
.cta-link-btn:hover { background: #0369a1; }
</style>
