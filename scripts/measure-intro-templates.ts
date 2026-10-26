import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('site/dist');

function walk(dir: string): string[] {
  let res: string[] = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) res = res.concat(walk(full));
    else if (item.endsWith('.html') && item !== '404.html') res.push(full);
  }
  return res;
}

const htmlFiles = walk(DIST_DIR);
let templateSentenceCount = 0;
let templateHeadingStructureCount = 0;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('切忌把年付折算价当成真实月花销，买网络服务必须以“首月最低实付”控制试错敞口')) {
    templateSentenceCount++;
  }
  if (html.includes('的物理交付事实与客观约束')) {
    templateHeadingStructureCount++;
  }
}

console.log(`Articles with common conclusion template: ${templateSentenceCount} / ${htmlFiles.length}`);
console.log(`Articles with "的物理交付事实与客观约束": ${templateHeadingStructureCount} / ${htmlFiles.length}`);
