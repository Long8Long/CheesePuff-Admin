# 猫舍管理系统 - Web端技术方案
# Cattery Management System - Web Technical Solution

**Version**: 1.0
**Date**: 2026-02-26
**Author**: Mr.Aloong

---

## 1. 技术栈选型 (Tech Stack)

### 核心框架 (Core Framework)

| 技术/Technology | 版本/Version | 用途/Purpose |
|-----------------|--------------|--------------|
| **React** | 19.2.3 | UI 框架 |
| **TypeScript** | 5.9.3 | 类型安全 |
| **Vite** | 7.3.0 | 构建工具 |
| **TanStack Router** | 1.141.2 | 路由管理 (文件系统路由) |
| **TanStack Query** | 5.90.12 | 数据获取与缓存 |
| **Zustand** | 5.0.9 | 状态管理 |
| **React Hook Form** | 7.68.0 | 表单管理 |
| **Zod** | 4.2.0 | 数据验证 |

### UI 组件库 (UI Components)

| 技术/Technology | 版本/Version | 用途/Purpose |
|-----------------|--------------|--------------|
| **Shadcn UI** | Latest | 基于 Radix UI 的组件库 |
| **Tailwind CSS** | 4.1.18 | 原子化 CSS |
| **Radix UI** | Latest | 无样式的 Headless 组件 |
| **Lucide React** | 0.561.0 | 图标库 |
| **Sonner** | 2.0.7 | Toast 通知 |
| **Recharts** | 3.6.0 | 数据可视化 |

### 国际化 (Internationalization)

| 技术/Technology | 版本/Version | 用途/Purpose |
|-----------------|--------------|--------------|
| **i18next** | 25.8.4 | i18n 框架 |
| **react-i18next** | 16.5.4 | React 绑定 |

### HTTP 客户端 (HTTP Client)

| 技术/Technology | 版本/Version | 用途/Purpose |
|-----------------|--------------|--------------|
| **Axios** | 1.13.2 | HTTP 请求 |
| **humps** | 2.0.1 | camelCase/snake_case 转换 |

---

## 2. 项目架构 (Project Architecture)

### 目录结构 (Directory Structure)

```
src/
├── components/
│   ├── ui/                    # Shadcn UI 基础组件 (32 个)
│   ├── data-table/            # 可复用的数据表格组件
│   ├── layout/                # 布局组件 (sidebar, header, nav)
│   └── *.tsx                  # 其他业务组件
├── features/                  # 按功能模块组织
│   ├── dashboard/
│   ├── cats/                  # 猫咪管理
│   ├── users/                 # 用户管理
│   ├── settings/              # 设置
│   ├── auth/                  # 认证
│   └── tasks/                 # 任务管理
├── routes/                    # TanStack Router 路由
│   ├── (auth)/               # 认证页面 (无需登录)
│   ├── _authenticated/       # 受保护页面 (需要登录)
│   └── (errors)/             # 错误页面
├── context/                   # 全局 Context Providers
├── stores/                    # Zustand 状态管理
├── hooks/                     # 自定义 Hooks
├── lib/                       # 工具函数
│   ├── api.ts                # Axios 配置
│   └── ...
└── main.tsx                   # 应用入口
```

### 路由结构 (Route Structure)

```
/ (root)
├── (auth)/                    # 认证相关路由
│   ├── sign-in                # 登录
│   ├── sign-up                # 注册
│   ├── forgot-password        # 忘记密码
│   └── otp                    # OTP 验证
├── _authenticated/            # 受保护路由
│   ├── /                      # 仪表盘 (Dashboard)
│   ├── /cats                  # 猫咪管理
│   ├── /users                 # 用户管理
│   └── /settings              # 设置
│       ├── /store-management  # 门店管理
│       ├── /cattery-config    # 猫舍配置
│       ├── /account           # 账户设置
│       ├── /appearance        # 外观设置
│       └── /notifications     # 通知设置
└── (errors)/                  # 错误页面
    ├── 401, 403, 404, 500, 503
```

---

## 3. 核心功能实现 (Core Features)

### 3.1 猫咪管理模块 (Cats Management)

**功能特性**:
- ✅ 完整的 CRUD 操作 (创建、读取、更新、删除)
- ✅ AI 智能填充 (支持智谱 AI 和阿里云百炼)
- ✅ 数据表格 (分页、排序、多条件筛选)
- ✅ 批量操作 (批量删除)
- ✅ 品种管理 (动态添加)
- ✅ 多门店支持 (山东店、苏州店)
- ✅ 照片上传 (单图)
- ✅ 状态管理 (工作中、休息、生病等)

**技术实现**:

| 功能 | 技术方案 | 文件位置 |
|------|----------|----------|
| 数据获取 | TanStack Query + Axios | `src/features/cats/services/cats.service.ts` |
| 表单验证 | React Hook Form + Zod | `src/features/cats/data/schema.ts` |
| 数据表格 | 自定义 DataTable 组件 | `src/components/data-table/` |
| URL 状态同步 | use-table-url-state Hook | `src/hooks/use-table-url-state.tsx` |
| AI 解析 | 后端 API + useAIFormFill Hook | `src/hooks/use-ai-form-fill.ts` |

### 3.2 认证模块 (Authentication)

**功能特性**:
- ✅ JWT 认证
- ✅ Cookie 持久化
- ✅ 路由保护
- ✅ 自动 Token 刷新 (计划中)

**技术实现**:

| 功能 | 技术方案 | 文件位置 |
|------|----------|----------|
| 认证状态 | Zustand Store | `src/stores/auth-store.ts` |
| Token 存储 | Cookie (access_token) | `src/lib/cookies.ts` |
| 路由保护 | TanStack Router 的 auth guard | `src/routes/_authenticated/route.tsx` |
| API 拦截器 | Axios Request Interceptor | `src/lib/api.ts` |

### 3.3 设置模块 (Settings)

**功能特性**:
- ✅ 门店管理 (增删改查)
- ✅ 猫舍配置 (品种、状态配置)
- ✅ 账户设置
- ✅ 外观设置 (主题、字体、方向)
- ✅ 通知设置

---

## 4. API 集成 (API Integration)

### 4.1 Axios 配置

**基础配置** (`src/lib/api.ts`):

```typescript
// 请求拦截器
- 自动添加 Authorization header (从 Cookie 读取 access_token)
- 请求参数 camelCase → snake_case 转换

// 响应拦截器
- 响应数据 snake_case → camelCase 转换
- 401 错误处理: 清除 Cookie 并跳转登录
- 统一错误处理 (Toast 通知)
```

### 4.2 服务层模式 (Service Layer)

**猫咪管理 API**:

```typescript
GET    /api/v1/admin/cats           // 获取列表
GET    /api/v1/admin/cats/:id       // 获取详情
POST   /api/v1/admin/cats           // 创建
PUT    /api/v1/admin/cats/:id       // 更新
DELETE /api/v1/admin/cats/:id       // 删除
DELETE /api/v1/admin/cats/bulk      // 批量删除
```

---

## 5. AI 集成 (AI Integration)

### 5.1 实现方式

AI 功能通过后端 API 统一对外提供服务，前端使用 Hook 调用：

| 前端 | 后端 API |
|------|----------|
| `useAIFormFill` Hook | `/api/v1/ai/form/fill` |

> **注意**: AI 服务提供商（智谱 AI / 阿里云百炼）的配置和调用由后端统一管理。

### 5.2 AI 功能实现

**智能填充猫咪信息** (`src/hooks/use-ai-form-fill.ts`):

```typescript
// 使用 useAIFormFill Hook 调用后端 API
const { fill, loading, error } = useAIFormFill()

// 从自然语言描述中提取结构化数据
const result = await fill('cats', text)

// 输出示例
{
  name: string,
  breed: string,
  storeName: string,
  birthday: string,  // YYYY-MM-DD
  price: number,
  description: string,
  catcafeStatus: string,
  visible: boolean
}
```

**实现方式**:
- 前端调用后端 API `/api/v1/ai/form/fill`
- 后端统一处理 AI 服务（智谱 AI / 阿里云百炼）
- 拦截器自动处理 snake_case ↔ camelCase 转换

---

## 6. 数据流架构 (Data Flow Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   React UI  │───▶│  TanStack    │───▶│   Axios      │        │
│  │ Components  │    │     Query    │    │   Client     │        │
│  └─────────────┘    └──────────────┘    └──────┬───────┘        │
│       ▲                    ▲                      │              │
│       │                    │                      │              │
│  ┌────┴────┐         ┌────┴────┐              ┌───┴────────┐    │
│  │ Zustand │         │  Zod    │              │ Interceptor│    │
│  │  Store  │         │ Schema  │              │  (camel/   │    │
│  └─────────┘         └─────────┘              │   snake)    │    │
│                                                 └────────────┘    │
└───────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ (with JWT)
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                      Backend API (FastAPI)                        │
│                    /api/v1/admin/*                                │
└───────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                      Database (MySQL/PostgreSQL)                  │
└───────────────────────────────────────────────────────────────────┘
```

---

## 7. 部署方案 (Deployment)

### 7.1 Docker 部署

**Dockerfile 特性**:
- 多阶段构建 (Node.js 22 Alpine)
- pnpm 10 依赖管理
- 构建参数 `VITE_API_MOCK` 用于开发模式
- 生产环境使用 `serve` 静态文件服务器 (端口 80)

**构建命令**:

```bash
# 构建镜像
docker build -t cheesepuff-admin:latest .

# 运行容器
docker run -p 8080:80 cheesepuff-admin:latest

# 带环境变量构建
docker build --build-arg VITE_API_BASE_URL=https://api.example.com -t cheesepuff-admin:latest .
```

### 7.2 环境变量

```bash
# API 配置
VITE_API_BASE_URL=http://localhost:5010
```


---

## 8. 技术亮点 (Technical Highlights)

| 特性/Feature | 实现/Implementation | 收益/Benefit |
|--------------|--------------------|--------------|
| **类型安全** | Strict TypeScript + Zod | 减少运行时错误 |
| **代码分割** | TanStack Router 自动分割 | 减少初始加载时间 |
| **命名转换** | 自动 camelCase/snake_case | 统一代码风格 |
| **URL 状态同步** | 表格状态同步到 URL | 可分享、可刷新 |
| **国际化** | 中文 (默认) + 英文 | 支持多语言 |
| **主题系统** | Dark/Light 模式 + CSS 变量 | 灵活的样式定制 |
| **RTL 支持** | Direction Provider | 支持阿拉伯语等 RTL 语言 |
| **错误处理** | 全局错误边界和拦截器 | 统一的错误处理 |

---

## 9. 性能优化 (Performance Optimization)

| 策略/Strategy | 实现/Implementation |
|---------------|--------------------|
| **代码分割** | TanStack Router 自动路由级分割 |
| **缓存策略** | TanStack Query (staleTime: 10s) |
| **图片优化** | 缩略图展示 (计划中: 懒加载) |
| **构建优化** | Vite + SWC (快速编译) |
| **包体积** | Knip 分析未使用的代码 |

---

## 10. 开发工具 (Development Tools)

| 工具/Tool | 用途/Purpose |
|-----------|--------------|
| **ESLint** | 代码检查 |
| **Prettier** | 代码格式化 |
| **Knip** | 未使用的代码分析 |
| **TanStack DevTools** | Query + Router 调试 |

---

## 附录：常用命令 (Common Commands)

```bash
# 开发
pnpm run dev              # 启动开发服务器

# 构建
pnpm run build           # TypeScript 编译 + 生产构建
pnpm run preview         # 预览生产构建

# 代码质量
pnpm run lint            # ESLint 代码检查
pnpm run format          # Prettier 格式化代码
pnpm run knip            # 分析未使用的导出/依赖

# Docker
docker build -t cheesepuff-admin:latest .    # 构建 Docker 镜像
docker run -p 8080:80 cheesepuff-admin:latest # 运行容器
```
