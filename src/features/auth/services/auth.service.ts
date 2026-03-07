/**
 * Auth API Service / 认证 API 服务
 *
 * Authentication-related API calls
 * 认证相关 API 调用
 */

import api from '@/lib/api'
import type {
  LoginRequest,
  LoginResponseData,
  LogoutResponse,
} from '../models'
import type { User } from '@/features/auth/models'

/**
 * Auth Service / 认证服务
 */
export const authService = {
  /**
   * User login / 用户登录
   * POST /api/v1/admin/auth/login
   *
   * Note: Returns LoginResponseData directly because the API interceptor
   * automatically unwraps the { code, message, data } response format.
   * 返回已解包的 LoginResponseData，因为拦截器会自动解包 { code, message, data } 格式
   */
  login: async (data: LoginRequest): Promise<LoginResponseData> => {
    const response = await api.post<LoginResponseData>(
      '/api/v1/admin/auth/login',
      data
    )
    return response.data
  },

  /**
   * User logout / 用户登出
   * POST /api/v1/admin/auth/logout
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await api.post('/api/v1/admin/auth/logout')
    return response.data
  },

  /**
   * Get current user info / 获取当前用户信息
   * GET /api/v1/admin/auth/me
   */
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/api/v1/admin/auth/me')
    return data
  },
}
