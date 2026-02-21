/**
 * Common API Types / 通用 API 类型
 *
 * Shared type definitions used across different API services
 * 跨不同 API 服务共享的类型定义
 */

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * Standard API Response wrapper / 标准 API 响应包装器
 */
interface ApiResponse<T> {
  data: T
  code?: number
  message?: string
}

/**
 * Alternative API Response format (used in some services)
 * 替代 API 响应格式（某些服务使用）
 */
interface ApiResponseV2<T> {
  code: number
  message: string
  data: T
}

// ============================================
// Exports / 导出
// ============================================

export type { ApiResponse, ApiResponseV2 }
