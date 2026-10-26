<template>
  <div class="decision-tree-card">
    <div class="tree-header">
      <span class="tree-badge">决策引导树</span>
      <h4>{{ title || '预算与选型决策路径' }}</h4>
    </div>
    
    <div class="tree-body">
      <div v-for="(node, idx) in steps" :key="idx" class="tree-step">
        <div class="step-num">{{ idx + 1 }}</div>
        <div class="step-content">
          <div class="step-condition">{{ node.condition }}</div>
          <div class="step-action">
            <span class="action-arrow">➔</span>
            <strong>建议动作：</strong>{{ node.action }}
          </div>
          <div v-if="node.link" class="step-link">
            <a :href="node.link.url" :target="node.link.url.startsWith('http') ? '_blank' : undefined" :rel="node.link.url.startsWith('http') ? 'nofollow sponsored noopener' : undefined">{{ node.link.text }} →</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface DecisionStep {
  condition: string;
  action: string;
  link?: {
    text: string;
    url: string;
  };
}

defineProps<{
  title?: string;
  steps: DecisionStep[];
}>();
</script>

<style scoped>
.decision-tree-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
}
.tree-header { margin-bottom: 1.25rem; }
.tree-badge {
  display: inline-block;
  font-size: 0.725rem;
  font-weight: 700;
  color: #0d9488;
  background: #ccfbf1;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.35rem;
}
.tree-header h4 { margin: 0; font-size: 1.15rem; color: #0f172a; }
.tree-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.tree-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #ffffff;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.step-num {
  width: 28px;
  height: 28px;
  background: #0284c7;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.step-content {
  flex: 1;
  font-size: 0.875rem;
}
.step-condition {
  color: #1e293b;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.step-action {
  color: #475569;
  line-height: 1.5;
}
.action-arrow { color: #0284c7; margin-right: 0.25rem; }
.step-link {
  margin-top: 0.4rem;
}
.step-link a {
  color: #0284c7;
  font-weight: 500;
  font-size: 0.8125rem;
  text-decoration: none;
}
.step-link a:hover { text-decoration: underline; }
</style>
