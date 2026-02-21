# API & Types Organization / API 与类型组织架构

**方案: Domain-Driven Design (DDD) / 领域驱动设计**

本文档说明项目重构后的 API 服务和数据类型组织方式。

---

## 📁 Directory Structure / 目录结构

```
src/
├── models/                           # Global shared types / 全局共享类型
│   ├── index.ts
│   ├── common.types.ts              # ApiResponse, PaginatedResponse
│   └── auth.types.ts                # User, LoginRequest (跨 Feature)
│
├── api/                             # Global API services / 全局 API 服务
│   └── v1/
│       ├── index.ts
│       └── auth.service.ts          # Auth API calls
│
└── features/
    └── cats/                        # Cat Feature / 猫咪功能模块
        ├── models/                  # Feature-local types / Feature 本地类型
        │   ├── index.ts
        │   ├── cat.types.ts         # Cat entity (核心实体类型)
        │   ├── cat-api.types.ts     # API DTOs (请求/响应类型)
        │   └── cat-ui.types.ts      # UI options (下拉选项等)
        │
        ├── services/                # Feature services / Feature 服务
        │   └── cats.service.ts      # Cats API calls
        │
        └── data/
            ├── schema.ts            # Zod validation schema
            ├── data.ts              # UI data (breeds, stores, etc.)
            └── cats.ts              # Mock data generator
```

---

## 🎯 Design Principles / 设计原则

### 1. **Separation of Concerns / 关注点分离**

- **`models/`**: 只存放**跨 Feature 共享**的类型
  - `common.types.ts` - 基础设施类型（ApiResponse, PaginatedResponse）
  - `auth.types.ts` - 认证类型（被多个 Feature 使用）

- **`features/*/models/`**: Feature 专属类型
  - `cat.types.ts` - 实体定义
  - `cat-api.types.ts` - API DTO
  - `cat-ui.types.ts` - UI 辅助类型

### 2. **Single Source of Truth / 单一真实来源**

**Cat 类型定义在唯一位置：**
```typescript
// src/features/cats/models/cat.types.ts
export interface Cat {
  id: string
  name: string | null
  breed: string
  // ...
}
```

**其他地方都从这里导入：**
```typescript
// schema.ts - Zod 验证
import type { Cat } from '../models'
export const catSchema: z.ZodType<Cat> = z.object({ /* ... */ })

// components - UI 组件
import type { Cat } from '../models'

// services - API 调用
import type { Cat } from '../models'
```

### 3. **High Cohesion, Low Coupling / 高内聚，低耦合**

- ✅ 相关的类型、服务、数据都在同一个 Feature 目录下
- ✅ Feature 之间互不干扰
- ✅ 删除 Feature 只需删除一个文件夹

---

## 📦 Type Categories / 类型分类

### Global Types (`src/models/`)

| 文件 | 用途 | 示例 |
|------|------|------|
| `common.types.ts` | 基础设施类型 | `ApiResponse<T>`, `PaginatedResponse<T>` |
| `auth.types.ts` | 跨 Feature 共享 | `User`, `LoginRequest`, `LoginResponseData` |

### Feature Types (`src/features/*/models/`)

| 文件 | 用途 | 示例 |
|------|------|------|
| `cat.types.ts` | 核心实体 | `Cat`, `CatCafeStatus`, `Store` |
| `cat-api.types.ts` | API DTO | `CatCreate`, `CatUpdate`, `GetCatsListParams` |
| `cat-ui.types.ts` | UI 辅助 | `SelectOption`, `BreedOption`, `StatusColorMap` |

---

## 🔄 Import Examples / 导入示例

### Importing Types / 导入类型

```typescript
// From feature models (推荐 / Preferred)
import type { Cat } from '@/features/cats/models'
import type { CatCreate, CatUpdate } from '@/features/cats/models'

// From global models
import type { User } from '@/models'
import type { ApiResponse } from '@/models'
```

### Importing Services / 导入服务

```typescript
// Feature service
import { catsService } from '@/features/cats/services/cats.service'

// Global service
import { authService } from '@/api/v1/auth.service'
```

### Importing UI Data / 导入 UI 数据

```typescript
// UI options (from data.ts)
import { breeds, stores, catCafeStatuses, statusColors } from '@/features/cats/data/data'

// Zod schema (from schema.ts)
import { catSchema } from '@/features/cats/data/schema'
```

---

## ✅ Benefits / 优势

1. **可维护性** / Maintainability
   - 类型定义集中，易于查找和修改
   - Feature 自治，减少跨目录修改

2. **可扩展性** / Scalability
   - 添加新 Feature 只需复制目录结构
   - 类型和服务在同一位置，便于理解

3. **类型安全** / Type Safety
   - 单一真实来源，避免类型重复
   - TypeScript + Zod 双重保障

4. **团队协作** / Team Collaboration
   - 清晰的目录结构，新人易于理解
   - Feature 独立开发，减少冲突

---

## 🚀 Migration Guide / 迁移指南

### Before (旧结构)

```typescript
// Old: Types scattered across multiple locations
import type { Cat } from '@/features/cats/data/schema'
import { catsService } from '@/api/v1/cats.service'
import type { CatCreate } from '@/models/cats.types'
```

### After (新结构)

```typescript
// New: Everything in one place
import type { Cat, CatCreate } from '@/features/cats/models'
import { catsService } from '@/features/cats/services/cats.service'
```

---

## 📝 Convention / 约定

1. **全局类型**放在 `src/models/`
2. **Feature 类型**放在 `src/features/*/models/`
3. **Cat 类型**是 Feature 的核心，在 `cat.types.ts` 定义
4. **Zod schema** 从类型导入，而不是反向
5. **UI 选项**放在 `cat-ui.types.ts` 或 `data.ts`

---

## 🔮 Future Considerations / 未来考虑

### When to add to `src/models/`?

- ✅ 跨多个 Feature 共享的类型
- ✅ 基础设施类型（ApiResponse, etc.）
- ✅ 第三方 API 的全局类型

### When to add to `features/*/models/`?

- ✅ Feature 专属的实体类型
- ✅ Feature API 的 DTO
- ✅ Feature UI 的辅助类型

### Cross-Feature Sharing?

如果需要跨 Feature 共享 Cat 类型：

```typescript
// Option 1: Export from models index
export * from '@/features/cats/models'

// Option 2: Move to global models (if truly shared)
// Move to src/models/cat.types.ts
```

---

## 📚 References / 参考

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
