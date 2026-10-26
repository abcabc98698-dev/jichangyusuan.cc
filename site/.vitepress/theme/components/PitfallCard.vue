<template>
  <div class="pitfalls-container">
    <div class="pitfalls-header">
      <span class="p-badge">风险避坑</span>
      <h3 class="p-title">常见反例与边界思维陷阱</h3>
    </div>

    <div class="pitfalls-grid">
      <div 
        v-for="(item, idx) in items" 
        :key="idx" 
        class="pitfall-item-card"
        :class="{ 'card-danger': item.level === '高危', 'card-warning': item.level !== '高危' }"
      >
        <div class="item-head">
          <div class="item-badge-wrap">
            <span class="warning-icon">⚠️</span>
            <span class="level-tag" :class="item.level === '高危' ? 'level-high' : 'level-medium'">
              {{ item.level || '典型反例' }}
            </span>
          </div>
          <h4 class="item-title">{{ item.title }}</h4>
        </div>

        <p class="item-desc">{{ item.desc }}</p>

        <div v-if="item.action" class="item-solution">
          <span class="solution-tag">✅ 避坑对策：</span>
          <span class="solution-text">{{ item.action }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PitfallItem {
  title: string;
  desc: string;
  level?: '高危' | '中危' | '常踩' | string;
  action?: string;
}

defineProps<{
  items: PitfallItem[];
}>();
</script>

<style scoped>
.pitfalls-container {
  margin: 2.25rem 0;
}

.pitfalls-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.p-badge {
  background: #f59e0b;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.p-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.pitfalls-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.pitfall-item-card {
  background: #ffffff;
  border: 1px solid #fed7aa;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 1.15rem 1.35rem;
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.pitfall-item-card.card-danger {
  border-color: #fecaca;
  border-left-color: #ef4444;
  background: #fffafa;
}

.pitfall-item-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.05);
}

.item-head {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.item-badge-wrap {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.warning-icon {
  font-size: 1rem;
}

.level-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.level-high {
  background: #fee2e2;
  color: #dc2626;
}

.level-medium {
  background: #fef3c7;
  color: #d97706;
}

.item-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: #1e293b;
}

.item-desc {
  margin: 0 0 0.65rem 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: #475569;
}

.item-solution {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
}

.solution-tag {
  color: #059669;
  font-weight: 700;
  flex-shrink: 0;
}

.solution-text {
  color: #1e293b;
  line-height: 1.55;
}
</style>
