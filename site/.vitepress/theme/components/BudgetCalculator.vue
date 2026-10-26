<template>
  <div class="calculator-card" data-pagefind-ignore>
    <div class="calc-header">
      <div class="calc-badge">纯函数精算工具</div>
      <h3>预算与总成本计算器</h3>
      <p class="calc-sub">先算清现金约束与周期实际扣费，再做选型决定</p>
    </div>

    <div class="calc-grid">
      <div class="form-group">
        <label for="b-price">套餐单期标价 (元)</label>
        <input id="b-price" type="number" min="1" step="1" v-model.number="price" />
      </div>

      <div class="form-group">
        <label for="b-cycle">付款周期</label>
        <select id="b-cycle" v-model="cycle">
          <option value="monthly">月付 (1个月)</option>
          <option value="quarterly">季付 (3个月)</option>
          <option value="semiannual">半年付 (6个月)</option>
          <option value="annual">年付 (12个月)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="b-months">评估对比期限 (月数)</label>
        <input id="b-months" type="number" min="1" max="36" v-model.number="months" />
      </div>

      <div class="form-group">
        <label for="b-client">一次性客户端软件费用 (元，可选)</label>
        <input id="b-client" type="number" min="0" v-model.number="clientCost" />
      </div>

      <div class="form-group">
        <label for="b-quota">周期标称流量额度 (GB，可选)</label>
        <input id="b-quota" type="number" min="0" v-model.number="quotaGB" />
      </div>

      <div class="form-group">
        <label for="b-multiplier">综合节点倍率 (默认 1.0)</label>
        <input id="b-multiplier" type="number" min="0.1" step="0.1" v-model.number="multiplier" />
      </div>

      <div class="form-group">
        <label for="b-usage">预计月度实际消耗量 (GB，可选)</label>
        <input id="b-usage" type="number" min="0" v-model.number="actualUsageGB" />
      </div>
    </div>

    <!-- 结果呈现 -->
    <div v-if="result.success && result.data" class="calc-results">
      <div class="result-highlight-row">
        <div class="highlight-box">
          <div class="h-label">首次掏出现金</div>
          <div class="h-val">¥{{ result.data.firstPaymentCash }}</div>
          <div class="h-note">含首期套餐+客户端买断</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">{{ months }}个月总现金支出</div>
          <div class="h-val">¥{{ result.data.totalCashSpend }}</div>
          <div class="h-note">共计扣款 {{ result.data.paymentEventsCount }} 次</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">月均折算成本</div>
          <div class="h-val">¥{{ result.data.averageMonthlyCost }} /月</div>
          <div class="h-note">纯数学折算，不代表可退款</div>
        </div>
      </div>

      <div v-if="result.data.effectiveQuotaGB" class="traffic-metrics-row">
        <div class="metric-item">
          <span class="m-title">经倍率换算可用额度：</span>
          <span class="m-val">{{ result.data.effectiveQuotaGB }} GB /期</span>
        </div>
        <div class="metric-item">
          <span class="m-title">标称额度单价：</span>
          <span class="m-val">¥{{ result.data.costPerQuotaGB }} /GB</span>
        </div>
        <div class="metric-item">
          <span class="m-title">实际消耗单价：</span>
          <span class="m-val">{{ result.data.costPerActualGB === '不可计算' ? '不可计算 (用量为0)' : `¥${result.data.costPerActualGB} /GB` }}</span>
        </div>
      </div>

      <div class="calc-assumptions">
        <strong>演算假设与约束：</strong>
        <ul>
          <li v-for="(asm, idx) in result.data.assumptions" :key="idx">{{ asm }}</li>
        </ul>
      </div>

      <div class="calc-cta-bridge">
        <a :href="handoffUrl" target="_blank" rel="nofollow sponsored noopener" class="cta-link-btn">
          带着预算去主站「机场榜一」选购符合条件的套餐 →
        </a>
      </div>
    </div>

    <div v-else class="calc-error">
      <p>{{ result.error || '请输入有效数值' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateBudget, BillingCycle } from '@lib/calc';
import { buildMainSiteHandoffUrl } from '@lib/links/handoff';

const price = ref(20);
const cycle = ref<BillingCycle>('monthly');
const months = ref(6);
const clientCost = ref(0);
const quotaGB = ref(100);
const multiplier = ref(1.0);
const actualUsageGB = ref(40);

const result = computed(() => {
  return calculateBudget({
    currency: 'CNY',
    planPrice: price.value,
    billingCycle: cycle.value,
    comparisonMonths: months.value,
    clientOneTimeCost: clientCost.value,
    quotaGB: quotaGB.value,
    multiplier: multiplier.value,
    actualUsageGB: actualUsageGB.value
  });
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: 'pricing',
    campaign: 'budget_selection',
    content: 'budget_calculator_result'
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.calc-header {
  margin-bottom: 1.25rem;
}
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
.calc-header h3 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  color: #0f172a;
}
.calc-sub {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}
.calc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #334155;
}
.form-group input, .form-group select {
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
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.highlight-box {
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
}
.h-label {
  font-size: 0.75rem;
  color: #475569;
}
.h-val {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0369a1;
  margin: 0.2rem 0;
}
.h-note {
  font-size: 0.7rem;
  color: #94a3b8;
}
.traffic-metrics-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px dashed #e2e8f0;
  border-bottom: 1px dashed #e2e8f0;
  font-size: 0.85rem;
}
.m-title {
  color: #64748b;
}
.m-val {
  font-weight: 600;
  color: #0f172a;
}
.calc-assumptions {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}
.calc-assumptions ul {
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
}
.calc-cta-bridge {
  margin-top: 1.25rem;
  text-align: center;
}
.cta-link-btn {
  display: inline-block;
  background: #0284c7;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s;
}
.cta-link-btn:hover {
  background: #0369a1;
}
.calc-error {
  padding: 1rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 6px;
}
</style>
