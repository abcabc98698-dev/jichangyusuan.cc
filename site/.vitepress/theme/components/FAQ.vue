<template>
  <div class="faq-container">
    <div class="faq-header">
      <span class="faq-badge">FAQ</span>
      <h3>常见问题与核算边界</h3>
    </div>

    <div class="faq-list">
      <div 
        v-for="(item, idx) in items" 
        :key="idx" 
        class="faq-card"
        :class="{ 'faq-open': openIndex === idx }"
      >
        <button 
          class="faq-question" 
          @click="toggle(idx)"
          :aria-expanded="openIndex === idx"
        >
          <span class="q-text">{{ item.question }}</span>
          <span class="q-icon">{{ openIndex === idx ? '−' : '+' }}</span>
        </button>
        <div v-show="openIndex === idx" class="faq-answer">
          <p>{{ item.answer }}</p>
          <div v-if="item.evidence" class="faq-evidence">
            <span class="e-label">依据来源：</span>
            <span>{{ item.evidence }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface FAQItem {
  question: string;
  answer: string;
  evidence?: string;
}

const props = defineProps<{
  items: FAQItem[];
}>();

const openIndex = ref<number | null>(0); // 默认展开第1条

function toggle(idx: number) {
  openIndex.value = openIndex.value === idx ? null : idx;
}
</script>

<style scoped>
.faq-container {
  margin: 2.5rem 0;
}
.faq-header {
  margin-bottom: 1.25rem;
}
.faq-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}
.faq-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.faq-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-card:hover {
  border-color: #cbd5e1;
}
.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}
.q-icon {
  font-size: 1.25rem;
  color: #64748b;
  margin-left: 0.5rem;
}
.faq-answer {
  padding: 0 1.25rem 1.15rem;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.65;
  border-top: 1px solid #f1f5f9;
}
.faq-answer p {
  margin: 0.75rem 0 0;
}
.faq-evidence {
  margin-top: 0.6rem;
  font-size: 0.75rem;
  color: #94a3b8;
}
.e-label {
  font-weight: 600;
  color: #64748b;
}
</style>
