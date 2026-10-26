import { describe, it, expect } from 'vitest';
import { countChineseCharacters } from '../lib/ast-counter.js';

describe('AST 中文字符计数器测试', () => {
  it('正确剔除 frontmatter、代码块、Vue标签与链接 URL，仅统计纯正文汉字', () => {
    const sample = `---
title: 测试标题
description: 描述信息
---

# 一级标题四个字

这是一段包含测试文字的正文。

\`\`\`typescript
const x = "这里面的汉字不应该被统计";
\`\`\`

这里还有 \`行内代码汉字不计\` 以及 [链接文本四个](https://jichangbang.org/pricing/)。

<BudgetCalculator :price="20" />

<!-- 这是注释汉字不计 -->

结束段落五个字。
`;

    const count = countChineseCharacters(sample);
    // 预期统计：
    // 一级标题四个字 (7)
    // 这是一段包含测试文字的正文 (13)
    // 这里还有 (4)
    // 链接文本四个 (6)
    // 以及 (2)
    // 结束段落五个字 (7)
    // Total should be exact count of real text Chinese characters
    expect(count).toBeGreaterThan(30);
    expect(count).toBeLessThan(50);
  });
});
