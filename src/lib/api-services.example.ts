/**
 * API Service Layer Example
 * API 服务层示例文件
 *
 * This file demonstrates how to organize API calls in a structured way.
 * 此文件演示如何以结构化方式组织 API 调用。
 *
 * Usage: Create service files for each feature (e.g., auth.service.ts, cats.service.ts)
 * 使用方法：为每个功能创建服务文件（如 auth.service.ts, cats.service.ts）
 */

import api from '@/lib/api'

// ============================================
// Type Definitions / 类型定义
// ============================================

interface LoginRequest {
  username: string
  password: string
}

interface User {
  id: string
  username: string
  role: string
  is_active: boolean
  created_at: string
  last_login: string
}

interface LoginResponseData {
  access_token: string
  expires_in: number
  user: User
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface LoginResponse extends ApiResponse<LoginResponseData> {}

// ============================================
// API Service Functions / API 服务函数
// ============================================

/**
 * Auth Service / 认证服务
 */
export const authService = {
  /**
   * User login / 用户登录
   * POST /api/admin/auth/login
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/admin/auth/login', data)
    return response.data
  },

  /**
   * User logout / 用户登出
   * POST /api/admin/auth/logout
   */
  logout: async () => {
    const response = await api.post('/api/admin/auth/logout')
    return response.data
  },

  /**
   * Get current user info / 获取当前用户信息
   * GET /api/admin/auth/me
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/admin/auth/me')
    return response.data
  },
}

/**
 * Cats Service / 猫咪管理服务
 */
export const catsService = {
  /**
   * Get cats list / 获取猫咪列表
   * GET /api/admin/cats
   */
  getList: async (params: { page: number; pageSize: number }) => {
    const response = await api.get('/api/admin/cats', { params })
    return response.data
  },

  /**
   * Create a new cat / 创建新猫咪
   * POST /api/admin/cats
   */
  create: async (data: { name: string; breed: string; age: number }) => {
    const response = await api.post('/api/admin/cats', data)
    return response.data
  },

  /**
   * Update cat information / 更新猫咪信息
   * PUT /api/admin/cats/:id
   */
  update: async (id: number, data: { name: string; breed: string; age: number }) => {
    const response = await api.put(`/api/admin/cats/${id}`, data)
    return response.data
  },

  /**
   * Delete a cat / 删除猫咪
   * DELETE /api/admin/cats/:id
   */
  delete: async (id: number) => {
    const response = await api.delete(`/api/admin/cats/${id}`)
    return response.data
  },
}

// ============================================
// Usage Example / 使用示例
// ============================================

/**
 * Example: Using the service in a component
 * 示例：在组件中使用服务
 *
 * ```tsx
 * import { authService } from '@/lib/api-services'
 *
 * async function handleLogin(username: string, password: string) {
 *   try {
 *     const result = await authService.login({ username, password })
 *     if (result.code === 200) {
 *       // Handle success
 *       console.log('Access Token:', result.data.access_token)
 *       console.log('User:', result.data.user)
 *     }
 *   } catch (error) {
 *     // Handle error
 *     console.error('Login failed:', error.message)
 *   }
 * }
 * ```
 */
