/**
 * Auth Entity Types / 认证实体类型
 *
 * Core authentication entity definitions
 * 核心认证实体定义
 */

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * User entity / 用户实体
 *
 * Represents a user in the system
 * 表示系统中的用户
 */
export interface User {
  id: string
  username: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin: string
}

/**
 * Login request payload / 登录请求负载
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * Login response data / 登录响应数据
 */
export interface LoginResponseData {
  accessToken: string
  expiresIn: number
  user: User
}
