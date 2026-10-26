<template>
  <div class="search-wrapper" data-pagefind-ignore>
    <button class="search-trigger-btn" @click="openModal" aria-label="全站搜索">
      <span class="search-icon">🔍</span>
      <span class="search-placeholder">搜索文章、计算器或知识...</span>
      <kbd class="search-kbd">Ctrl K</kbd>
    </button>

    <div v-if="isOpen" class="search-modal-backdrop" @click="closeModal">
      <div class="search-modal-card" @click.stop>
        <div class="modal-input-bar">
          <span class="input-icon">🔍</span>
          <input 
            ref="inputRef"
            v-model="query" 
            type="text" 
            placeholder="输入关键词（如：年付折算、倍率、续费、优惠资格、月付）..." 
            @input="handleSearch"
            @keydown.esc="closeModal"
            @keydown.down.prevent="navigateResults(1)"
            @keydown.up.prevent="navigateResults(-1)"
            @keydown.enter="selectActiveResult"
          />
          <button class="close-btn" @click="closeModal" aria-label="关闭">✕</button>
        </div>

        <div class="modal-results-area">
          <div v-if="loading" class="search-status">正在检索...</div>
          <div v-else-if="errorMsg" class="search-status search-tip">{{ errorMsg }}</div>
          <div v-else-if="results.length > 0" class="results-list">
            <div 
              v-for="(item, idx) in results" 
              :key="idx" 
              class="result-item"
              :class="{ 'result-active': activeIndex === idx }"
              @mouseenter="activeIndex = idx"
              @click="goToResult(item.url)"
            >
              <div class="result-title">{{ item.meta?.title || '未命页面' }}</div>
              <div class="result-excerpt" v-html="item.excerpt"></div>
              <div class="result-url">{{ item.url }}</div>
            </div>
          </div>
          <div v-else-if="query.trim().length > 0" class="search-status">
            未找到包含 “{{ query }}” 的相关内容，请尝试更换关键词
          </div>
          <div v-else class="search-hint">
            支持搜索 560 个节点全站正文、公式演算、倍率换算及避坑清单
          </div>
        </div>

        <div class="modal-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> 切换</span>
          <span><kbd>Enter</kbd> 打开</span>
          <span><kbd>Esc</kbd> 关闭</span>
          <span class="pagefind-credit">Powered by Pagefind</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

interface SearchResultItem {
  url: string;
  excerpt: string;
  meta?: {
    title?: string;
  };
}

const isOpen = ref(false);
const query = ref('');
const loading = ref(false);
const errorMsg = ref('');
const results = ref<SearchResultItem[]>([]);
const activeIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

let pagefindInstance: any = null;

async function initPagefind() {
  if (pagefindInstance) return;
  if (typeof window === 'undefined') return;
  try {
    // 纯运行时动态导入，规避 Rollup 编译时静态解析
    const dynamicImport = new Function('url', 'return import(url)');
    const pf = await dynamicImport('/pagefind/pagefind.js');
    await pf.init();
    pagefindInstance = pf;
  } catch (err) {
    // 本地尚未生成 pagefind 产物时的友好提示
    errorMsg.value = '提示：全文检索索引将在构建阶段（pnpm build）自动生成，本地开发模式请先运行 pnpm build 查看完整 WASM 检索。';
  }
}

async function handleSearch() {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }

  if (!pagefindInstance) {
    await initPagefind();
  }

  if (!pagefindInstance) return;

  loading.value = true;
  errorMsg.value = '';

  try {
    const searchRes = await pagefindInstance.search(query.value);
    const topResults = searchRes.results.slice(0, 8);
    const loaded = await Promise.all(
      topResults.map((r: any) => r.data())
    );
    results.value = loaded;
    activeIndex.value = 0;
  } catch (err: any) {
    errorMsg.value = `搜索出错：${err.message || '未知错误'}`;
  } finally {
    loading.value = false;
  }
}

function openModal() {
  isOpen.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
  initPagefind();
}

function closeModal() {
  isOpen.value = false;
  query.value = '';
  results.value = [];
}

function navigateResults(dir: number) {
  if (!results.value.length) return;
  const next = activeIndex.value + dir;
  if (next >= 0 && next < results.value.length) {
    activeIndex.value = next;
  }
}

function selectActiveResult() {
  if (results.value.length > 0 && results.value[activeIndex.value]) {
    goToResult(results.value[activeIndex.value].url);
  }
}

function goToResult(url: string) {
  window.location.href = url;
  closeModal();
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    if (isOpen.value) closeModal();
    else openModal();
  } else if (e.key === 'Escape' && isOpen.value) {
    closeModal();
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style scoped>
.search-wrapper {
  display: inline-block;
}
.search-trigger-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.search-trigger-btn:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #1e293b;
}
.search-icon { font-size: 0.875rem; }
.search-placeholder { font-size: 0.8rem; }
.search-kbd {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.7rem;
  color: #475569;
}
.search-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}
.search-modal-card {
  width: 90%;
  max-width: 640px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 75vh;
}
.modal-input-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
}
.input-icon { font-size: 1.1rem; color: #94a3b8; }
.modal-input-bar input {
  flex: 1;
  border: none;
  font-size: 1rem;
  color: #0f172a;
  outline: none;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #94a3b8;
  cursor: pointer;
}
.close-btn:hover { color: #0f172a; }
.modal-results-area {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}
.search-status {
  padding: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}
.search-tip {
  color: #0369a1;
  background: #f0f9ff;
  border-radius: 6px;
  margin: 1rem;
  padding: 1rem;
}
.search-hint {
  padding: 2.5rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
}
.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.result-item {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.result-item:hover, .result-active {
  background: #f1f5f9;
}
.result-title {
  font-weight: 600;
  color: #0284c7;
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}
.result-excerpt {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.4;
}
.result-url {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}
.modal-footer {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.6rem 1.25rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  font-size: 0.75rem;
  color: #64748b;
}
.modal-footer kbd {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 3px;
  padding: 1px 4px;
}
.pagefind-credit {
  margin-left: auto;
  color: #94a3b8;
}
</style>
