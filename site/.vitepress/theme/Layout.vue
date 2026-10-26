<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <div class="nav-search-slot">
        <SearchModal />
      </div>
    </template>

    <template #doc-before>
      <div v-if="isDoc" class="eeat-byline-banner" data-pagefind-ignore>
        <div class="byline-item author">
          <span class="byline-icon">✍️</span>
          <span>署名：<strong><a href="/about/">机场预算评估组 · 网络工程分析师</a></strong></span>
        </div>
        <span class="byline-dot">·</span>
        <div class="byline-item verify">
          <span class="byline-icon">🛡️</span>
          <span>最后核验：<time datetime="2026-10">2026年10月</time></span>
        </div>
        <span class="byline-dot">·</span>
        <div class="byline-item method">
          <span class="byline-icon">⚡</span>
          <span><a href="/methodology/">纯本地内存精算 · 零数据上传</a></span>
        </div>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import SearchModal from './components/SearchModal.vue';

const { frontmatter, page } = useData();

const isDoc = computed(() => {
  return frontmatter.value.layout !== 'home' && page.value.relativePath !== 'index.md';
});
</script>

<style scoped>
.nav-search-slot {
  display: flex;
  align-items: center;
  margin-left: 1rem;
}
@media (max-width: 768px) {
  .nav-search-slot {
    margin-left: 0.5rem;
  }
}

.eeat-byline-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8125rem;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.45rem 0.85rem;
  margin-bottom: 1.5rem;
}
.byline-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.byline-item a {
  color: #0284c7;
  text-decoration: none;
  font-weight: 500;
}
.byline-item a:hover {
  text-decoration: underline;
}
.byline-dot {
  color: #cbd5e1;
}
</style>
