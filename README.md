# CheesePuff Admin - 猫舍管理系统

基于 Shadcn UI 构建的现代化猫舍管理后台系统，提供完整的猫咪信息管理、门店管理、配置管理等功能。

![CheesePuff Admin](public/images/shadcn-admin.png)

## 项目概述

CheesePuff Admin 是一个功能完整的猫舍管理系统，支持：
- 🐱 猫咪信息 CRUD 管理
- 🏪 多门店管理
- ⚙️ 系统配置管理
- 🤖 AI 智能填充功能
- 📊 数据可视化（计划中）
- 🎨 深色/浅色主题切换
- 📱 响应式设计，支持移动端

## 技术栈

**前端框架**:
- React 19
- TypeScript 5
- Vite 7

**UI 组件**:
- Shadcn UI (Radix UI + Tailwind CSS v4)
- Lucide Icons

**路由与状态**:
- TanStack Router (文件系统路由)
- TanStack Query (数据获取)
- Zustand (状态管理)

**表单与验证**:
- React Hook Form
- Zod (数据验证)

**构建工具**:
- ESLint (代码检查)
- Prettier (代码格式化)
- Knip (未使用代码分析)

**认证**:
- 自定义 JWT 认证 (部分实现)

## 功能特性

### ✅ 已实现功能

- **猫咪管理**
  - 完整的 CRUD 操作
  - AI 智能填充（品种、描述、价格等）
  - 批量删除
  - 高级筛选（品种、状态、门店）
  - 分页和排序
  - URL 状态同步（支持分享链接）

- **门店管理**
  - 动态门店配置
  - 门店启用/禁用
  - 多门店数据隔离

- **系统配置**
  - 品种管理
  - 状态管理
  - 个性化设置

- **UI/UX**
  - 深色/浅色主题
  - 响应式侧边栏
  - 全局搜索命令
  - Toast 通知
  - 确认对话框

### 🚧 计划功能

- 健康记录管理
- 销售订单管理
- 数据可视化报表
- 批量导入/导出
- 完整的权限管理

## 快速开始

### 环境要求

- Node.js >= 22
- pnpm >= 10

### 安装依赖

```bash
git clone <repository-url>
cd CheesePuff-Admin
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## Docker 部署

### 构建 Docker 镜像

```bash
docker build -t cheesepuff-admin:latest .
```

### 运行容器

```bash
docker run -p 8080:80 cheesepuff-admin:latest
```

访问 `http://localhost:8080` 查看应用

### 使用 Docker Compose

```bash
docker-compose up -d
```

详细的部署文档请参考 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 项目结构

```
src/
├── api/                    # API 服务层
│   ├── services/          # 业务服务（认证、猫咪、门店等）
│   └── types/             # API 类型定义
├── components/            # 通用组件
│   ├── ui/               # Shadcn UI 基础组件
│   ├── data-table/       # 数据表格组件
│   └── layout/           # 布局组件
├── features/             # 功能模块（按业务划分）
│   ├── cats/            # 猫咪管理
│   ├── auth/            # 认证模块
│   ├── settings/        # 设置模块
│   └── ...
├── routes/              # TanStack Router 路由
│   ├── (auth)/         # 认证相关页面
│   └── _authenticated/ # 需要认证的页面
├── stores/             # Zustand 状态管理
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数
└── context/            # Context Providers
```

## 常用命令

```bash
# 开发
pnpm run dev              # 启动开发服务器

# 构建
pnpm run build           # 构建生产版本
pnpm run preview         # 预览生产构建

# 代码质量
pnpm run lint            # ESLint 检查
pnpm run format          # Prettier 格式化
pnpm run knip            # 分析未使用的代码

# Docker
docker build -t cheesepuff-admin:latest .
docker run -p 8080:80 cheesepuff-admin:latest
```

## 配置说明

### 环境变量

```bash
# API Mock（开发用）
VITE_API_MOCK=true

# API Base URL（生产环境）
VITE_API_BASE_URL=https://api.example.com
```

### 路径别名

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/features/*` → `src/features/*`

## 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件 + Hooks
- 状态管理优先使用 Zustand
- 表单验证使用 Zod schema
- 禁止使用 `console.log`（使用 toast 通知替代）

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE) 文件

## 作者

Mr.Aloong

## 致谢

- [Shadcn UI](https://ui.shadcn.com) - 提供优秀的 UI 组件库
- [TanStack](https://tanstack.com) - 提供强大的路由和查询工具
- [Vite](https://vitejs.dev) - 提供极速的构建体验
