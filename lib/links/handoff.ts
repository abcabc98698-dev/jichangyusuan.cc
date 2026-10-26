/**
 * 站群安全转介与 UTM 链接构造器
 * 严格按照 NETWORK_ROLE.md 和项目契约执行
 */

export const SATELLITE_CONFIG = {
  origin: 'https://jichangyusuan.cc',
  name: '机场预算',
  mainOrigin: 'https://jichangbang.org',
  mainName: '机场榜一'
} as const;

export type MainSiteHandoffTarget = 
  | 'pricing'     // 预算、价格方案与综合报价
  | 'compare'     // 双机场横向评测与迁移对比
  | 'recommend'   // 综合选购与排名榜单
  | 'reviews';    // 品牌事实与深度评测

export interface HandoffOptions {
  target: MainSiteHandoffTarget;
  campaign: string;    // e.g. 'budget_selection' | 'monthly_compare' | 'annual_analysis'
  content: string;     // e.g. 'home_calculator_result' | 'monthly_table_footer'
  subPath?: string;    // 如具体品牌详情，如 'reviews/xyz' (必须严格校验)
}

const ALLOWED_TARGET_PATHS: Record<MainSiteHandoffTarget, string> = {
  pricing: '/pricing/',
  compare: '/compare/',
  recommend: '/recommend/',
  reviews: '/reviews/'
};

/**
 * 构造安全的主站转介 URL
 */
export function buildMainSiteHandoffUrl(options: HandoffOptions): string {
  const basePath = ALLOWED_TARGET_PATHS[options.target] || '/recommend/';
  const finalPath = options.subPath ? `/${options.subPath.replace(/^\/+/, '')}` : basePath;
  
  const url = new URL(finalPath, SATELLITE_CONFIG.mainOrigin);
  
  url.searchParams.set('utm_source', 'jichangyusuan.cc');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', options.campaign.replace(/[^a-zA-Z0-9_-]/g, '_'));
  url.searchParams.set('utm_content', options.content.replace(/[^a-zA-Z0-9_-]/g, '_'));

  return url.toString();
}
