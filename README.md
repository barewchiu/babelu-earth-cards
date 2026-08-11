# 贝贝鲁地球百科 · 数字伴侣 Demo

**给评委 / 报名用：** 本仓库当前主线是实体 TCG 的线上延伸（掷纸地球选区 → 抽卡 → 收藏盒 → 钻石对战 → AI 朗读）。

- 本地：`npm install && npm start` → http://localhost:3001
- 详细说明：[README-COMPANION.md](./README-COMPANION.md)
- 演示卡图为精简子集（约 48 张）；全量数据见 `src/data/cards.full.json`

在线部署（推送后）：优先看 Vercel / GitHub Pages 最新构建。

---
# 🎮 贝贝鲁地球百科卡牌游戏

一款寓教于乐的亲子互动卡牌游戏，结合地球百科知识学习与策略对战玩法。

## 🌟 游戏特色

- **教育性优先**: 每张卡牌都承载着真实的地球百科知识
- **亲子互动**: 促进家长与孩子之间的知识分享和情感交流
- **寓教于乐**: 通过游戏机制让学习变得有趣和自然
- **文化传承**: 传播世界各地的地理、历史、文化知识

## 🎯 目标用户

- **主要用户**: 6-12岁儿童及其家长
- **次要用户**: 对地球百科知识感兴趣的青少年和成人
- **使用场景**: 家庭亲子时光、学校教育辅助、知识竞赛

## 🚀 在线预览

### 🎮 **体验游戏**
- **Vercel部署** (推荐): [https://babelu-earth-cards.vercel.app](https://babelu-earth-cards.vercel.app) ⚡ 极速加载
- **GitHub Pages**: [https://barewchiu.github.io/babelu-earth-cards/](https://barewchiu.github.io/babelu-earth-cards/) 🔄 稳定版本

### 📊 **部署状态**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/barewchiu/babelu-earth-cards)

## 📱 功能特性

### ✅ 已实现功能
- 🃏 卡片展示和翻转效果
- 🔍 地区筛选功能
- 📄 分页浏览系统
- 📱 响应式布局设计
- 🎨 精美的UI界面

### 🔄 开发中功能
- 🤖 AI对手系统
- ⚔️ 完整对战流程
- 👤 用户认证系统
- 🎵 音效和动画
- 📊 数据统计分析

## 🛠️ 技术栈

- **前端**: React 19 + TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **路由**: React Router
- **数据库**: Supabase (计划中)
- **部署**: Vercel + GitHub Pages

## 🎲 游戏数据

- **总卡牌数**: 280张
- **地区覆盖**: 12个主要地区
- **分类系统**: 地理、生物、文化、天文等多个类别
- **当前展示**: 20张精选卡牌

## 📦 本地开发

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装和运行
```bash
# 克隆项目
git clone https://github.com/barewchiu/babelu-earth-cards.git

# 进入项目目录
cd babelu-earth-cards

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 构建生产版本
```bash
npm run build
```

### 部署到Vercel
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 📈 项目进度

- **总体进度**: 约70%完成
- **核心功能**: ✅ 已完成
- **数据库**: 🔄 集成中
- **前端界面**: ✅ 基本完成
- **游戏逻辑**: 🔄 开发中

## 🚀 部署平台对比

| 特性 | Vercel | GitHub Pages |
|------|--------|--------------|
| 部署速度 | ⚡ 30秒 | 🔄 2-5分钟 |
| 全球CDN | ✅ 高性能 | ✅ 基础 |
| 预览部署 | ✅ 每个PR | ❌ 无 |
| 自定义域名 | ✅ 简单 | ✅ 支持 |
| 构建优化 | ✅ 自动 | ✅ 基础 |

## 🤝 贡献指南

欢迎提交Issue和Pull Request来帮助改进项目！

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- **项目仓库**: [https://github.com/barewchiu/babelu-earth-cards](https://github.com/barewchiu/babelu-earth-cards)
- **Vercel预览**: [https://babelu-earth-cards.vercel.app](https://babelu-earth-cards.vercel.app)
- **GitHub Pages**: [https://barewchiu.github.io/babelu-earth-cards/](https://barewchiu.github.io/babelu-earth-cards/)

---

**贝贝鲁地球百科卡牌游戏** - 让学习变得更有趣！ 🌍✨