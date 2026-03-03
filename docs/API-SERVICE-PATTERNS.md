# API Service Patterns / API 服务模式

本文档说明 CheesePuff Admin 项目中 API 服务层的最佳实践和代码模式。

This document describes the best practices and code patterns for the API service layer in the CheesePuff Admin project.

---

## 目录 / Table of Contents

1. [响应拦截器机制 / Response Interceptor](#响应拦截器机制--response-interceptor)
2. [标准 Service 模式 / Standard Service Pattern](#标准-service-模式--standard-service-pattern)
3. [HTTP 方法规范 / HTTP Methods](#http-方法规范--http-methods)
4. [自动刷新模式 / Auto-Refresh Pattern](#自动刷新模式--auto-refresh-pattern)
5. [完整示例 / Complete Example](#完整示例--complete-example)
6. [常见问题 / Common Issues](#常见问题--common-issues)

---

## 响应拦截器机制 / Response Interceptor

### 后端响应格式 / Backend Response Format

所有 API 接口统一返回标准格式：

All API endpoints return a standard format:

```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

### 前端拦截器自动处理 / Frontend Interceptor Auto-Processing

拦截器位于 `src/lib/api.ts`，自动处理响应：

The interceptor is located in `src/lib/api.ts` and automatically handles responses:

**成功响应 / Successful Response**:
- 业务成功（code: 200/0/201/204）→ 返回 `data` 部分
- Service 层直接获得实际数据类型

**业务错误 / Business Errors**:
- 其他 code → 显示 toast 提示并 reject

**HTTP 错误 / HTTP Errors**:
- 401 → 清除 token，跳转登录页
- 403 → 显示"权限不足"toast
- 404 → 显示"资源不存在"toast
- 500 → 显示"服务器内部错误"toast
- 网络错误 → 显示"网络连接失败"toast

---

## 标准 Service 模式 / Standard Service Pattern

### 基本规则 / Basic Rules

1. **直接类型声明** / Direct Type Declaration
   - 使用实际数据类型作为泛型参数
   - 不使用 `ApiResponse<T>` 包装类型

2. **解包响应** / Unwrap Response
   - 使用 `const { data } = await api.get<Type>()`
   - 直接返回 `data`

3. **参数名冲突处理** / Parameter Name Conflict
   - 当有 `data` 参数时，使用 `const { data: responseData }`

### 代码模式 / Code Patterns

#### 列表查询 / List Query

```typescript
getList: async (
  params: GetItemsListParams
): Promise<PaginatedResponse<Item>> => {
  const { data } = await api.get<PaginatedResponse<Item>>(
    '/api/v1/items',
    { params }
  )
  return data  // 拦截器已自动解包
}
```

#### 详情查询 / Detail Query

```typescript
getById: async (id: string): Promise<Item> => {
  const { data } = await api.get<Item>(`/api/v1/items/${id}`)
  return data
}
```

#### 创建 / Create

```typescript
create: async (data: ItemCreate): Promise<Item> => {
  // 使用 data: responseData 避免 parameter name conflict
  const { data: responseData } = await api.post<Item>(
    '/api/v1/items',
    data
  )
  return responseData
}
```

#### 更新 / Update

```typescript
update: async (id: string, data: ItemUpdate): Promise<Item> => {
  const { data: responseData } = await api.patch<Item>(
    `/api/v1/items/${id}`,
    data
  )
  return responseData
}
```

#### 删除 / Delete

```typescript
delete: async (id: string): Promise<void> => {
  await api.delete(`/api/v1/items/${id}`)
}
```

#### 批量删除 / Bulk Delete

```typescript
bulkDelete: async (ids: string[]): Promise<void> => {
  await api.delete('/api/v1/items/bulk', { data: { ids } })
}
```

---

## HTTP 方法规范 / HTTP Methods

### GET - 查询数据

```typescript
const { data } = await api.get<Type>(url, config?)
```

- 用于查询列表和详情
- 第二个参数可传配置对象（如 `params`）

### POST - 创建资源

```typescript
const { data: responseData } = await api.post<Type>(url, data)
```

- 用于创建新资源
- 第二个参数是请求体数据

### PATCH - 更新资源（推荐）

```typescript
const { data: responseData } = await api.patch<Type>(url, data)
```
**✓ 使用 PATCH 进行更新操作**

### PUT - 更新资源（不推荐）

**⚠️ 不使用 PUT** - 项目统一使用 PATCH 进行更新

### DELETE - 删除资源

```typescript
await api.delete(url, config?)
```

- 用于删除资源
- 第二个参数可传配置对象（如 `data` 用于批量删除）

---

## 自动刷新模式 / Auto-Refresh Pattern

当页面需要在数据变更后自动刷新列表时，使用此模式：

Use this pattern when pages need to refresh the list after data mutations:

### 步骤 / Steps

#### 1. 在 Context/Provider 中添加 refetch 函数

```typescript
// stores-provider.tsx
type StoresContextType = {
  // ... other properties
  refetch: () => void
  setRefetch: React.Dispatch<React.SetStateAction<() => void>>
}

export function StoresProvider({ children }) {
  const [refetch, setRefetch] = useState<() => void>(() => () => {})

  return (
    <StoresContext value={{ ..., refetch, setRefetch }}>
      {children}
    </StoresContext>
  )
}
```

#### 2. 在 Table 组件中设置 refetch 函数

```typescript
// stores-table.tsx
export function StoresTable() {
  const { setRefetch } = useStores()

  const { data, refetch } = useQuery({
    queryKey: ['stores', ...],
    queryFn: () => storesService.getList(...)
  })

  // 当 refetch 变化时更新 context
  useEffect(() => {
    setRefetch(() => refetch)
  }, [refetch, setRefetch])

  // ...
}
```

#### 3. 在 Dialog 中调用 refetch

```typescript
// stores-mutate-dialog.tsx
export function StoresMutateDialog() {
  const { refetch } = useStores()

  const onSubmit = async (data) => {
    try {
      await storesService.create(data)
      toast.success('创建成功')
      refetch()  // 刷新列表
      onOpenChange(false)
    } catch {
      toast.error('创建失败')
    }
  }
}
```

### 完整示例参考 / Complete Example Reference

查看 `/src/features/settings/store-management/components/` 中的实现：

See the implementation in `/src/features/settings/store-management/components/`:
- `stores-provider.tsx` - Context provider
- `stores-table.tsx` - Table with refetch setup
- `stores-mutate-dialog.tsx` - Create/Update dialog
- `stores-delete-dialog.tsx` - Delete dialog
- `data-table-bulk-actions.tsx` - Bulk delete actions

---

## 完整示例 / Complete Example

### Service 文件 / Service File

```typescript
// items.service.ts
import api from '@/lib/api'
import type { GetItemsListParams, ItemCreate, ItemUpdate } from './models'

export const itemsService = {
  // 列表查询
  getList: async (params: GetItemsListParams): Promise<PaginatedResponse<Item>> => {
    const { data } = await api.get<PaginatedResponse<Item>>(
      '/api/v1/items',
      { params }
    )
    return data
  },

  // 详情查询
  getById: async (id: string): Promise<Item> => {
    const { data } = await api.get<Item>(`/api/v1/items/${id}`)
    return data
  },

  // 创建
  create: async (data: ItemCreate): Promise<Item> => {
    const { data: responseData } = await api.post<Item>(
      '/api/v1/items',
      data
    )
    return responseData
  },

  // 更新（使用 PATCH）
  update: async (id: string, data: ItemUpdate): Promise<Item> => {
    const { data: responseData } = await api.patch<Item>(
      `/api/v1/items/${id}`,
      data
    )
    return responseData
  },

  // 删除
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/items/${id}`)
  },

  // 批量删除
  bulkDelete: async (ids: string[]): Promise<void> => {
    await api.delete('/api/v1/items/bulk', { data: { ids } })
  },
}
```

---

## 常见问题 / Common Issues

### Q: 为什么不使用 `response.data.data`？

**A:** 因为拦截器已经自动解包了响应。后端返回的 `{ code, message, data }` 格式会被拦截器处理，Service 层直接获得 `data` 部分。

**Q:** Why not use `response.data.data`?

**A:** Because the interceptor has already unwrapped the response. The backend returns `{ code, message, data }` format, which is processed by the interceptor, and the service layer gets the `data` part directly.

### Q: 什么时候使用 PATCH vs PUT？

**A:** 本项目统一使用 PATCH 进行更新操作。PATCH 是更 RESTful 的选择，用于部分更新资源。

**Q:** When to use PATCH vs PUT?

**A:** This project uniformly uses PATCH for update operations. PATCH is the more RESTful choice for partial resource updates.

### Q: 如何处理创建/更新时的参数名冲突？

**A:** 使用解构重命名：`const { data: responseData } = await api.post<Type>(url, data)`

**Q:** How to handle parameter name conflicts in create/update?

**A:** Use destructuring renaming: `const { data: responseData } = await api.post<Type>(url, data)`

### Q: 错误如何处理？

**A:** 拦截器已经统一处理了所有错误（HTTP 错误和业务错误），并显示 toast 提示。Service 层不需要额外处理错误，组件层可以在 catch 块中做特殊处理（如果需要）。

**Q:** How are errors handled?

**A:** The interceptor uniformly handles all errors (HTTP errors and business errors) and displays toast notifications. The service layer does not need additional error handling, but the component layer can do special handling in catch blocks if needed.

---

## 相关文档 / Related Documents

- [API 拦截器改造计划](./interceptor-api-refactor.md) - Interceptor refactoring details
- [API 类型架构](./API-TYPES-ARCHITECTURE.md) - API type definitions
- [技术文档](./tech.md) - Technical documentation

---

## 更新日志 / Changelog

- **2025-01**: 统一使用 PATCH 替代 PUT 进行更新操作
- **2025-01**: 实现响应拦截器自动解包机制
- **2025-01**: 添加自动刷新模式
