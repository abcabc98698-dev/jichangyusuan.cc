<template>
  <div class="calculator-card" data-pagefind-ignore>
    <div class="calc-header">
      <div class="calc-badge">优惠算术核验</div>
      <h3>折扣与满减叠加计算器</h3>
      <p class="calc-sub">先查资格、再看门槛、严格核对叠加次序，拒绝虚标优惠</p>
    </div>

    <div class="calc-grid">
      <div class="form-group">
        <label for="d-base">套餐基准原价 (元)</label>
        <input id="d-base" type="number" min="1" v-model.number="baseAmount" />
      </div>
      <div class="form-group">
        <label for="d-rate">折扣比例 (如 0.8 代表八折/减20%)</label>
        <input id="d-rate" type="number" min="0.1" max="1" step="0.05" v-model.number="discountRate" />
      </div>
      <div class="form-group">
        <label for="d-fixed">固定立减金额 (元，可选)</label>
        <input id="d-fixed" type="number" min="0" v-model.number="fixedOff" />
      </div>
      <div class="form-group">
        <label for="d-threshold">满减使用门槛 (元，可选)</label>
        <input id="d-threshold" type="number" min="0" v-model.number="minSpendThreshold" />
      </div>
      <div class="form-group">
        <label for="d-rule">叠加次序核验状态</label>
        <select id="d-rule" v-model="stackingRule">
          <option value="unknown">未公开/待核验 (严禁默认最优)</option>
          <option value="percentage_then_fixed">允许先打折再满减</option>
          <option value="fixed_then_percentage">允许先满减再打折</option>
          <option value="single_best">互斥，仅取优惠力度较大者</option>
        </select>
      </div>
      <div class="form-group">
        <label for="d-eligible">优惠资格是否匹配</label>
        <select id="d-eligible" v-model="isEligible">
          <option :value="true">符合适用资格 (新用户/首单/指定套餐)</option>
          <option :value="false">不符合资格 (老用户/排除套餐/已超期)</option>
        </select>
      </div>
    </div>

    <div v-if="result.success && result.data" class="calc-results">
      <div class="result-highlight-row">
        <div class="highlight-box">
          <div class="h-label">最终结算实付</div>
          <div class="h-val">
            <span v-if="result.data.finalAmount !== '待确认'">¥{{ result.data.finalAmount }}</span>
            <span v-else class="text-orange">待确认</span>
          </div>
          <div class="h-note">{{ result.data.appliedOrder }}</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">实际减免节省</div>
          <div class="h-val">
            <span v-if="result.data.savedAmount !== '待确认'">¥{{ result.data.savedAmount }}</span>
            <span v-else class="text-orange">待核验</span>
          </div>
          <div class="h-note">相对于基准标价</div>
        </div>
        <div class="highlight-box">
          <div class="h-label">综合实付折扣率</div>
          <div class="h-val">
            <span v-if="result.data.effectiveDiscountRate !== null">{{ (result.data.effectiveDiscountRate * 10).toFixed(1) }} 折</span>
            <span v-else>--</span>
          </div>
          <div class="h-note">折后占原价比重</div>
        </div>
      </div>

      <div class="discount-explanation">
        <strong>核算说明：</strong> {{ result.data.explanation }}
      </div>

      <div class="calc-cta-bridge">
        <a :href="handoffUrl" target="_blank" rel="noopener noreferrer" class="cta-link-btn">
          前往主站「机场榜一」核验现行有效优惠码与历史价格 →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { calculateDiscount, StackingRule } from '@lib/calc';
import { buildMainSiteHandoffUrl } from '@lib/links/handoff';

const baseAmount = ref(120);
const discountRate = ref(0.8);
const fixedOff = ref(10);
const minSpendThreshold = ref(100);
const stackingRule = ref<StackingRule>('percentage_then_fixed');
const isEligible = ref(true);

const result = computed(() => {
  return calculateDiscount({
    baseAmount: baseAmount.value,
    discountRate: discountRate.value,
    fixedOff: fixedOff.value,
    minSpendThreshold: minSpendThreshold.value,
    stackingRule: stackingRule.value,
    isEligible: isEligible.value
  });
});

const handoffUrl = computed(() => {
  return buildMainSiteHandoffUrl({
    target: 'pricing',
    campaign: 'discount_audit',
    content: 'discount_calculator_result'
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
.h-label { font-size: 0.75rem; color: #475569; }
.h-val { font-size: 1.35rem; font-weight: 700; color: #0369a1; margin: 0.2rem 0; }
.h-note { font-size: 0.7rem; color: #94a3b8; }
.text-orange { color: #d97706; }
.discount-explanation {
  font-size: 0.85rem;
  color: #334155;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 0.5rem;
}
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
