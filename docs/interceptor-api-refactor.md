# API 拦截器改造计划 / API Interceptor Refactoring Plan

## 背景 / Background

后端接口已统一返回标准格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

当前代码在每个 service 中重复解包 `response.data.data`，需要简化。

---

## 改造目标 / Goals

1. **统一响应解包** - 在拦截器中自动解包 `{ code, message, data }`
2. **统一错误处理** - 在拦截器中统一显示 toast 错误提示
3. **简化 Service 层** - 移除 `response.data.data` 重复代码
4. **保持类型安全** - TypeScript 类型仍然准确

---

## 拦截器能力 / Interceptor Capabilities

### 成功响应处理
- 检测标准格式 `{ code, message, data }`
- 业务成功（code: 200/0/201）→ 返回 `data` 部分
- 业务错误（其他 code）→ 显示 toast 并 reject
- 保留 `snake_case` → `camelCase` 转换

### 错误响应处理
- **401 Unauthorized** → 清除 token，跳转登录页
- **403 Forbidden** → toast 提示"权限不足"
- **404 Not Found** → toast 提示"资源不存在"
- **500 Server Error** → toast 提示"服务器内部错误"
- **网络错误** → toast 提示"网络连接失败"

---

## Cats 模块改造 / Cats Module Refactoring

### 1. Service 层改造

**改造前 / Before:**
```typescript
getList: async (params: GetCatsListParams): Promise<PaginatedResponse<Cat>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<Cat>>>(
    '/api/v1/admin/cats',
    { params }
  )
  return response.data.data  // 重复解包
}
```

**改造后 / After:**
```typescript
getList: async (params: GetCatsListParams): Promise<PaginatedResponse<Cat>> => {
  const { data } = await api.get<PaginatedResponse<Cat>>(
    '/api/v1/admin/cats',
    { params }
  )
  return data  // 直接返回
}
```

### 2. 类型定义调整

- 移除 `cat-api.types.ts` 中的 `ApiResponse<T>`
- Service 方法直接使用实际数据类型作为泛型参数

### 3. 错误处理简化

**改造前 / Before:**
```typescript
try {
  await catsService.delete(id)
  toast.success('删除成功')
} catch (error) {
  // 需要手动处理错误提示
  toast.error((error as Error).message)
}
```

**改造后 / After:**
```typescript
try {
  await catsService.delete(id)
  toast.success('删除成功')
} catch {
  // 拦截器已显示错误提示，组件层可选处理
  // 如需特殊处理，仍可访问 error 对象
}
```

---

## 其他模块改造指引 / Other Modules Guide

其他模块参照 cats 模块的改造模式：

1. **Service 文件** - 移除 `ApiResponse` 包装，简化返回语句
2. **类型文件** - 移除本地定义的 `ApiResponse` 类型
3. **组件文件** - 可选简化 catch 块中的错误处理

改造顺序建议：
- settings/store-management
- settings/cattery-config
- auth（注意与其他模块的差异）

---

## 验收检查清单 / Acceptance Checklist

### ✅ 已完成 / Completed

#### 代码改造
- [x] `docs/interceptor-api-refactor.md` - 改造计划文档
- [x] `src/lib/api.ts` - 拦截器成功响应处理（统一解包 + 业务错误处理）
- [x] `src/lib/api.ts` - 拦截器错误响应增强（HTTP 状态码处理 + toast 提示）
- [x] `src/features/cats/services/cats.service.ts` - Service 层简化
- [x] `src/features/cats/services/uploads.service.ts` - 上传服务简化
- [x] `src/features/cats/models/cat-api.types.ts` - 移除 ApiResponse 类型
- [x] `src/features/cats/components/cats-mutate-dialog.tsx` - 简化错误处理
- [x] `src/features/settings/store-management/services/stores.service.ts` - Service 层简化
- [x] `src/features/settings/cattery-config/services/cat-breeds.service.ts` - Service 层简化
- [x] `src/features/settings/cattery-config/services/cat-statuses.service.ts` - Service 层简化

#### 类型安全验证
- [x] `pnpm run build` 无类型错误 ✅
- [x] `npx eslint src/features/cats` 通过 ✅

### ⏳ 待验收 / Pending Review

#### 功能测试（需要实际运行测试）
- [ ] 猫咪列表正常加载（分页、筛选、排序）
- [ ] 创建猫咪成功
- [ ] 编辑猫咪成功
- [ ] 删除猫咪成功
- [ ] 批量删除成功
- [ ] 图片上传成功

#### 错误场景测试（需要实际运行测试）
- [ ] 401 错误 → 跳转登录页
- [ ] 403 错误 → 显示权限不足提示
- [ ] 404 错误 → 显示资源不存在提示
- [ ] 500 错误 → 显示服务器错误提示
- [ ] 网络断开 → 显示网络错误提示
- [ ] 业务错误码（非 200/0/201）→ 显示后端 message

### 📋 验收后行动 / Post-Acceptance Actions

验收通过后，参照 cats 模块改造其他模块：
- [x] `src/features/settings/store-management/services/stores.service.ts` ✅
- [x] `src/features/settings/cattery-config/services/cat-breeds.service.ts` ✅
- [x] `src/features/settings/cattery-config/services/cat-statuses.service.ts` ✅
- [ ] 其他模块的 Service 文件（如 auth.service.ts 已符合规范，configs.service.ts 已符合规范）

---

## 技术细节 / Technical Details

### 拦截器响应处理逻辑

```typescript
api.interceptors.response.use(
  (response) => {
    // 1. camelCase 转换
    if (response.data && typeof response.data === 'object') {
      response.data = humps.camelizeKeys(response.data)
    }
    
    // 2. 统一解包标准响应
    if (isStandardResponse(response.data)) {
      const { code, message, data } = response.data
      
      // 业务错误处理
      if (isBusinessError(code)) {
        toast.error(message || '操作失败')
        return Promise.reject({ message, code, data })
      }
      
      // 成功，替换为 data
      response.data = data
    }
    
    return response
  },
  (error) => {
    // HTTP 错误处理...
  }
)
```

### 标准响应检测

```typescript
function isStandardResponse(data: unknown): data is { code: number; message: string; data: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'data' in data &&
    typeof (data as Record<string, unknown>).code === 'number'
  )
}
```

### 业务错误码定义

```typescript
const BUSINESS_SUCCESS_CODES = [200, 0, 201, 204]

function isBusinessError(code: number): boolean {
  return !BUSINESS_SUCCESS_CODES.includes(code)
}
```

---

## 风险与回滚 / Risks & Rollback

### 潜在风险
1. 后端部分接口未按标准格式返回 → 需要白名单机制
2. 业务错误码判断不准确 → 需要调整成功码列表
3. 第三方 API 受影响 → 需要排除特定请求

### 回滚方案
如需回滚，恢复 `api.ts` 到原始版本，并恢复所有 service 文件的 `response.data.data` 解包代码。

---

## 参考文件 / References

- `src/lib/api.ts` - 拦截器实现
- `src/features/cats/services/cats.service.ts` - 改造示例
- `src/features/cats/models/cat-api.types.ts` - 类型定义
