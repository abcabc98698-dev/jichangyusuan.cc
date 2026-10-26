import { defineConfig } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';

// 从 data/registry.json 动态构建当前栏目侧边栏
function buildSidebarConfig() {
  const registryPath = path.resolve(__dirname, '../../data/registry.json');
  if (!fs.existsSync(registryPath)) {
    return {};
  }
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

  const primarySlugs = [
    'budget', 'monthly', 'annual', 'discounts', 'renewal',
    'plans', 'usage', 'low-budget', 'high-data', 'brands',
    'buying-checks', 'offers', 'knowledge'
  ];

  const sidebarConfig: Record<string, any[]> = {};

  for (const slug of primarySlugs) {
    const primaryNode = registry[slug];
    if (!primaryNode) continue;

    const routePrefix = `/${slug}/`;
    
    // 找出属于该频道的二级专题
    const secondaries = Object.values(registry).filter(
      (n: any) => n.kind === 'secondary' && n.parentId === slug
    );

    const sidebarItems: any[] = [
      {
        text: `★ ${primaryNode.title} 综述与总览`,
        link: primaryNode.url
      }
    ];

    for (const sec of secondaries as any[]) {
      // 找出属于该二级专题的三级集群
      const clusters = Object.values(registry).filter(
        (n: any) => n.kind === 'cluster' && n.parentId === sec.id
      );

      const clusterItems = clusters.map((clu: any) => {
        // 找出属于该集群的具体文章
        const articles = Object.values(registry).filter(
          (n: any) => n.kind === 'article' && n.parentId === clu.id
        );

        return {
          text: clu.title,
          collapsed: false,
          link: clu.url,
          items: articles.map((art: any) => ({
            text: art.title,
            link: art.url
          }))
        };
      });

      sidebarItems.push({
        text: `【${sec.title}】`,
        link: sec.url,
        collapsed: false,
        items: clusterItems
      });
    }

    sidebarConfig[routePrefix] = sidebarItems;
  }

  return sidebarConfig;
}

export default defineConfig({
  title: '机场预算',
  titleTemplate: ':title ｜ 机场预算',
  description: '机场预算：月付年付费用计算与套餐选择。算清首付现金约束、月均折算、倍率损耗、折扣叠加与续费迁移成本。',
  lang: 'zh-CN',
  base: '/',
  srcDir: 'generated',
  outDir: 'dist',
  cleanUrls: true,

  sitemap: {
    hostname: 'https://jichangyusuan.cc'
  },

  vite: {
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, '../../lib'),
        '@data': path.resolve(__dirname, '../../data')
      }
    }
  },

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'theme-color', content: '#0284c7' }],
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/avatar.jpg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/avatar.jpg' }],
    ['meta', { property: 'og:image', content: 'https://jichangyusuan.cc/avatar.jpg' }],
    ['meta', { property: 'og:site_name', content: '机场预算' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],

  transformHead({ pageData }) {
    // 自动为每个页面动态生成自指 canonical 标签
    const cleanPath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '');
    const canonicalUrl = `https://jichangyusuan.cc/${cleanPath ? `${cleanPath}/` : ''}`;

    return [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:title', content: `${pageData.title || '机场预算'} ｜ 机场预算` }],
      ['meta', { property: 'og:description', content: pageData.description || '机场预算：月付年付费用计算与套餐选择' }]
    ];
  },

  themeConfig: {
    siteTitle: '机场预算',
    logo: '/avatar.jpg',
    
    // 固定顶部顺序：首页｜预算计算｜月付比较｜年付分析｜折扣核算｜续费成本｜更多专题 ▾
    nav: [
      { text: '首页', link: '/' },
      { text: '预算计算', link: '/budget/' },
      { text: '月付比较', link: '/monthly/' },
      { text: '年付分析', link: '/annual/' },
      { text: '折扣核算', link: '/discounts/' },
      { text: '续费成本', link: '/renewal/' },
      {
        text: '更多专题 ▾',
        items: [
          { text: '价格套餐', link: '/plans/' },
          { text: '用量案例', link: '/usage/' },
          { text: '低预算方案', link: '/low-budget/' },
          { text: '大流量方案', link: '/high-data/' },
          { text: '品牌数据库', link: '/brands/' },
          { text: '购买避坑', link: '/buying-checks/' },
          { text: '优惠情报', link: '/offers/' },
          { text: '知识百科', link: '/knowledge/' }
        ]
      }
    ],

    sidebar: buildSidebarConfig(),

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    footer: {
      message: '机场预算（jichangyusuan.cc） - 独立客观的费用模型与防坑知识库 ｜ 唯一选购转介主站：机场榜一（jichangbang.org）',
      copyright: 'Copyright © 2026 机场预算. 纯前端内存计算，不存储用户敏感配置.'
    }
  }
});
