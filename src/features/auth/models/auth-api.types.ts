/**
 * Auth API Types / 认证 API 类型
 *
 * API request and response types for authentication operations
 * 认证操作的 API 请求和响应类型
 */

import type { LoginResponseData, User } from './auth.types'
import type { ApiResponseV2 } from '@/models/common.types'

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * Login response wrapper / 登录响应包装器
 */
export type LoginResponse = ApiResponseV2<LoginResponseData>

/**
 * Logout response / 登出响应
 */
export interface LogoutResponse {
  code: number
  message: string
}

/**
 * Current user response / 当前用户响应
 */
export type CurrentUserResponse = ApiResponseV2<User>

// ============================================
// Exports / 导出
// ============================================

export type { LoginResponseData, User, LoginRequest } from './auth.types'
export type { ApiResponseV2 } from '@/models/common.types'
