<template>
  <div class="calculator-card" data-pagefind-ignore>
    <div class="calc-header">
      <div class="calc-badge">流量与倍率精算</div>
      <h3>真实每GB传输成本与倍率换算</h3>
      <p class="calc-sub">揭示高倍率节点的隐性额度消耗，将计费流量换算为真实物理传输量</p>
    </div>

    <div class="calc-grid">
      <div class="form-group">
        <label for="t-price">当期套餐实付款 (元)</label>
        <input id="t-price" type="number" min="1" v-model.number="price" />
      </div>
      <div class="form-group">
        <label for="t-quota">标称计费流量额度 (GB)</label>
        <input id="t-quota" type="number" min="1" v-model.number="quotaGB" />
      </div>
      <div class="form-group">
        <label for="t-multi">常用节点倍率 (如 0.5x, 1.0x, 2.0x, 3.0x)</label>
        <input id="t-multi" type="number" min="0.1" step="0.1" v-model.number="multiplier" />
      </div>
      <div class="form-group">
        <label for="t-act">当期实际传输消耗量 (GB，可选)</label>
        <input id="t-act" type="number" min="0" v-model.number="actualUsageGB" />
      </div>
    </div>

    <div v-if="result.success && result.data" class="calc-results">
      <div class="result-highlight-row">
        <div class="highlight-box">
          <div class="h-label">真实可用传输预算</div>
          <div class="h-val">{{ result.data.effectiveBudgetGB }} GB</div>
          <div class="h-note">标称额度 ÷ 倍率 {{ multiplier }}x</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">标称额度单价</div>
          <div class="h-val">¥{{ result.data.unitCostByQuota }} /GB</div>
          <div class="h-note">不考虑倍率扣损的表象单价</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">真实传输单价</div>
          <div class="h-val">¥{{ result.data.unitCostByEffectiveBudget }} /GB</div>
          <div class="h-note">考虑倍率折算后的真实底价</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">实际用量实付单价</div>
          <div class="h-val">
            <span v-if="result.data.unitCostByActualUsage !== '不可计算'">¥{{ result.data.unitCostByActualUsage }} /GB</span>
            <span v-else class="text-gray">不可计算</span>
          </div>
          <div class="h-note">用量为0或未用满时的有效单价</div>
        </div>
      </div>

      <div class="calc-assumptions">
        <strong>核算说明：</strong>
        <ul>
          <li v-for="(asm, idx) in result.data.assumptions" :key="idx">{{ asm }}</li>
        </ul>
      </div>

      <div class="calc-cta-bridge">
        <a :href="handoffUrl" target="_blank" rel="nofollow sponsored noopener" class="cta-link-btn">
          前往主站「机场榜一」查看各家大流量套餐的倍率与限速实测 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateTrafficCost } from '@lib/calc';
import { buildMainSiteHandoffUrl } from '@lib/links/handoff';

const price = ref(10);
const quotaGB = ref(100);
const multiplier = ref(1.0);
const actualUsageGB = ref(40);

const result = computed(() => {
  return calculateTrafficCost({
    planPrice: price.value,
    nominalQuotaGB: quotaGB.value,
    multiplier: multiplier.value,
    actualUsageGB: actualUsageGB.value
  });
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: 'pricing',
    campaign: 'traffic_planning',
    content: 'traffic_calculator_result'
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
.text-gray { color: #64748b; font-size: 1rem !important; }
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
