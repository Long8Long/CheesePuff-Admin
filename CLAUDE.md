# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **Shadcn UI** 的管理后台 Dashboard 项目，采用 **Feature-Based 架构**组织代码。

**核心技术栈：**
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **路由**: TanStack Router
- **数据获取**: TanStack Query
- **状态管理**: Zustand
- **UI 组件**: Shadcn UI (Radix UI + Tailwind CSS v4)
- **表单**: React Hook Form + Zod
- **认证**: Clerk（部分实现）

## 常用命令

```bash
# 开发
pnpm run dev              # 启动开发服务器

# 构建
pnpm run build           # TypeScript 编译 + 构建生产版本
pnpm run preview         # 预览生产构建

# 代码质量
pnpm run lint            # ESLint 代码检查
pnpm run format          # Prettier 格式化代码
pnpm run format:check    # 检查代码格式
pnpm run knip            # 分析未使用的导出/依赖
```

## 项目架构

### 目录结构

```
src/
├── components/
│   ├── ui/                    # Shadcn UI 基础组件（32 个）
│   ├── data-table/            # 通用数据表格组件
│   ├── layout/                # 布局组件（sidebar, header, nav）
│   └── *.tsx                  # 其他业务组件
├── features/                  # 按功能模块组织
│   ├── dashboard/
│   ├── users/
│   ├── settings/
│   ├── auth/
│   ├── tasks/
│   ├── apps/
│   └── chats/
├── routes/                    # TanStack Router 路由
│   ├── (auth)/               # 认证相关页面
│   ├── _authenticated/       # 需要认证的页面
│   └── __root.tsx            # 根路由
├── context/                   # 全局 Context Providers
│   ├── theme-provider.tsx    # 主题切换（深色/浅色）
│   ├── font-provider.tsx     # 字体切换
│   ├── direction-provider.tsx # RTL 支持
│   └── layout-provider.tsx   # 布局配置
├── stores/                    # Zustand 状态管理
│   └── auth-store.ts
├── hooks/                     # 自定义 Hooks
│   └── use-table-url-state.tsx  # 表格状态与 URL 同步
├── lib/                       # 工具函数
└── main.tsx                   # 应用入口
```

### 路由结构

- **(auth)**: 登录、注册、忘记密码、OTP 验证
- **_authenticated**: 需要认证的页面（dashboard, users, settings 等）
- **(errors)**: 错误页面（401, 403, 404, 500）

### Shadcn UI 配置

```json
{
  "style": "new-york",
  "baseColor": "slate",
  "cssVariables": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### 重要约定

1. **路径别名**: `@/*` 映射到 `src/*`
2. **生成的文件**: `src/routeTree.gen.ts` 由 TanStack Router 自动生成，不要手动编辑
3. **ESLint 忽略**: `src/components/ui/*` 和 `src/routeTree.gen.ts`
4. **类型导入**: 严格使用 `type` 关键字进行类型导入
5. **禁止 console**: ESLint 规则禁用 console 语句

### Context Providers 顺序

main.tsx 中的 Providers 顺序：
```
ThemeProvider → FontProvider → DirectionProvider → RouterProvider
```

### 代码规范

- **类型安全**: 严格的 TypeScript 配置
- **代码风格**: ESLint + Prettier
- **未使用代码**: 使用 Knip 分析和清理
- **表单验证**: 使用 Zod schema 定义

### 数据表格功能

`src/components/data-table/` 提供了完整的表格功能：
- 分页
- 列排序
- 多条件筛选
- 列显示/隐藏
- 批量操作
- URL 状态同步

### 主题系统

- 深色/浅色模式切换
- RTL（右到左）布局支持
- 多字体切换
- CSS 变量驱动的样式系统

### Feature 模块结构

每个功能模块遵循标准结构：
```
features/[feature-name]/
├── index.tsx          # 路由组件
├── components/        # 功能特定组件
├── data/              # Mock 数据或 API schema
│   ├── schema.ts      # Zod 验证 schema
│   └── data.ts        # 静态/模拟数据
└── route.tsx          # 路由定义
```

### 认证与错误处理

- **认证状态**: 使用 Zustand (`stores/auth-store.ts`) + Cookie 持久化
- **错误处理**:
  - 401: 重定向到登录页（带 redirect URL）
  - 500: 生产环境导航到 /500 页面
  - 304: 显示 "Content not modified" 提示

### Shadcn UI 组件更新说明

- **通用更新组件**: scroll-area, sonner, separator
- **RTL 更新组件**: alert-dialog, calendar, command, dialog, dropdown-menu, select, table, sheet, sidebar, switch
- **标准组件**: 可通过 Shadcn CLI 安全更新

### 自定义 Hooks

- `use-table-url-state.tsx`: 表格状态与 URL 查询参数双向同步
- `use-dialog-state.tsx`: Dialog 状态管理
- `use-mobile.tsx`: 移动端检测

### 工具函数 (lib/)

- `utils.ts`: `cn()` 样式合并, `getPageNumbers()` 分页生成
- `cookies.ts`: Cookie 操作（替代 js-cookie）
- `handle-server-error.ts`: 统一错误处理
