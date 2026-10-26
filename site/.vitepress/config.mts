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

const PRIMARY_NAME_MAP: Record<string, string> = {
  budget: '预算计算',
  monthly: '月付比较',
  annual: '年付分析',
  discounts: '折扣核算',
  renewal: '续费成本',
  plans: '价格套餐',
  usage: '用量案例',
  'low-budget': '低预算方案',
  'high-data': '大流量方案',
  brands: '品牌数据库',
  'buying-checks': '购买避坑',
  offers: '优惠情报',
  knowledge: '知识百科',
  about: '关于我们',
  methodology: '评测方法论',
  privacy: '隐私政策',
  terms: '服务条款',
  disclosure: '商业披露'
};

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
    hostname: 'https://jichangyusuan.cc',
    transformItems(items) {
      const nowIso = new Date().toISOString();
      return items.map((item) => ({
        ...item,
        lastmod: nowIso
      }));
    }
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
    // 自动为每个页面动态生成自指规范 canonical 标签，彻底避免末尾多余双斜杠
    const cleanPath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
      .replace(/\/+$/, '');
    const canonicalUrl = `https://jichangyusuan.cc/${cleanPath ? `${cleanPath}/` : ''}`;

    const headTags: any[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:title', content: `${pageData.title || '机场预算'} ｜ 机场预算` }],
      ['meta', { property: 'og:description', content: pageData.description || '机场预算：月付年付费用计算与套餐选择' }]
    ];

    // 1. BreadcrumbList 结构化数据
    const segments = cleanPath ? cleanPath.split('/').filter(Boolean) : [];
    const breadcrumbItems: any[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://jichangyusuan.cc/'
      }
    ];

    if (segments.length > 0) {
      const primarySeg = segments[0];
      const primaryTitle = PRIMARY_NAME_MAP[primarySeg] || primarySeg;
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: primaryTitle,
        item: `https://jichangyusuan.cc/${primarySeg}/`
      });

      if (segments.length > 1) {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 3,
          name: pageData.title || '当前页面',
          item: canonicalUrl
        });
      }
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    };
    headTags.push(['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumbSchema)]);

    // 2. 首页添加 Organization & WebSite
    if (!cleanPath) {
      const orgAndWebSiteSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://jichangyusuan.cc/#organization',
            name: '机场预算',
            url: 'https://jichangyusuan.cc/',
            logo: {
              '@type': 'ImageObject',
              url: 'https://jichangyusuan.cc/avatar.jpg'
            },
            description: '专业机场预算分析与网络订阅费用精算独立知识库'
          },
          {
            '@type': 'WebSite',
            '@id': 'https://jichangyusuan.cc/#website',
            url: 'https://jichangyusuan.cc/',
            name: '机场预算',
            description: '客观透明的机场预算计算与网络服务费用模型',
            publisher: {
              '@id': 'https://jichangyusuan.cc/#organization'
            }
          }
        ]
      };
      headTags.push(['script', { type: 'application/ld+json' }, JSON.stringify(orgAndWebSiteSchema)]);
    } else {
      // 3. 内容与专题页面添加 TechArticle 结构化数据
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: pageData.title || '机场预算指南',
        description: pageData.description || '客观透明的机场预算与费用模型分析',
        url: canonicalUrl,
        inLanguage: 'zh-CN',
        datePublished: '2026-10-26T00:00:00+08:00',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: '机场预算技术评估组',
          url: 'https://jichangyusuan.cc/about/'
        },
        publisher: {
          '@type': 'Organization',
          name: '机场预算',
          url: 'https://jichangyusuan.cc/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://jichangyusuan.cc/avatar.jpg'
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      };
      headTags.push(['script', { type: 'application/ld+json' }, JSON.stringify(articleSchema)]);

      // 4. 解析页面内的 FAQ 并生成 FAQPage 结构化数据
      try {
        const fullFilePath = path.resolve(__dirname, '../generated', pageData.relativePath);
        if (fs.existsSync(fullFilePath)) {
          const fileContent = fs.readFileSync(fullFilePath, 'utf8');
          const qMatches = [...fileContent.matchAll(/question:\s*['"](.*?)['"]/g)];
          const aMatches = [...fileContent.matchAll(/answer:\s*['"]([\s\S]*?)['"],/g)];
          if (qMatches.length > 0 && aMatches.length > 0) {
            const count = Math.min(qMatches.length, aMatches.length);
            const faqSchema = {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [] as any[]
            };
            for (let i = 0; i < count; i++) {
              faqSchema.mainEntity.push({
                '@type': 'Question',
                name: qMatches[i][1],
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: aMatches[i][1].replace(/\\'/g, "'").trim()
                }
              });
            }
            headTags.push(['script', { type: 'application/ld+json' }, JSON.stringify(faqSchema)]);
          }
        }
      } catch (_) {}
    }

    return headTags;
  },

  themeConfig: {
    siteTitle: '机场预算',
    logo: { src: '/avatar.jpg', alt: '机场预算' },
    
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
      message: '机场预算（jichangyusuan.cc） - 独立客观的费用模型与防坑知识库 ｜ 唯一选购转介主站：机场榜一（jichangbang.org）<br><span style="display:inline-block;margin-top:0.35rem;font-size:0.85em;"><a href="/about/">关于我们</a> ｜ <a href="/methodology/">评测方法论</a> ｜ <a href="/privacy/">隐私政策</a> ｜ <a href="/terms/">服务条款</a> ｜ <a href="/disclosure/">商业披露</a></span>',
      copyright: 'Copyright © 2026 机场预算. 纯前端内存计算，不存储用户敏感配置.'
    }
  }
});
