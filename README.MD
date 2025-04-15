# Nuwa CLI

一个现代化的前端项目脚手架工具，支持快速创建 React、Vue 等项目模板。

## 特性

- 🚀 支持多种项目模板
  - React (JavaScript)
  - React + TypeScript
  - Vue (JavaScript)
  - Vue + TypeScript
- ⚡️ 模版基于 Vite 构建，开发体验极致
- 📦 开箱即用的项目配置
- 🛠️ 可选的 ESLint 配置

## 安装

```bash
npm install -g @nuwa-cli/cli
```

## 使用方法

创建新项目：

```bash
nuwa-cli create
```

## 开发

本项目使用 pnpm 作为包管理工具：

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 发布
pnpm pub
```

## 项目结构

```plaintext
packages/
  ├── cli/          # CLI 核心代码
  ├── create/       # 项目创建逻辑
  ├── template-react/     # React 模板
  ├── template-react-ts/  # React + TS 模板
  ├── template-vue/      # Vue 模板
  ├── template-vue-ts/   # Vue + TS 模板
  └── utils/       # 工具函数
```
