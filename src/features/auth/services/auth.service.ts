/**
 * Auth API Service / 认证 API 服务
 *
 * Authentication-related API calls
 * 认证相关 API 调用
 */

import api from '@/lib/api'
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  CurrentUserResponse,
} from '../models'

/**
 * Auth Service / 认证服务
 */
export const authService = {
  /**
   * User login / 用户登录
   * POST /api/v1/admin/auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
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
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await api.get('/api/v1/admin/auth/me')
    return response.data
  },
}
