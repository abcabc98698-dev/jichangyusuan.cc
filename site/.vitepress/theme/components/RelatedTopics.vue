<template>
  <div class="related-topics-card">
    <div class="rt-header">
      <span class="rt-badge">关联知识图谱</span>
      <h4>深入核算与后续操作</h4>
    </div>

    <div class="rt-grid">
      <div v-if="prerequisites && prerequisites.length" class="rt-col">
        <div class="rt-cat-title">前置概念与前提</div>
        <ul>
          <li v-for="(item, idx) in prerequisites" :key="idx">
            <a :href="item.url">{{ item.title }}</a>
          </li>
        </ul>
      </div>

      <div v-if="comparisons && comparisons.length" class="rt-col">
        <div class="rt-cat-title">横向比较与取舍</div>
        <ul>
          <li v-for="(item, idx) in comparisons" :key="idx">
            <a :href="item.url">{{ item.title }}</a>
          </li>
        </ul>
      </div>

      <div v-if="nextSteps && nextSteps.length" class="rt-col">
        <div class="rt-cat-title">下一步核验与复盘</div>
        <ul>
          <li v-for="(item, idx) in nextSteps" :key="idx">
            <a :href="item.url">{{ item.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface TopicLink {
  title: string;
  url: string;
}

defineProps<{
  prerequisites?: TopicLink[];
  comparisons?: TopicLink[];
  nextSteps?: TopicLink[];
}>();
</script>

<style scoped>
.related-topics-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin: 2.5rem 0;
}
.rt-header { margin-bottom: 1rem; }
.rt-badge {
  display: inline-block;
  font-size: 0.725rem;
  font-weight: 700;
  color: #0369a1;
  background: #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 0.35rem;
}
.rt-header h4 { margin: 0; font-size: 1.15rem; color: #0f172a; }
.rt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}
.rt-cat-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.25rem;
}
.rt-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.rt-col a {
  color: #0284c7;
  text-decoration: none;
  font-size: 0.85rem;
  line-height: 1.4;
  display: block;
}
.rt-col a:hover {
  text-decoration: underline;
}
</style>
