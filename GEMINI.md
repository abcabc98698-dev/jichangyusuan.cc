# 机场预算（jichangyusuan.cc）项目入口指南 (GEMINI.md)

## 1. 核心约束与必须执行准则
- **本站域名**：`https://jichangyusuan.cc`
- **唯一主站**：`https://jichangbang.org`（“机场榜一”）
- **固定技术栈**：VitePress + TypeScript + Vue 3 组件 + Pagefind 全文搜索 + Apache 静态部署。
- **严禁替换技术栈**：严禁引入 Astro、Nuxt、WordPress、Algolia 或动态服务端/数据库。
- **节点规模**：1 首页 + 13 主专题 + 26 二级专题 + 104 三级集群 + 416 独立深度文章 = 560 规划节点（144 聚合页 + 416 文章）。
- **计算逻辑**：必须在前端/浏览器纯内存运算（十进制精准整数算法或纯函数），不采集用户输入，不向服务端发送敏感预算。

## 2. 常用开发与构建脚本
- `pnpm dev`：启动 VitePress 本地实时开发服务器（以 `site/generated` 为文档根目录）。
- `pnpm content:plan`：根据数据模型与选题清单校验 560 节点注册表（`data/registry.json`）与关系图谱（`data/graph.json`）。
- `pnpm content:prepare`：将处于 `published` 状态的内容编译同步到 `site/generated/`，生成静态目录与侧边栏。
- `pnpm check:structure`：校验 13x2x4x4 层级、ID 与 URL 唯一性及父子关系闭环。
- `pnpm check:content`：由 AST 校验汉字字数与结构要求。
- `pnpm check:links`：检查站内锚点、深层链接及主站转介链接的完整性。
- `pnpm test`：执行 Vitest 单元测试，覆盖五大计算器和核心纯函数。
- `pnpm build`：完整构建流程：校验 ➔ 同步内容 ➔ VitePress 静态编译 ➔ Pagefind 离线全文索引构建 ➔ 产物检查。
- `pnpm preview`：基于生产构建产物（`site/dist`）启动本地静态服务预览。

## 3. 工作流程与目录边界
- `content/`：正式 Markdown 源码，每页均为 `[slug]/index.md`。
- `data/`：核心数据源（注册表、图谱、套餐库、品牌库、优惠情报库、信源库）。
- `lib/`：纯函数库（计算器数学模型、URL/UTM 转介构造器、AST 统计工具）。
- `site/`：VitePress 核心配置、自定义主题、Vue 互动组件。
- `site/generated/`：受控生成的静态文档目录（自动从 `content/` 同步 `published` 节点）。
- `deploy/`：Apache 部署配置（`.htaccess`、VirtualHost 示例）。
