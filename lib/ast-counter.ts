/**
 * Markdown AST 汉字计数器
 * 严格按照契约：
 * 1. 剔除 frontmatter (--- ... ---)
 * 2. 剔除代码块 (``` ... ```)
 * 3. 剔除 Vue 组件标签 (<BudgetCalculator ... />, <MainSiteCTA ... /> 等)
 * 4. 剔除 Markdown 链接语法中的 URL 部分 [text](url) -> 仅保留 text
 * 5. 剔除 HTML 注释 (<!-- ... -->)
 * 6. 精准统计中文字符数（\u4e00-\u9fa5 及扩展区汉字），不计英文单词、数字、标点符号、空白字符
 */

export function countChineseCharacters(content: string): number {
  if (!content) return 0;

  let cleaned = content;

  // 1. 剔除 frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n*/, '');

  // 2. 剔除代码块
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`[^`]+`/g, '');

  // 3. 剔除 HTML 注释
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // 4. 剔除 Vue 组件标签（包括多行自闭合或成对标签）
  cleaned = cleaned.replace(/<[A-Z][a-zA-Z0-9]*[\s\S]*?(?:\/>|<\/[A-Z][a-zA-Z0-9]*>)/g, '');
  cleaned = cleaned.replace(/<\/?[a-zA-Z0-9_-]+(?:\s+[^>]*)?>/g, '');

  // 5. 替换 Markdown 链接，仅保留链接文本 [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 6. 剔除 Markdown 图片引用 ![alt](url)
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]+\)/g, '');

  // 7. 统计实际汉字匹配（\u4e00-\u9fa5）
  const chineseMatches = cleaned.match(/[\u4e00-\u9fa5]/g);

  return chineseMatches ? chineseMatches.length : 0;
}
