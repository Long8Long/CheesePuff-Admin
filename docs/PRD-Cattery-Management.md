# 猫舍管理系统产品需求文档 (PRD)
# Cattery Management System - Product Requirements Document

**Document Version**: 1.0
**Date**: 2026-02-23
**Author**: Mr.Aloong
**Status**: Draft
**Project Code Name**: CheesePuff-Admin

---

## 1. 执行摘要 (Executive Summary)

### 1.1 问题陈述 (Problem Statement)
猫咖（Cat Cafe）和猫舍（Cattery）在日常运营中面临管理效率低下的问题：
- **手工记录繁琐**：依赖 Excel/纸笔记录猫咪信息，容易出错且难以查询
- **数据分散**：猫咪的健康状态、销售信息、库存数据分散在多个系统或文档中
- **更新不及时**：猫咪状态变化（如生病、怀孕、售出）无法实时同步
- **检索困难**：无法快速按品种、门店、价格等多维度筛选猫咪

### 1.2 解决方案 (Proposed Solution)
构建一套基于 Web 的猫舍管理系统，提供：
- **统一数据管理**：集中管理所有猫咪信息，包括基础资料、健康状态、销售信息
- **AI 智能填充**：利用智谱 AI 解析自然语言描述，自动提取并填充猫咪信息
- **多门店支持**：支持山东店、苏州店等多门店管理
- **实时状态跟踪**：跟踪猫咪的工作状态（工作中、休息中、生病、怀孕、哺乳等）
- **批量操作**：支持批量导入、导出、删除、状态更新等操作

### 1.3 业务价值 (Business Impact)
- **效率提升 80%**：从手工录入到 AI 智能填充，减少重复性工作
- **数据准确性提升 95%**：通过数据验证和约束，减少人为错误
- **决策支持**：实时查看库存、销售数据，支持采购和定价决策
- **扩展性强**：支持未来新增门店、功能模块

### 1.4 成功指标 (Success Metrics)
| 指标 | 当前 | 目标 | 测量方法 |
|------|------|------|----------|
| 平均录入时间 | 5-10 分钟/只 | < 1 分钟/只 | AI 填充使用率 |
| 数据准确性 | ~70% | > 95% | 字段验证通过率 |
| 查询响应时间 | N/A | < 500ms | API P95 响应时间 |
| 用户满意度 | N/A | > 4.5/5 | NPS 调查 |

---

## 2. 问题定义 (Problem Definition)

### 2.1 目标用户 (Target Users)

#### 主要用户 (Primary Users)
1. **店长 (Store Manager)**
   - 职责：管理日常运营、猫咪库存、销售记录
   - 痛点：需要快速查看库存、更新猫咪状态、生成销售报表

2. **猫舍管理员 (Cattery Staff)**
   - 职责：录入猫咪信息、更新健康状态、管理照片
   - 痛点：手工录入繁琐、照片管理混乱、数据格式不统一

3. **运营经理 (Operations Manager)**
   - 职责：监控所有门店数据、分析销售趋势、制定采购计划
   - 痛点：数据分散、无法实时查看跨门店数据、缺少分析报表

#### 次要用户 (Secondary Users)
4. **兽医 (Veterinarian)**
   - 需求：查看健康记录、更新治疗信息

5. **客户服务 (Customer Service)**
   - 需求：查询猫咪信息、回答客户咨询

### 2.2 用户场景 (User Scenarios)

#### 场景 1：新猫咪入库
**当前流程**：
1. 店员收到新猫咪
2. 手工填写 Excel 表格（约 10 分钟）
3. 拍照、重命名、上传到云盘（约 5 分钟）
4. 数据可能遗漏或格式错误

**期望流程**：
1. 店员用一句话描述猫咪（30 秒）
2. AI 自动解析并填充表单（5 秒）
3. 上传照片（1 分钟）
4. 自动验证数据完整性

**价值**：节省 90% 时间，减少人为错误

#### 场景 2：客户咨询
**当前流程**：
1. 客户询问有哪些英国短毛猫
2. 店员翻阅 Excel 或去现场查看（5-10 分钟）
3. 可能遗漏符合条件的猫咪

**期望流程**：
1. 在系统中筛选：品种 = "英国短毛猫"，状态 = "在售"（10 秒）
2. 查看列表，包含照片、价格、年龄（即时）
3. 直接回复客户

**价值**：响应速度提升 60 倍，提升客户体验

#### 场景 3：销售数据统计
**当前流程**：
1. 月底导出多个 Excel 文件
2. 手工合并、去重、计算（2-3 小时）
3. 容易出错

**期望流程**：
1. 选择时间范围、门店
2. 系统自动生成报表（< 10 秒）
3. 导出或分享

**价值**：节省 99% 时间，数据准确可靠

### 2.3 市场机会 (Market Opportunity)

#### 市场规模
- **中国宠物市场规模**：~5000 亿人民币（2025 年）
- **猫咖市场**：~50 亿人民币，年增长率 20%
- **目标市场**：中大型猫咖（> 20 只猫咪），约 2000 家

#### 竞争分析
| 产品 | 优势 | 劣势 |
|------|------|------|
| Excel/手工 | 无成本、灵活 | 效率低、易出错、不支持多用户 |
| 宠物管理 SaaS | 功能全面 | 价格高（$99-299/月）、针对个人宠物 |
| 自建系统 | 定制化 | 开发成本高、维护困难 |

#### 差异化优势
1. **AI 智能填充**：行业首创，大幅降低录入成本
2. **多门店架构**：支持分布式管理
3. **价格实惠**：相比 SaaS 成本降低 90%

---

## 3. 解决方案概述 (Solution Overview)

### 3.1 系统架构

#### 技术栈
**前端**：
- React 19 + TypeScript
- TanStack Router（路由管理）
- TanStack Query（数据获取）
- Zustand（状态管理）
- Shadcn UI（UI 组件库）
- Tailwind CSS v4（样式）
- React Hook Form + Zod（表单验证）

**后端**：
- RESTful API（/api/v1/admin/cats）
- JWT 认证
- 数据库：待定（建议 PostgreSQL）

**AI 集成**：
- 智谱 AI（Zhipu AI）用于自然语言解析

#### 核心模块
```
CheesePuff-Admin
├── Authentication（认证模块）✅
├── Cats Management（猫咪管理）✅
│   ├── CRUD Operations
│   ├── AI Smart Fill
│   ├── Bulk Operations
│   └── Breed Management
├── Dashboard（仪表盘）🚧
│   ├── Overview Stats
│   ├── Sales Charts
│   └── Inventory Alerts
├── Reports（报表）📋
│   ├── Sales Report
│   ├── Inventory Report
│   └── Health Report
└── Settings（设置）⚙️
    ├── Store Management
    ├── User Management
    └── System Configuration
```

### 3.2 功能范围 (Feature Scope)

#### 已实现功能 ✅
1. **猫咪 CRUD**
   - 创建、编辑、删除猫咪信息
   - 支持字段：名称、品种、门店、生日、价格、照片、描述、状态
   - 数据验证（Zod Schema）

2. **AI 智能填充**
   - 自然语言解析（智谱 AI）
   - 自动提取：品种、性别、年龄、价格、描述、状态等
   - 一键填充表单

3. **数据表格**
   - 分页、排序、筛选
   - 列显示/隐藏配置
   - 批量选择
   - URL 状态同步

4. **品种管理**
   - 动态添加新品种
   - 品种下拉选择

5. **批量操作**
   - 批量删除
   - 批量更新状态（计划中）

6. **照片管理**
   - 缩略图展示
   - 多图上传（计划中）

7. **多门店支持**
   - 山东店、苏州店
   - 按门店筛选

#### 计划功能 🚧
1. **健康记录管理**
   - 疫苗记录
   - 驱虫记录
   - 疾病治疗记录
   - 体检报告上传

2. **销售管理**
   - 销售订单创建
   - 客户信息管理
   - 支付状态跟踪
   - 销售报表

3. **库存预警**
   - 库存不足提醒
   - 自动补货建议

4. **数据导出**
   - Excel 导出
   - PDF 报表生成

5. **高级筛选**
   - 自定义筛选条件
   - 保存筛选模板

6. **权限管理**
   - 角色权限（店长、管理员、普通员工）
   - 操作日志

#### 不在范围内 (Out of Scope)
- 宠物用品管理（可在未来版本考虑）
- 客户会员系统（可作为独立模块）
- 在线预约功能（可在未来版本考虑）
- 财务管理（建议使用专业财务软件）

---

## 4. 用户故事与需求 (User Stories & Requirements)

### 4.1 用户故事

#### US-001: 创建猫咪档案
**作为** 猫舍管理员
**我想要** 快速创建新猫咪的档案
**以便** 系统化管理所有猫咪信息

**验收标准**:
- [x] 支持手动填写表单
- [x] 支持 AI 智能填充（自然语言解析）
- [x] 必填字段验证（品种）
- [x] 可选字段：名称、生日、价格、照片、描述、状态
- [x] 照片上传支持
- [x] 保存成功后显示成功提示

**优先级**: P0（必须实现）

---

#### US-002: 查看猫咪列表
**作为** 店长
**我想要** 查看所有猫咪的列表
**以便** 快速了解库存情况

**验收标准**:
- [x] 表格展示所有猫咪信息
- [x] 支持分页（默认 10 条/页）
- [x] 支持按列排序
- [x] 支持按门店、品种、状态筛选
- [x] 显示缩略图
- [x] 点击行查看详情

**优先级**: P0

---

#### US-003: 编辑猫咪信息
**作为** 猫舍管理员
**我想要** 修改猫咪的信息
**以便** 保持数据最新（如状态变化、价格调整）

**验收标准**:
- [x] 支持编辑所有字段
- [x] 显示历史数据对比
- [x] 保存前验证数据
- [x] 记录修改时间和操作人

**优先级**: P0

---

#### US-004: 删除猫咪档案
**作为** 管理员
**我想要** 删除已售出或去世的猫咪档案
**以便** 保持数据整洁

**验收标准**:
- [x] 删除前二次确认
- [x] 支持批量删除
- [x] 软删除（保留在数据库，标记为删除）
- [ ] 删除操作日志记录

**优先级**: P0

---

#### US-005: AI 智能填充
**作为** 猫舍管理员
**我想要** 用一句话描述猫咪，系统自动填充表单
**以便** 节省录入时间

**验收标准**:
- [x] 支持自然语言输入（中文）
- [x] 自动识别：品种、性别、年龄、价格、状态
- [x] 显示解析结果，允许手动调整
- [x] 解析失败时给出友好提示
- [ ] 支持从剪贴板自动读取

**优先级**: P1（重要功能）

---

#### US-006: 批量导入猫咪
**作为** 运营经理
**我想要** 批量导入 Excel 中的猫咪数据
**以便** 快速初始化系统

**验收标准**:
- [ ] 支持 .xlsx/.csv 文件上传
- [ ] 自动验证数据格式
- [ ] 显示导入进度和结果
- [ ] 失败记录可下载修正

**优先级**: P1

---

#### US-007: 数据导出
**作为** 店长
**我想要** 导出猫咪数据到 Excel
**以便** 离线分析或分享

**验收标准**:
- [ ] 支持导出当前筛选结果
- [ ] 支持自定义导出字段
- [ ] 包含照片链接或缩略图
- [ ] 导出文件命名规范

**优先级**: P1

---

#### US-008: 品种管理
**作为** 管理员
**我想要** 动态添加猫咪品种
**以便** 系统支持所有品种

**验收标准**:
- [x] 可以添加新品种
- [x] 品种列表自动更新到下拉菜单
- [ ] 支持编辑和删除品种
- [ ] 支持品种排序

**优先级**: P1

---

#### US-009: 状态历史跟踪
**作为** 管理员
**我想要** 查看猫咪的状态变更历史
**以便** 了解运营轨迹

**验收标准**:
- [ ] 记录每次状态变更
- [ ] 显示变更时间和操作人
- [ ] 可导出历史记录

**优先级**: P2

---

#### US-010: 销售报表
**作为** 运营经理
**我想要** 查看月度销售报表
**以便** 分析业绩和制定计划

**验收标准**:
- [ ] 按时间范围统计
- [ ] 按门店分组
- [ ] 按品种分组
- [ ] 可视化图表（折线图、饼图）
- [ ] 支持导出

**优先级**: P2

---

### 4.2 功能需求矩阵 (Functional Requirements Matrix)

| ID | 需求描述 | 优先级 | 状态 | 备注 |
|----|----------|--------|------|------|
| FR-001 | 猫咪 CRUD API | P0 | ✅ | RESTful API |
| FR-002 | 数据表格展示 | P0 | ✅ | 支持分页、排序 |
| FR-003 | 字段验证 | P0 | ✅ | Zod Schema |
| FR-004 | AI 智能填充 | P1 | ✅ | 智谱 AI |
| FR-005 | 批量删除 | P0 | ✅ | API 支持 |
| FR-006 | 照片上传 | P0 | 🚧 | 单图已实现，多图计划中 |
| FR-007 | 品种管理 | P1 | ✅ | 动态添加 |
| FR-008 | 批量导入 | P1 | 📋 | Excel/CSV |
| FR-009 | 数据导出 | P1 | 📋 | Excel/PDF |
| FR-010 | 健康记录 | P2 | 📋 | 疫苗、驱虫 |
| FR-011 | 销售管理 | P2 | 📋 | 订单、客户 |
| FR-012 | 报表分析 | P2 | 📋 | 数据可视化 |
| FR-013 | 权限管理 | P2 | 📋 | RBAC |
| FR-014 | 操作日志 | P2 | 📋 | 审计跟踪 |

---

### 4.3 非功能性需求 (Non-Functional Requirements)

#### 性能 (Performance)
| 指标 | 目标 | 测量方法 |
|------|------|----------|
| 页面加载时间 | < 2s | LCP (Largest Contentful Paint) |
| API 响应时间 (P95) | < 500ms | API 监控 |
| 表格渲染时间 | < 100ms | React DevTools Profiler |
| AI 解析时间 | < 5s | 智谱 API 响应时间 |

#### 可扩展性 (Scalability)
- 支持 10,000+ 猫咪记录
- 支持 100+ 并发用户
- 支持新增门店无需修改代码

#### 安全性 (Security)
- JWT 认证
- HTTPS 通信
- SQL 注入防护
- XSS 防护
- CSRF 防护
- 敏感数据加密（密码、API Key）

#### 可用性 (Usability)
- 响应式设计（桌面、平板）
- 无障碍访问（ARIA 标准）
- 中英文双语支持
- 友好的错误提示

#### 可维护性 (Maintainability)
- TypeScript 类型安全
- ESLint + Prettier 代码规范
- 组件化设计
- API 文档（OpenAPI/Swagger）

---

## 5. 数据模型 (Data Model)

### 5.1 核心实体 (Core Entities)

#### Cat（猫咪）
```typescript
interface Cat {
  id: string                    // 唯一标识
  name: string | null           // 名称（可选）
  breed: string                 // 品种（必填）
  store: '山东店' | '苏州店' | null  // 门店
  birthday: string | null       // 生日 (YYYY-MM-DD)
  price: number | null          // 价格（元）
  images: string[] | null       // 照片 URL 数组
  thumbnail: string | null      // 缩略图 URL
  description: string | null    // 描述
  catcafeStatus: CatCafeStatus | null  // 状态
  visible: boolean              // 是否可见
  createdAt: string             // 创建时间
  updatedAt: string             // 更新时间
}

type CatCafeStatus =
  | 'working'    // 工作中
  | 'resting'    // 休息中
  | 'sick'       // 生病
  | 'retired'    // 退休
  | 'pregnant'   // 怀孕
  | 'nursing'    // 哺乳
  | 'training'   // 训练
```

#### 扩展模型（计划中）
```typescript
// 健康记录
interface HealthRecord {
  id: string
  catId: string
  type: 'vaccine' | 'deworming' | 'treatment' | 'checkup'
  date: string
  description: string
  vetName: string
  attachments: string[]
  createdAt: string
}

// 销售订单
interface SalesOrder {
  id: string
  catId: string
  customerName: string
  customerPhone: string
  salePrice: number
  saleDate: string
  paymentStatus: 'pending' | 'paid' | 'refunded'
  notes: string
  createdBy: string
  createdAt: string
}

// 用户权限
interface User {
  id: string
  username: string
  role: 'admin' | 'manager' | 'staff'
  store: string[]
  permissions: string[]
}
```

---

## 6. API 设计 (API Design)

### 6.1 端点列表 (Endpoints)

#### 猫咪管理 API
```
GET    /api/v1/admin/cats          # 获取猫咪列表（分页、筛选）
GET    /api/v1/admin/cats/:id      # 获取猫咪详情
POST   /api/v1/admin/cats          # 创建猫咪
PUT    /api/v1/admin/cats/:id      # 更新猫咪
DELETE /api/v1/admin/cats/:id      # 删除猫咪
DELETE /api/v1/admin/cats/bulk     # 批量删除
```

#### 请求/响应示例
```typescript
// GET /api/v1/admin/cats?page=1&pageSize=10&breed=英国短毛猫
interface GetCatsListParams {
  page?: number
  pageSize?: number
  breed?: string
  store?: string
  status?: CatCafeStatus
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// POST /api/v1/admin/cats
interface CatCreate {
  name?: string
  breed: string
  store?: Store
  birthday?: string
  price?: number
  images?: string[]
  description?: string
  catcafeStatus?: CatCafeStatus
  visible?: boolean
}

// PUT /api/v1/admin/cats/:id
interface CatUpdate {
  name?: string | null
  breed?: string
  store?: Store | null
  birthday?: string | null
  price?: number | null
  images?: string[] | null
  description?: string | null
  catcafeStatus?: CatCafeStatus | null
  visible?: boolean
}
```

### 6.2 错误码 (Error Codes)
| 状态码 | 含义 | 示例 |
|--------|------|------|
| 200 | 成功 | 获取列表成功 |
| 201 | 创建成功 | 创建猫咪成功 |
| 400 | 请求错误 | 字段验证失败 |
| 401 | 未认证 | Token 过期 |
| 403 | 无权限 | 普通员工无法删除 |
| 404 | 未找到 | 猫咪不存在 |
| 500 | 服务器错误 | 数据库连接失败 |

---

## 7. UI/UX 设计 (Design & User Experience)

### 7.1 设计原则
1. **简洁优先** (Simplicity First): 减少操作步骤，突出核心功能
2. **即时反馈** (Immediate Feedback): 操作立即给出视觉反馈
3. **容错设计** (Error Prevention): 验证输入，防止错误
4. **一致性** (Consistency): 遵循 Shadcn UI 设计规范

### 7.2 关键页面

#### 7.2.1 猫咪列表页
**布局**:
```
┌─────────────────────────────────────────────┐
│  Header: Search | Theme | Lang | Profile    │
├─────────────────────────────────────────────┤
│  Title: "猫咪管理"                          │
│  Subtitle: "管理猫咖中的所有猫咪信息"       │
│  [Add Cat] [Import] [Export]                │
├─────────────────────────────────────────────┤
│  Filters:                                   │
│  [Store ▼] [Breed ▼] [Status ▼]           │
├─────────────────────────────────────────────┤
│  Table:                                     │
│  ┌───┬──────┬───────┬─────┬─────┬────────┐│
│  │☐ │Photo │ Name  │Breed│Store│Actions ││
│  ├───┼──────┼───────┼─────┼─────┼────────┤│
│  │☐ │🐱   │咪咪   │英短 │山东 │✏️ 🗑️  ││
│  └───┴──────┴───────┴─────┴─────┴────────┘│
│  Pagination: < 1 2 3 ... 10 >              │
└─────────────────────────────────────────────┘
```

#### 7.2.2 创建/编辑猫咪对话框
**Tabs**:
1. **手动填写** (Manual Fill)
   - 表单字段
   - 实时验证

2. **AI 智能填充** (AI Fill)
   - 文本输入框
   - 示例提示
   - [从剪贴板粘贴] [AI 解析] 按钮

3. **品种管理** (Breed Management)
   - 品种列表
   - [添加新品种] 按钮

### 7.3 状态指示
| 状态 | 颜色 | 图标 |
|------|------|------|
| Working (工作中) | 绿色 | ▶️ |
| Resting (休息中) | 黄色 | 💤 |
| Sick (生病) | 红色 | 🏥 |
| Pregnant (怀孕) | 粉色 | 🤰 |
| Nursing (哺乳) | 紫色 | 🍼 |

---

## 8. 实施计划 (Implementation Plan)

### 8.1 当前状态
**已完成** ✅:
- [x] 项目初始化（React + Vite + TypeScript）
- [x] 认证模块（C Clerk 集成）
- [x] 猫咪 CRUD API 集成
- [x] 数据表格组件（分页、排序、筛选）
- [x] AI 智能填充功能（智谱 AI）
- [x] 品种管理对话框
- [x] 批量删除功能
- [x] 响应式布局

**进行中** 🚧:
- [ ] 多图上传组件
- [ ] 操作日志记录
- [ ] API 错误处理优化

### 8.2 路线图 (Roadmap)

#### Phase 1: 核心功能完善（2 周）
**Week 1**:
- [ ] 完成多图上传
- [ ] 优化图片裁剪和压缩
- [ ] 添加图片预览功能

**Week 2**:
- [ ] 实现批量导入（Excel/CSV）
- [ ] 实现数据导出（Excel）
- [ ] 添加操作日志

#### Phase 2: 扩展功能（3 周）
**Week 3-4**:
- [ ] 健康记录模块
  - 疫苗记录
  - 驱虫记录
  - 疾病治疗
- [ ] 销售管理模块
  - 销售订单
  - 客户管理
  - 支付状态

**Week 5**:
- [ ] Dashboard 数据可视化
- [ ] 报表生成
- [ ] 库存预警

#### Phase 3: 优化与部署（1 周）
**Week 6**:
- [ ] 性能优化（代码分割、懒加载）
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 部署文档

---

## 9. 风险与缓解策略 (Risks & Mitigations)

| 风险 | 概率 | 影响 | 缓解策略 |
|------|------|------|----------|
| AI 解析准确率不足 | 中 | 高 | 收集真实数据训练模型；提供手动调整入口 |
| API 性能问题 | 中 | 中 | 实现分页；添加缓存；数据库索引优化 |
| 数据迁移困难 | 低 | 高 | 提供批量导入功能；编写迁移脚本 |
| 用户采纳度低 | 中 | 高 | 培训和文档；收集反馈快速迭代 |
| 第三方依赖不稳定 | 低 | 中 | 智谱 AI 降级方案；API 限流处理 |
| 数据安全问题 | 低 | 高 | HTTPS；定期备份；权限控制 |

---

## 10. 成功指标与监控 (Success Metrics & Monitoring)

### 10.1 北极星指标 (North Star Metric)
**"每日活跃猫咪档案数"** (Daily Active Cat Profiles)
- 定义：每天被查看、编辑或销售的猫咪档案数量
- 目标：从 0 增长到 500 只（3 个月内）

### 10.2 关键指标 (Key Metrics)

#### 用户参与度
| 指标 | 目标 | 测量方法 |
|------|------|----------|
| DAU (日活用户) | > 20 | 唯一用户登录数 |
| 平均会话时长 | > 15 分钟 | 用户会话时间 |
| AI 填充使用率 | > 60% | AI 调用次数 / 总创建次数 |

#### 功能使用
| 指标 | 目标 | 测量方法 |
|------|------|----------|
| 创建猫咪数 | > 10 只/天 | 创建 API 调用数 |
| 编辑次数 | > 50 次/天 | 更新 API 调用数 |
| 搜索次数 | > 100 次/天 | 搜索 API 调用数 |

#### 技术性能
| 指标 | 目标 | 测量方法 |
|------|------|----------|
| API P95 响应时间 | < 500ms | API 监控 |
| 错误率 | < 0.1% | 错误日志 / 总请求数 |
| 系统可用性 | > 99.5% | Uptime 监控 |

---

## 11. 资源与预算 (Resources & Budget)

### 11.1 团队结构
| 角色 | FTE | 职责 |
|------|-----|------|
| 产品经理 | 0.5 | 需求管理、优先级排序 |
| 全栈工程师 | 1 | 前后端开发、API 集成 |
| UI/UX 设计师 | 0.2 | 设计评审、视觉优化 |
| QA 测试 | 0.3 | 功能测试、Bug 修复 |

### 11.2 预算估算
| 项目 | 月度成本 | 说明 |
|------|----------|------|
| 智谱 AI API | ¥500 | 按 Token 计费 |
| 云服务器 | ¥300 | 阿里云/腾讯云 |
| 域名 + SSL | ¥100 | 年费分摊 |
| 数据库 | ¥200 | 托管数据库 |
| **合计** | **¥1,100/月** | |

---

## 12. 附录 (Appendix)

### 12.1 术语表 (Glossary)
| 术语 | 英文 | 定义 |
|------|------|------|
| 猫舍 | Cattery | 专业猫咪养殖场所 |
| 猫咖 | Cat Cafe | 可以与猫互动的咖啡厅 |
| 品种 | Breed | 猫的品种（如英短、美短） |
| 状态 | Status | 猫咪当前状态（工作中、休息等） |
| 库存 | Inventory | 可售猫咪数量 |

### 12.2 参考资料
- [智谱 AI 文档](https://open.bigmodel.cn/)
- [Shadcn UI 文档](https://ui.shadcn.com/)
- [TanStack Router 文档](https://tanstack.com/router/latest)

### 12.3 变更历史
| 版本 | 日期 | 作者 | 变更说明 |
|------|------|------|----------|
| 1.0 | 2026-02-21 | Mr.Aloong | 初始版本 |

---

**文档结束**

---

## 快速参考 (Quick Reference)

### 已实现功能清单
✅ 猫咪 CRUD（创建、读取、更新、删除）
✅ AI 智能填充（智谱 AI）
✅ 数据表格（分页、排序、筛选）
✅ 批量删除
✅ 品种管理
✅ 多门店支持（山东店、苏州店）
✅ 照片上传（单图）
✅ 状态管理（工作中、休息、生病等）

### 下一步优先级
1. **P0**: 多图上传、操作日志
2. **P1**: 批量导入、数据导出
3. **P2**: 健康记录、销售管理、报表分析

### 关键文件路径
- 主页面: `src/features/cats/index.tsx`
- 类型定义: `src/features/cats/models/cat.types.ts`
- API 服务: `src/features/cats/services/cats.service.ts`
- AI Schema: `src/features/cats/data/ai-schema.ts`

---

**本文档持续更新中，欢迎反馈建议！**
