import axios from 'axios'
import humps from 'humps'
import { toast } from 'sonner'
import { getCookie, removeCookie } from './cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// ============================================
// Helper Functions / 辅助函数
// ============================================

/**
 * Check if response is standard format { code, message, data }
 * 检查响应是否为标准格式
 */
function isStandardResponse(data: unknown): data is { code: number; message: string; data: unknown } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'data' in data &&
    typeof (data as Record<string, unknown>).code === 'number'
  )
}

/**
 * Check if business code indicates success
 * 检查业务码是否表示成功
 */
const BUSINESS_SUCCESS_CODES = [200, 0, 201, 204]
function isBusinessError(code: number): boolean {
  return !BUSINESS_SUCCESS_CODES.includes(code)
}

/**
 * Get default error message by HTTP status code
 * 根据 HTTP 状态码获取默认错误消息
 */
function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '权限不足，无法访问该资源',
    404: '请求的资源不存在',
    408: '请求超时，请稍后重试',
    409: '资源冲突，请稍后重试',
    422: '数据验证失败',
    500: '服务器内部错误，请稍后重试',
    502: '网关错误，请稍后重试',
    503: '服务暂时不可用，请稍后重试',
    504: '网关超时，请稍后重试',
  }
  return messages[status] || `请求失败 (HTTP ${status})`
}

// Request interceptor - add auth token and convert camelCase to snake_case
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Convert request data from camelCase to snake_case
    // Skip transformation for FormData (multipart/form-data requests)
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = humps.decamelizeKeys(config.data, {
        // Don't convert keys that are all uppercase (like IDs)
        process: (key: string) => {
          // If key is all uppercase or already snake_case, keep it as is
          if (/^[A-Z_]+$/.test(key)) {
            return key
          }
          return humps.decamelize(key)
        },
      });
    }

    // Convert request params from camelCase to snake_case
    if (config.params && typeof config.params === 'object') {
      config.params = humps.decamelizeKeys(config.params, {
        process: (key: string) => {
          if (/^[A-Z_]+$/.test(key)) {
            return key
          }
          return humps.decamelize(key)
        },
      })
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle success/error and convert snake_case to camelCase
api.interceptors.response.use(
  (response) => {
    // Convert response data from snake_case to camelCase
    if (response.data && typeof response.data === 'object') {
      response.data = humps.camelizeKeys(response.data, {
        process: (key: string) => humps.camelize(key),
      })
    }

    // 统一解包标准响应格式 { code, message, data }
    if (isStandardResponse(response.data)) {
      const { code, message, data } = response.data

      // 业务错误处理
      if (isBusinessError(code)) {
        toast.error(message || '操作失败')
        return Promise.reject({
          message: message || '操作失败',
          code,
          data,
        })
      }

      // 成功，替换为 data 部分
      response.data = data
    }

    return response
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response

      // 获取错误消息（优先使用后端返回的 message）
      const errorMessage = data?.message || data?.msg || getDefaultErrorMessage(status)

      // Handle 401 unauthorized
      if (status === 401) {
        const hasAuthToken = config?.headers?.Authorization
        if (hasAuthToken) {
          removeCookie('access_token')
          removeCookie('user')
          window.location.href = '/sign-in'
        }
      }

      // 显示错误提示（401 跳转前也显示提示）
      if (status !== 401 || !config?.headers?.Authorization) {
        toast.error(errorMessage)
      }

      return Promise.reject({
        message: errorMessage,
        code: status,
        data: data,
      })
    }

    // Network error
    toast.error('网络连接失败，请检查网络设置')
    return Promise.reject({
      message: '网络连接失败，请检查网络设置',
      code: 0,
    })
  }
)

export default api
