/**
 * Mock Adapter / axios Mock 适配器
 *
 * 在游客模式下替换 axios 默认 adapter，拦截所有请求并路由到内存 DB。
 * 返回标准 { code, message, data } 格式，由 api.ts 响应拦截器自动解包，
 * service 层与组件层完全无感。
 *
 * 注意：请求拦截器在 adapter 之前执行，已把 body/params 转成 snake_case。
 * 因此路由匹配时 url/method 不受影响，但 params 的键名是 snake_case 形态，
 * handler 内部按 snake_case 取值（如 params.catcafe_status）。
 */

import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import humps from 'humps'
import { mockDB } from './mock-db'

// 模拟网络延迟（让 loading 态更真实）
const MOCK_DELAY = 300

/**
 * 解析请求体（FormData 不解析，保留原样供特殊处理）
 * 注意：请求拦截器已把 JSON body/params 转成 snake_case，
 * 这里 camelizeKeys 还原为 camelCase，使 mock-db 可直接用 camelCase 取值。
 */
function parseBody(data: unknown): Record<string, unknown> {
  // FormData 跳过转换（上传场景特殊处理）
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return {}
  }
  if (typeof data === 'string') {
    try {
      return humps.camelizeKeys(JSON.parse(data)) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (data && typeof data === 'object')
    return humps.camelizeKeys(data) as Record<string, unknown>
  return {}
}

/**
 * 将 params（已被请求拦截器转成 snake_case）还原为 camelCase
 */
function parseParams(params: unknown): Record<string, unknown> {
  if (params && typeof params === 'object')
    return humps.camelizeKeys(params) as Record<string, unknown>
  return {}
}

/**
 * 包装成标准成功响应
 * 走响应拦截器后 code=200 会自动解包，service 层拿到 data 部分
 */
function ok(data: unknown): { code: number; message: string; data: unknown } {
  return { code: 200, message: 'success', data }
}

/**
 * 构造 mock 错误响应（用于未覆盖的接口，便于发现遗漏）
 */
function notFound(
  config: InternalAxiosRequestConfig,
  method: string,
  url: string
): AxiosResponse {
  return {
    data: { code: 404, message: `Mock 未覆盖的接口: ${method.toUpperCase()} ${url}`, data: null },
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
  }
}

/**
 * 路径参数匹配
 * @returns 匹配成功返回 { params: Record<string,string> }，否则 null
 */
function matchPath(
  pattern: string,
  url: string
): Record<string, string> | null {
  const patternParts = pattern.split('/')
  const urlParts = url.split('/')
  if (patternParts.length !== urlParts.length) return null

  const extracted: Record<string, string> = {}
  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i]
    const u = urlParts[i]
    if (p.startsWith(':')) {
      extracted[p.slice(1)] = decodeURIComponent(u)
    } else if (p !== u) {
      return null
    }
  }
  return extracted
}

/**
 * 路由分发：按 method + url 匹配到对应 handler
 */
function dispatch(method: string, url: string, body: Record<string, unknown>, params: Record<string, unknown>, config?: InternalAxiosRequestConfig): unknown {
  const m = method.toLowerCase()
  const tryMatch = (verb: string, pattern: string) =>
    verb.toLowerCase() === m ? matchPath(pattern, url) : null

  // ─── Cats ───
  // 注意：list 用 GET 且无 id；bulk delete 是固定子路径，需在 :id 之前匹配
  if (tryMatch('GET', '/api/v1/admin/cats')) {
    return ok(mockDB.listCats(params as never))
  }
  {
    const p = tryMatch('GET', '/api/v1/admin/cats/:id')
    if (p) {
      const cat = mockDB.findCat(p.id)
      if (!cat) return ok(null)
      return ok(cat)
    }
  }
  if (tryMatch('POST', '/api/v1/admin/cats')) {
    return ok(mockDB.createCat(body as never))
  }
  {
    const p = tryMatch('PATCH', '/api/v1/admin/cats/:id')
    if (p) return ok(mockDB.updateCat(p.id, body as never))
  }
  if (tryMatch('DELETE', '/api/v1/admin/cats/bulk')) {
    mockDB.bulkRemoveCats((body.ids as string[]) ?? [])
    return ok(null)
  }
  {
    const p = tryMatch('DELETE', '/api/v1/admin/cats/:id')
    if (p) {
      mockDB.removeCat(p.id)
      return ok(null)
    }
  }

  // ─── Stores ───
  if (tryMatch('GET', '/api/v1/admin/stores')) {
    return ok(mockDB.listStores(params as never))
  }
  {
    const p = tryMatch('GET', '/api/v1/admin/stores/:id')
    if (p) {
      const store = mockDB.findStore(p.id)
      return ok(store ?? null)
    }
  }
  if (tryMatch('POST', '/api/v1/admin/stores')) {
    return ok(mockDB.createStore(body as never))
  }
  {
    const p = tryMatch('PATCH', '/api/v1/admin/stores/:id')
    if (p) return ok(mockDB.updateStore(p.id, body as never))
  }
  if (tryMatch('DELETE', '/api/v1/admin/stores/bulk')) {
    mockDB.bulkRemoveStores((body.ids as string[]) ?? [])
    return ok(null)
  }
  {
    const p = tryMatch('DELETE', '/api/v1/admin/stores/:id')
    if (p) {
      mockDB.removeStore(p.id)
      return ok(null)
    }
  }

  // ─── Cat Breeds ───
  if (tryMatch('GET', '/api/v1/admin/cat-breeds')) {
    return ok(mockDB.listBreeds())
  }
  if (tryMatch('POST', '/api/v1/admin/cat-breeds')) {
    return ok(mockDB.createBreed(body as never))
  }
  {
    const p = tryMatch('PATCH', '/api/v1/admin/cat-breeds/:id')
    if (p) return ok(mockDB.updateBreed(p.id, body as never))
  }
  {
    const p = tryMatch('DELETE', '/api/v1/admin/cat-breeds/:id')
    if (p) {
      mockDB.removeBreed(p.id)
      return ok(null)
    }
  }

  // ─── Cat Statuses ───
  if (tryMatch('GET', '/api/v1/admin/cat-statuses')) {
    return ok(mockDB.listStatuses())
  }
  if (tryMatch('POST', '/api/v1/admin/cat-statuses')) {
    return ok(mockDB.createStatus(body as never))
  }
  {
    const p = tryMatch('PATCH', '/api/v1/admin/cat-statuses/:id')
    if (p) return ok(mockDB.updateStatus(p.id, body as never))
  }
  {
    const p = tryMatch('DELETE', '/api/v1/admin/cat-statuses/:id')
    if (p) {
      mockDB.removeStatus(p.id)
      return ok(null)
    }
  }

  // ─── Configs ───
  if (tryMatch('GET', '/api/v1/admin/configs')) {
    return ok(mockDB.listConfigs(params as never))
  }
  {
    const p = tryMatch('GET', '/api/v1/admin/configs/:key')
    if (p) {
      const config = mockDB.findConfig(p.key)
      return ok(config ?? null)
    }
  }
  {
    const p = tryMatch('PUT', '/api/v1/admin/configs/:key')
    if (p) return ok(mockDB.updateConfig(p.key, body as never))
  }

  // ─── Uploads（返回占位图 URL）───
  if (tryMatch('POST', '/api/v1/admin/uploads/batch')) {
    return ok(mockUpload(config?.data))
  }

  return null
}

/**
 * 生成上传 mock 响应
 * 从 FormData 读取 upload_type，返回占位图 URL。
 * FormData 无法在 adapter 便捷解析文件列表，故直接按上传类型生成占位。
 */
function mockUpload(data: unknown) {
  let uploadType = 'cat_image'
  let fileCount = 1
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    uploadType = (data.get('upload_type') as string) ?? 'cat_image'
    // 统计实际文件数量，生成对应数量的占位结果
    fileCount = 0
    data.forEach((value) => {
      if (value instanceof File) fileCount++
    })
    if (fileCount === 0) fileCount = 1
  }

  const isVideo = uploadType === 'cat_video'
  const stamp = Date.now()

  const files = Array.from({ length: fileCount }, (_, i) => {
    const seed = Math.floor(Math.random() * 1000) + i
    const placeholderUrl = isVideo
      ? `https://loremflickr.com/640/360/cat?lock=${seed}`
      : `https://loremflickr.com/400/400/cat?lock=${seed}`
    const thumbUrl = `https://loremflickr.com/200/200/cat?lock=${seed}`
    return {
      success: true,
      originalUrl: placeholderUrl,
      thumbnailUrl: thumbUrl,
      url: placeholderUrl,
      filename: isVideo
        ? `mock-video-${stamp}-${i}.mp4`
        : `mock-image-${stamp}-${i}.jpg`,
      error: null,
    }
  })

  return { files, failed: [] }
}

// ============================================
// Axios Mock Adapter
// ============================================

export const mockAdapter: AxiosAdapter = async (config) => {
  // 模拟网络延迟
  if (MOCK_DELAY > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY))
  }

  const method = (config.method || 'get').toLowerCase()
  // baseURL 不包含在 config.url 中（config.url 是相对路径），直接取
  const url = config.url || ''
  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData
  const body = parseBody(config.data)
  const params = parseParams(config.params)

  const result = dispatch(method, url, body, params, isFormData ? config : undefined)

  if (result === null) {
    return notFound(config, method, url)
  }

  const response: AxiosResponse = {
    data: result,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }
  return response
}
