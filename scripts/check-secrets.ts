import fs from 'node:fs';
import path from 'node:path';

console.log('--- 检查源码与内容敏感信息与密钥泄漏 ---');

const SUSPICIOUS_PATTERNS = [
  /AIza[0-9A-Za-z-_]{35}/,                    // Google API Key
  /sk-[a-zA-Z0-9]{32,}/,                       // OpenAI API Key
  /ghp_[a-zA-Z0-9]{36}/,                      // GitHub Personal Access Token
  /xox[baprs]-[0-9a-zA-Z]{10,48}/,            // Slack Token
  /-----BEGIN\s+(?:RSA|OPENSSH|DSA|EC)?\s*PRIVATE\s+KEY-----/, // Private Key
  /password\s*=\s*['"][^'"]{8,}['"]/i,       // Plaintext password assignments
  /secret_key\s*=\s*['"][^'"]{8,}['"]/i,     // Secret keys
  /https:\/\/[^/]+:[^/]+@github\.com/         // Git credentials in URL
];

const SCAN_DIRS = ['content', 'lib', 'scripts', 'site/.vitepress', 'data', 'tests'];
let foundCount = 0;

function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git' || ent.name === 'generated') continue;
      scanDir(fullPath);
    } else if (ent.isFile() && /\.(ts|js|json|md|vue|yml|yaml|env)$/.test(ent.name)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const pattern of SUSPICIOUS_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`❌ 在文件 ${fullPath} 中检测到疑似敏感信息泄漏：${pattern}`);
          foundCount++;
        }
      }
    }
  }
}

for (const d of SCAN_DIRS) {
  scanDir(path.resolve(d));
}

if (foundCount > 0) {
  console.error(`❌ 敏感信息安全审计未通过，共发现 ${foundCount} 处潜在风险！`);
  process.exit(1);
} else {
  console.log('✔ 敏感信息安全审计通过，未发现任何私钥、密钥或敏感账密。');
}
