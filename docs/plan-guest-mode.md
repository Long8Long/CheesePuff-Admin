# 游客模式（Guest Mode）设计方案

> 状态：草案待评审
> 日期：2026-07-10
> 目的：让 HR 等非账号人员无需后端即可体验系统完整效果，数据为前端静态 mock（faker 生成），增删改作用于内存，刷新即恢复。

---

## 一、背景与现状

### 1.1 为什么需要游客模式

目前系统所有页面都需要登录后端账号才能访问。HR、潜在客户等角色想快速了解系统效果时，需要临时创建账号、启动后端、连接数据库，成本高。游客模式让这些人**无需后端服务**即可浏览完整界面，且 CRUD 操作在前端内存中真实生效，演示效果好。

### 1.2 现状调研结论

| 维度 | 现状 | 对游客模式的影响 |
|------|------|------------------|
| 认证守卫 | `routes/_authenticated/route.tsx:9` 仅判断 `auth.accessToken` 是否非空 | 注入假 token 即可放行 |
| 用户角色 | 无前端权限/角色控制逻辑 | 无需改造权限体系 |
| 后端连接模块 | 仅 `cats`（2 service）+ `settings`（4 service）连后端，其余模块本就用 mock 数据 | **只需 mock 这 6 个 service** |
| 数据获取 | 全部走 `useQuery → xxxService → api(axios)` | 拦截 axios adapter 即可全局生效 |
| 现有 mock 数据 | `cats/data/cats.ts` 已是完整 faker 生成器（50 条） | 可直接复用 |
| 菜单 | 前端写死（`sidebar-data.ts`），无权限过滤 | 无需改造 |

**需要 mock 的 6 个 service（即后端连接点）：**

| 模块 | Service 文件 | 数据类型 |
|------|-------------|---------|
| 猫咪 | `features/cats/services/cats.service.ts` | `Cat`（已有 faker 生成器） |
| 上传 | `features/cats/services/uploads.service.ts` | `BatchUploadResponse` |
| 门店 | `features/settings/store-management/services/stores.service.ts` | `Store` |
| 品种 | `features/settings/cattery-config/services/cat-breeds.service.ts` | `CatBreed` |
| 状态 | `features/settings/cattery-config/services/cat-statuses.service.ts` | `CatStatus` |
| 配置 | `features/settings/cattery-config/services/configs.service.ts` | `Config` |

---

## 二、核心设计：axios adapter 拦截 + 内存 Mock DB

### 2.1 设计思路

数据链路：`组件 → useQuery → xxxService(不改) → api(axios) → [adapter]`

在 axios 的 adapter 层插入拦截。adapter 是 axios 发送请求的最底层环节（负责实际发 HTTP），替换它后：

- **游客模式**：adapter → 内存 MockDB（读/写内存数据）
- **正常模式**：adapter → 真实 HTTP 请求（原 `xhrAdapter`）

```
┌─────────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────────┐
│  React 组件  │ ──► │ useQuery │ ──► │ xxxService   │ ──► │ api (axios)     │
│ (cats-table)│     │ (无感)   │     │ (完全不改)   │     │ adapter 判断:   │
└─────────────┘     └──────────┘     └──────────────┘     │ isGuest ? mock  │
                                                            │          : http │
                                                            └─────────────────┘
```

### 2.2 为什么选 adapter 拦截（而非改 service）

| 方案 | 改动点 | 优点 | 缺点 |
|------|--------|------|------|
| **✅ adapter 拦截** | `api.ts` 1 处 + 新建 mock 目录 | service 层零改动；mock 逻辑集中；CRUD 内存逻辑统一 | 需模拟 `{code,data}` 解包、分页、camelCase 转换 |
| ❌ service 层短路 | 6 文件 ~30 处方法加 `if(isGuest) return mock` | 直观 | 改动分散；CRUD 内存逻辑重复 6 遍；维护成本高 |
| ❌ React Query 层 | 每个 `useQuery` 加 wrapper | 不碰 axios | 改动点更多（每个 useQuery）；mutation 还要单独处理 |

**结论**：adapter 拦截是改动最小、最集中的方案，且满足"完全可操作（改 mock 内存数据）"的需求——内存 DB 统一管理 CRUD。

---

## 三、改动清单（5 层）

### ① 身份标记层

**文件**：`src/stores/auth-store.ts`

在 `AuthState` 中增加 `isGuest` 标志和相关 action：

```ts
interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    // 新增 ↓
    isGuest: boolean                              // 是否游客模式
    enterGuestMode: () => void                    // 进入游客模式
    exitGuestMode: () => void                     // 退出游客模式（= reset）
  }
}
```

`enterGuestMode` 的实现要点：

```ts
enterGuestMode: () =>
  set((state) => ({
    ...state,
    auth: {
      ...state.auth,
      isGuest: true,
      accessToken: 'guest',                       // 标记性 token，让守卫放行
      user: {                                     // 假用户信息
        id: 'guest',
        username: 'guest',
        role: 'guest',
        avatar: null,
        // ... 其他 User 必填字段给默认值
      },
    },
  })),
```

注意：`isGuest` **不写 cookie**（不持久化）。游客模式仅在当前会话有效，刷新页面后回到登录态——这符合"刷新即恢复"的数据语义，也避免意外残留。

`reset()` 需同步把 `isGuest` 置为 `false`。

### ② 守卫放行层

**文件**：`src/routes/_authenticated/route.tsx:17`

现有逻辑在 `accessToken` 存在后还会调 `authService.getCurrentUser()`（真实请求）。游客模式下需跳过：

```ts
beforeLoad: async ({ location }) => {
  const { auth } = useAuthStore.getState()
  if (!auth.accessToken) {
    throw redirect({ to: '/sign-in', search: { redirect: location.href } })
  }

  // ✅ 新增：游客模式直接放行，跳过 getCurrentUser 真实请求
  if (auth.isGuest) {
    return
  }

  // 以下为原有逻辑（非游客才走）
  if (!auth.user) {
    try {
      const user = await authService.getCurrentUser()
      if (user) useAuthStore.getState().auth.setUser(user)
    } catch {
      useAuthStore.getState().auth.resetAccessToken()
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  }
},
```

### ③ 游客入口层

**文件**：`src/features/auth/sign-in/components/user-auth-form.tsx`

在登录表单下方加一个**显眼的「游客登录」按钮**（用户已确认要显眼）：

```tsx
<Button className='mt-2' disabled={isLoading}>
  {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
  登录
</Button>

{/* ✅ 新增：游客登录按钮 */}
<Button
  type='button'
  variant='outline'
  className='mt-2'
  onClick={() => {
    auth.enterGuestMode()
    toast.success('已进入游客模式，数据为演示数据')
    navigate({ to: '/cats', replace: true })
  }}
>
  <Eye />
  游客登录
</Button>
```

`Eye` 图标来自 `lucide-react`（项目已在用）。按钮用 `variant='outline'`，与主登录按钮区分但足够显眼。

### ④ Mock 数据层 ★（核心，全部新建）

**新建目录**：`src/lib/mock/`

```
src/lib/mock/
├── index.ts          // 统一导出 createMockAdapter
├── mock-db.ts        // 内存数据库（faker 初始化 6 张表 + CRUD 方法）
├── mock-adapter.ts   // axios adapter：按 method+URL 路由到 mock-db
└── handlers/         // 按模块拆分的 handler（可选，若 mock-db 过大）
    ├── cats.ts
    ├── stores.ts
    ├── breeds.ts
    ├── statuses.ts
    ├── configs.ts
    └── uploads.ts
```

#### 4.1 `mock-db.ts` —— 内存数据库

职责：用 faker 初始化数据，提供 CRUD 方法，数据存内存数组。

```ts
import { faker } from '@faker-js/faker'
import { cats as generateCats } from '@/features/cats/data/cats'   // 复用现有生成器
import type { Cat } from '@/features/cats/models'
import type { Store } from '@/features/settings/store-management/models/store.types'
import type { CatBreed, CatStatus } from '@/features/settings/cattery-config/models/cattery.types'
import type { Config } from '@/features/settings/cattery-config/models/config.types'

faker.seed(12345)  // 固定种子，保证每次数据一致

/**
 * 内存数据库
 * - 模块启动时初始化一次
 * - CRUD 操作直接改内存数组
 * - 刷新页面后重建（数据恢复初始态）
 */
class MockDB {
  cats: Cat[] = []
  stores: Store[] = []
  breeds: CatBreed[] = []
  statuses: CatStatus[] = []
  configs: Config[] = []

  constructor() {
    this.init()
  }

  private init() {
    // 复用现有 cats faker 生成器（50 条）
    this.cats = generateCats()

    // stores：5 条，按 Store 类型字段生成
    this.stores = Array.from({ length: 5 }, (_, i) => ({
      id: `store_${i + 1}`,
      name: faker.company.name(),
      address: faker.location.streetAddress({ useFullAddress: true }),
      phone: faker.phone.number(),
      // ... 按 store.types.ts 补齐
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }))

    // breeds：8 个常见品种（从现有 data.ts 的 breeds 取值）
    this.breeds = [
      { id: 'breed_1', name: '布偶猫', value: 'ragdoll', /* ... */ },
      { id: 'breed_2', name: '英国短毛猫', value: 'british_shorthair', /* ... */ },
      // ... 共 8 条
    ]

    // statuses：从现有 data.ts 的 catCafeStatuses 取值
    this.statuses = [
      { id: 'status_1', name: '工作中', value: 'working' },
      { id: 'status_2', name: '休息中', value: 'resting' },
      // ... 共 6 条
    ]

    // configs：按 Config 类型生成 3-5 条
    this.configs = [/* ... */]
  }

  // ─── 通用 CRUD（以 cats 为例，其余类似） ───
  listCats(params: GetCatsListParams): PaginatedResponse<Cat> {
    let result = [...this.cats]

    // 过滤
    if (params.breed) result = result.filter(c => c.breed === params.breed)
    if (params.catcafeStatus) result = result.filter(c => c.catcafeStatus === params.catcafeStatus)
    if (!params.includeHidden) result = result.filter(c => c.visible)

    // 分页
    const page = params.page ?? 1
    const pageSize = params.pageSize ?? 10
    const total = result.length
    const totalPages = Math.ceil(total / pageSize)
    const paged = result.slice((page - 1) * pageSize, page * pageSize)

    return {
      cats: paged,
      pagination: { total, page, pageSize, totalPages },
    }
  }

  findCat(id: string): Cat | undefined {
    return this.cats.find(c => c.id === id)
  }

  createCat(data: CatCreate): Cat {
    const now = new Date().toISOString()
    const newCat: Cat = {
      id: `cat_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      visible: true,
      ...data,
    } as Cat
    this.cats.unshift(newCat)
    return newCat
  }

  updateCat(id: string, data: CatUpdate): Cat | undefined {
    const idx = this.cats.findIndex(c => c.id === id)
    if (idx === -1) return undefined
    this.cats[idx] = {
      ...this.cats[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    return this.cats[idx]
  }

  removeCat(id: string): void {
    this.cats = this.cats.filter(c => c.id !== id)
  }

  bulkRemoveCats(ids: string[]): void {
    this.cats = this.cats.filter(c => !ids.includes(c.id))
  }

  // stores / breeds / statuses / configs 的 CRUD 方法同构，略
}

export const mockDB = new MockDB()
```

#### 4.2 `mock-adapter.ts` —— axios adapter

职责：解析 `config.method + config.url`，路由到 mock-db 对应方法，返回符合 axios 格式的响应。

```ts
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { humps } from 'humps'
import { mockDB } from './mock-db'

// 模拟网络延迟（让 loading 态真实）
const MOCK_DELAY = 300 // ms

/**
 * Mock Adapter
 * 拦截所有 axios 请求，在游客模式下路由到内存 DB
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  // 模拟延迟
  await new Promise(r => setTimeout(r, MOCK_DELAY))

  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const body = parseBody(config.data)       // FormData / JSON
  const params = config.params || {}

  // 路由匹配 → 调 mock-db
  const result = route(method, url, { body, params })

  // 包装成标准 axios 响应（走响应拦截器后会 camelize + 解包）
  const response: AxiosResponse = {
    data: result,                            // 返回 { code, message, data } 标准格式
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }
  return response
}
```

**关键设计点：返回标准 `{code, message, data}` 格式**

现有 `api.ts:113-128` 响应拦截器会自动解包 `{code,message,data}`（`code` 为成功码则取 `data`）。因此 mock adapter 返回的数据包一层标准格式，即可无缝复用现有解包逻辑：

```ts
// route() 内部返回时包装
function ok(data: unknown) {
  return { code: 200, message: 'success', data }
}
```

这样 `api.ts` 的响应拦截器（camelize + 解包）**完全不用改**，service 层拿到的就是最终数据。

#### 4.3 路由表

集中声明所有 mock 路由（method + URL pattern → handler）。支持路径参数（`:id`）：

```ts
// handlers/index.ts（或直接写在 mock-adapter.ts 内）
function route(method: string, url: string, { body, params }): unknown {
  // ─── Cats ───
  if (match('GET',    '/api/v1/admin/cats', url, method))      return ok(mockDB.listCats(params))
  if (match('GET',    '/api/v1/admin/cats/:id', url, method))  return ok(mockDB.findCat(pathId(url)))
  if (match('POST',   '/api/v1/admin/cats', url, method))      return ok(mockDB.createCat(body))
  if (match('PATCH',  '/api/v1/admin/cats/:id', url, method))  return ok(mockDB.updateCat(pathId(url), body))
  if (match('DELETE', '/api/v1/admin/cats/:id', url, method))  { mockDB.removeCat(pathId(url)); return ok(null) }
  if (match('DELETE', '/api/v1/admin/cats/bulk', url, method)) { mockDB.bulkRemoveCats(body.ids); return ok(null) }

  // ─── Stores ───
  if (match('GET',    '/api/v1/admin/stores', url, method))      return ok(mockDB.listStores(params))
  if (match('GET',    '/api/v1/admin/stores/:id', url, method))  return ok(mockDB.findStore(pathId(url)))
  if (match('POST',   '/api/v1/admin/stores', url, method))      return ok(mockDB.createStore(body))
  if (match('PATCH',  '/api/v1/admin/stores/:id', url, method))  return ok(mockDB.updateStore(pathId(url), body))
  if (match('DELETE', '/api/v1/admin/stores/:id', url, method))  { mockDB.removeStore(pathId(url)); return ok(null) }
  if (match('DELETE', '/api/v1/admin/stores/bulk', url, method)) { mockDB.bulkRemoveStores(body.ids); return ok(null) }

  // ─── Cat Breeds ───
  if (match('GET',    '/api/v1/admin/cat-breeds', url, method))     return ok(mockDB.listBreeds())
  if (match('POST',   '/api/v1/admin/cat-breeds', url, method))     return ok(mockDB.createBreed(body))
  if (match('PATCH',  '/api/v1/admin/cat-breeds/:id', url, method)) return ok(mockDB.updateBreed(pathId(url), body))
  if (match('DELETE', '/api/v1/admin/cat-breeds/:id', url, method)) { mockDB.removeBreed(pathId(url)); return ok(null) }

  // ─── Cat Statuses（同 breeds 结构）───
  // ...

  // ─── Configs ───
  if (match('GET', '/api/v1/admin/configs', url, method))      return ok(mockDB.listConfigs(params))
  if (match('GET', '/api/v1/admin/configs/:key', url, method)) return ok(mockDB.findConfig(pathId(url)))
  if (match('PUT', '/api/v1/admin/configs/:key', url, method)) return ok(mockDB.updateConfig(pathId(url), body))

  // ─── Uploads（特殊：返回占位图 URL）───
  if (match('POST', '/api/v1/admin/uploads/batch', url, method)) return ok(mockUpload(body))

  // 未匹配到的请求 → 抛错（帮助发现遗漏）
  return mockError(404, `Mock 未覆盖的接口: ${method.toUpperCase()} ${url}`)
}
```

**路径匹配工具函数**（处理 `:id` 参数）：

```ts
function match(expectedMethod: string, expectedPath: string, url: string, method: string): boolean {
  if (method !== expectedMethod) return false
  // 将 /api/v1/admin/cats/:id 转成正则，与 url 匹配
  const pattern = expectedPath.replace(/:id|:key/g, '[^/]+')
  return new RegExp(`^${pattern}$`).test(url)
}

function pathId(url: string): string {
  // 取 url 最后一段作为 id
  return url.split('/').pop() || ''
}
```

#### 4.4 上传特殊处理

`uploads.service.ts` 用 `FormData` 上传文件。游客模式下无法真实上传，返回占位图 URL：

```ts
function mockUpload(body: FormData) {
  // FormData 无法直接读文件数，根据 upload_type 返回占位
  const uploadType = body.get('upload_type')
  const isVideo = uploadType === 'cat_video'

  // 返回 BatchUploadResponse 结构
  return {
    files: [{
      success: true,
      originalUrl: isVideo
        ? `https://loremflickr.com/400/400/cat?mock=${Date.now()}`
        : `https://loremflickr.com/400/400/cat?mock=${Date.now()}`,
      thumbnailUrl: `https://loremflickr.com/200/200/cat?mock=${Date.now()}`,
      url: `https://loremflickr.com/400/400/cat?mock=${Date.now()}`,
      filename: isVideo ? `mock-video-${Date.now()}.mp4` : `mock-image-${Date.now()}.jpg`,
      error: null,
    }],
  }
}
```

> 注：`api.ts:72` 对 `FormData` 跳过 camelCase 转换，所以 uploads 的 mock 响应无需特殊处理大小写。

### ⑤ 注入拦截层

**文件**：`src/lib/api.ts:6`

修改 axios 实例创建，运行时根据 `isGuest` 选择 adapter：

```ts
import axios from 'axios'
import axiosInternal from 'axios/lib/adapters/xhr'   // 真实 adapter
import { mockAdapter } from './mock'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  // ✅ 运行时判断：游客用 mock adapter，否则用真实 adapter
  adapter: (config) => {
    const { auth } = useAuthStore.getState()
    if (auth.isGuest) {
      return mockAdapter(config)
    }
    return axiosInternal(config)
  },
})
```

> **避免循环依赖**：`api.ts` 顶部 import `useAuthStore` 可能导致循环（auth-store 不依赖 api，应无环；但需验证）。若存在环，改用函数内动态 `import` 或直接读 `getCookie('access_token')==='guest'` 判断。后者更简单，且与"假 token = 'guest'"的设计一致。

**更稳妥的判断方式**（不引入 store 依赖）：

```ts
adapter: (config) => {
  const token = getCookie('access_token')
  if (token === 'guest') {
    return mockAdapter(config)
  }
  return axiosInternal(config)
}
```

> 但 `isGuest` 不写 cookie（见 §3.1）。因此 **`enterGuestMode` 时需把 `access_token` cookie 设为 `'guest'`**，仅用于 adapter 判断；`isGuest` 状态本身仍只在内存。刷新后 cookie 仍在但 `accessToken` 内存为空 → 守卫拦截 → 回登录页，符合预期。

修订 §3.1 的 `enterGuestMode`：

```ts
enterGuestMode: () => {
  setCookie(ACCESS_TOKEN, 'guest')   // 写 cookie，供 adapter 判断
  set((state) => ({ /* ...isGuest: true, accessToken: 'guest', user: {...} */ }))
},
```

---

## 四、边界与特殊情况

### 4.1 401 逃生口

`main.tsx:73-79` 有全局 401 监听（QueryCache 里 401 → `auth.reset()` + 跳登录）。游客模式下 mock 不返回 401（除非 mock 路由未命中），但为稳妥起见加守卫：

```ts
// main.tsx QueryCache.onError
onError: (error) => {
  const { auth } = useAuthStore.getState()
  if (auth.isGuest) return            // ✅ 游客模式不触发 401 跳转
  if (error.code === 401) {
    auth.reset()
    navigate({ to: '/sign-in' })
  }
}
```

同样，`api.ts:140` 的 401 处理也会因 mock 不返回 401 而不触发，无需改动。

### 4.2 登出

复用现有 `SignOutDialog`（`sign-out-dialog.tsx` 调 `auth.reset()`）。需确认 `reset()` 把 `isGuest` 也置 `false`：

```ts
reset: () =>
  set((state) => ({
    ...state,
    auth: {
      ...state.auth,
      user: null,
      accessToken: '',
      isGuest: false,   // ✅ 新增
    },
  })),
```

### 4.3 视觉标识（让 HR 明确是演示数据）

在 header 或侧边栏底部显示「🧑‍💻 游客模式 · 数据为演示」角标：

```tsx
// components/layout/header.tsx 或 app-sidebar.tsx
{auth.isGuest && (
  <Badge variant='secondary' className='gap-1'>
    <Eye className='h-3 w-3' />
    游客模式 · 演示数据
  </Badge>
)}
```

### 4.4 写操作提示

游客模式下 CRUD 全部生效（改内存）。可在成功 toast 后缀「（演示）」以提醒，或保持正常提示。**建议保持正常提示**——HR 操作流畅即可，视觉标识已说明这是演示。

### 4.5 统计页等其他模块

`statistics`、`breeding`、`financial` 等模块本来就 mock 好了（无 service），游客模式下行为不变，无需处理。

---

## 五、实现步骤（建议顺序）

按依赖关系从底层往上：

| 步骤 | 内容 | 文件 | 验证点 |
|------|------|------|--------|
| 1 | 建 mock 目录 + `mock-db.ts`（先只做 cats） | `src/lib/mock/mock-db.ts` | 单独 import 能生成 50 条猫 |
| 2 | 建 `mock-adapter.ts` + 路由表（先只 cats + uploads） | `src/lib/mock/mock-adapter.ts` | adapter 能匹配 cats URL |
| 3 | `auth-store` 加 `isGuest` + `enterGuestMode`/`exitGuestMode` | `src/stores/auth-store.ts` | store 能切换 isGuest |
| 4 | `api.ts` 注入 adapter 判断 | `src/lib/api.ts` | token=guest 时走 mock |
| 5 | 守卫放行 + 登录页按钮 | `route.tsx` / `user-auth-form.tsx` | 点游客登录能进 /cats |
| 6 | **跑通猫咪模块全链路**（列表/分页/搜索/增删改） | — | 猫咪 CRUD 生效 |
| 7 | 补 stores mock | `mock-db.ts` + 路由表 | 门店 CRUD 生效 |
| 8 | 补 breeds / statuses / configs mock | `mock-db.ts` + 路由表 | 设置页数据正常 |
| 9 | 补 uploads mock（占位图） | `mock-adapter.ts` | 新增猫咪带图可用 |
| 10 | 视觉标识 + 401 守卫 + 边界处理 | `header.tsx` / `main.tsx` | 游客角标显示，401 不误触 |

**里程碑**：步骤 6 完成即可验证整条链路，确认无误后再补 settings 模块（7-9）。

---

## 六、测试验证清单

游客模式实现后，逐项验证：

- [ ] 登录页点「游客登录」→ 成功进入 `/cats`，不触发真实后端请求
- [ ] 刷新页面 → 回到登录页（数据恢复初始态）
- [ ] 猫咪列表：分页、搜索（按品种/状态）正常
- [ ] 新增猫咪 → 列表出现新数据
- [ ] 编辑猫咪 → 数据更新
- [ ] 删除猫咪 → 列表移除
- [ ] 批量删除 → 选中项移除
- [ ] 新增猫咪带图片上传 → 占位图回显
- [ ] 设置 > 门店管理：CRUD 正常
- [ ] 设置 > 猫舍配置（品种/状态/配置）：数据正常显示
- [ ] header 显示「游客模式」角标
- [ ] 登出 → 回登录页，`isGuest` 清除
- [ ] 统计/库存等其他模块正常显示（本来 mock）
- [ ] 关闭后端服务 → 游客模式完全可用（验证脱离后端）

---

## 七、风险与回退

| 风险 | 应对 |
|------|------|
| 循环依赖（api ↔ auth-store） | 用 `getCookie('access_token')==='guest'` 判断，不 import store |
| mock 路由遗漏某接口 | 未匹配时 mock adapter 抛明确错误（含 URL），便于补全 |
| 生产环境误入游客模式 | 游客入口仅登录页按钮；可加 `if (import.meta.env.PROD)` 隐藏（可选） |
| 数据格式不符（字段缺失/大小写） | mock-db 严格按 `models/*.types.ts` 生成；camelize 走现有拦截器 |
| 实现需回退 | 全部新增在 `src/lib/mock/` + 少量改动，删除目录 + 还原 5 处改动即回退 |

---

## 八、改动文件汇总

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/lib/mock/mock-db.ts` | 🆕 新建 | 内存数据库 |
| `src/lib/mock/mock-adapter.ts` | 🆕 新建 | axios mock adapter + 路由 |
| `src/lib/mock/index.ts` | 🆕 新建 | 导出 mockAdapter |
| `src/stores/auth-store.ts` | ✏️ 改 | 加 `isGuest` / `enterGuestMode` / `exitGuestMode` |
| `src/routes/_authenticated/route.tsx` | ✏️ 改 | 游客跳过 `getCurrentUser`（~2 行） |
| `src/lib/api.ts` | ✏️ 改 | adapter 运行时判断（~5 行） |
| `src/features/auth/sign-in/components/user-auth-form.tsx` | ✏️ 改 | 加游客登录按钮（~10 行） |
| `src/components/layout/header.tsx`（或 sidebar） | ✏️ 改 | 加游客角标（~5 行） |
| `src/main.tsx` | ✏️ 改 | 401 监听加 isGuest 守卫（~2 行） |

**总计**：新建 3 文件，改动 5 文件，改动行数约 30 行（不含 mock-db 数据生成）。service 层、组件层**零改动**。

---

## 附录：现有可复用资源

- `src/features/cats/data/cats.ts` —— cats faker 生成器（50 条），直接 import
- `src/features/cats/data/data.ts` —— breeds / catCafeStatuses / stores 基础枚举值
- `src/features/*/data/*.ts` —— 各非后端模块的现有 mock 数据（无需改动）
- `@faker-js/faker` —— 已是 devDep
