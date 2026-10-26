import fs from 'node:fs';
import path from 'node:path';

const reg = JSON.parse(fs.readFileSync('data/registry.json', 'utf-8'));
const arts = Object.values(reg).filter((n: any) => n.kind === 'article');

function getShingles(t: string) {
  const c = t.replace(/[\s\r\n\t#*`><|—\-\[\]\(\)]+/g, '');
  const s = new Set<string>();
  for (let i = 0; i < c.length - 4; i++) s.add(c.slice(i, i + 5));
  return s;
}

function jaccard(a: Set<string>, b: Set<string>) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

const loaded = arts.map((a: any) => ({
  id: a.id,
  url: a.url,
  cat: a.url.split('/')[1],
  clusterId: a.parentId,
  shingles: getShingles(fs.readFileSync(path.join('content', a.url.replace(/^\/|\/$/g, ''), 'index.md'), 'utf-8'))
}));

let crossSimSum = 0, crossCount = 0;
let withinCatSimSum = 0, withinCatCount = 0;
let withinClusterSimSum = 0, withinClusterCount = 0;

for (let i = 0; i < 1000; i++) {
  const a = loaded[Math.floor(Math.random() * loaded.length)];
  let b = loaded[Math.floor(Math.random() * loaded.length)];
  while (b === a) b = loaded[Math.floor(Math.random() * loaded.length)];

  const sim = jaccard(a.shingles, b.shingles);
  if (a.cat !== b.cat) {
    crossSimSum += sim;
    crossCount++;
  } else if (a.clusterId === b.clusterId) {
    withinClusterSimSum += sim;
    withinClusterCount++;
  } else {
    withinCatSimSum += sim;
    withinCatCount++;
  }
}

console.log('=== 相似度分层深度诊断报告 ===');
console.log('1. 跨专题（跨大类）平均相似度:', (crossSimSum / crossCount * 100).toFixed(2) + '%');
console.log('2. 同专题不同集群平均相似度:', (withinCatSimSum / withinCatCount * 100).toFixed(2) + '%');
console.log('3. 同集群内部兄弟文章平均相似度:', (withinClusterSimSum / withinClusterCount * 100).toFixed(2) + '%');
