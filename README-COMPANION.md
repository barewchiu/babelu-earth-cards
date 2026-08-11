# 贝贝鲁地球百科 · 数字伴侣（重启版）

实体 TCG 的线上延伸：**掷纸地球选区 → 抽该区百科卡 → 收藏盒 → 钻石对战练习**。

## 本地运行

```bash
cd babelu-cards
npm install
npm start
```

打开 http://localhost:3001

## 脚本

| 命令 | 作用 |
|------|------|
| `npm start` | 本地开发（卡图用 junction 指向仓库外 `../卡牌图片`） |
| `npm run generate-cards` | 从文件名重生 `src/data/cards.json` |
| `npm run prepare-cards` | 构建前拷贝**全部**卡图到 `public/` |
| `npm run build:demo` | 仅打包前 48 张卡，便于快速部署演示 |
| `npm run build` | 全量卡图生产构建 |

## 部署（报名用）

本机需先登录 Vercel（CLI 当前未登录）：

```bash
npx vercel login
npx vercel --prod
```

或连接 GitHub 仓库 `barewchiu/babelu-earth-cards`，用 Vercel Dashboard Import。

轻量演示包：先 `npm run build:demo`，再部署 `build/` 目录。

## AWS 报名文案

见仓库上级文件：`../报名材料-AWS-Frontier.md`
