# Apache 生产静态部署与运维回退规范 (DEPLOYMENT.md)

> **生效域名**：`https://jichangyusuan.cc`  
> **产物位置**：`site/dist/`  
> **部署架构**：静态文件 + Apache 2.4+ (含 Pagefind WASM 索引产物)

---

## 1. 部署前构建步骤

在具有 Node.js 环境的构建机运行：
```bash
# 1. 依赖审计与测试
pnpm test
pnpm check:structure
pnpm check:secrets

# 2. 全量静态编译与全文搜索索引打包
pnpm build
```

构建成功后，`site/dist/` 下将包含完整的前端资产：
- `index.html`（预渲染首页）
- `[channel]/index.html`（所有各级聚合页与文章页纯静态 HTML）
- `assets/`（带 content hash 的 CSS、JS 静态资源）
- `pagefind/`（Pagefind WASM 检索二进制与中文分词索引片段）
- `sitemap.xml`（自动生成的规范 HTTPS 站点地图）
- `404.html`（标准 404 错误响应页）

---

## 2. 部署实施流程 (原子软链发布)

为避免构建产物与正在检索的 Pagefind 分片出现短暂不一致，建议采用符号链接（Symlink）原子切换方式部署：

```bash
# 假设服务器工作路径为 /var/www/jichangyusuan.cc
# releases/ 存放历史构建版本，current 为指向当前版本的软链接

RELEASE_DATE=$(date +%Y%m%d_%H%M%S)
TARGET_DIR="/var/www/jichangyusuan.cc/releases/${RELEASE_DATE}"

# 1. 将构建产物 site/dist 复制到新发布目录
mkdir -p "$TARGET_DIR"
cp -r site/dist/* "$TARGET_DIR"/
cp deploy/.htaccess "$TARGET_DIR"/.htaccess

# 2. 修复权限（Web 服务器用户通常为 www-data 或 apache）
chown -R www-data:www-data "$TARGET_DIR"
chmod -R 755 "$TARGET_DIR"

# 3. 原子切换软链接
ln -sfn "$TARGET_DIR" /var/www/jichangyusuan.cc/current

# 4. 平滑重新加载 Apache
sudo systemctl reload apache2
```

---

## 3. 快速应急回退策略 (Rollback)

如在线上发现任何严重渲染异常或非预期行为，无需重新编译，直接切换回上一稳定版本：

```bash
# 查看最近可用版本
ls -ld /var/www/jichangyusuan.cc/releases/*

# 重新将 current 软链指向前一版本
ln -sfn /var/www/jichangyusuan.cc/releases/PREVIOUS_RELEASE_DIR /var/www/jichangyusuan.cc/current
sudo systemctl reload apache2
```

---

## 4. 关键验证 Checklist

- [ ] 访问 `https://jichangyusuan.cc/` 返回 HTTP 200，HTML 包含预渲染内容。
- [ ] 访问 `https://jichangyusuan.cc/non-existent-page-test` 返回标准 HTTP 404，不回退为 200 首页。
- [ ] 打开页面搜索框，检索“年付折算”、“倍率”，可在本地无需服务器 API 情况下即时返回结果。
- [ ] 检查主站转介链接带规范 UTM 参数：`utm_source=jichangyusuan.cc&utm_medium=referral`。
- [ ] 检查 `sitemap.xml` 可正常抓取且地址全为 `https://jichangyusuan.cc/` 开头。
