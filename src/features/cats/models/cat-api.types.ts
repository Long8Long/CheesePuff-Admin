/**
 * Cat API Types / 猫咪 API 类型
 *
 * API request and response types for cat operations
 * 猫咪操作的 API 请求和响应类型
 */

import type { Cat } from './cat.types'

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * Base mutable cat fields (excluding system-managed fields)
 * 基础可变猫咪字段（排除系统管理字段）
 */
type CatMutableFields = Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Parameters for getting cats list / 获取猫咪列表的参数
 */
export interface GetCatsListParams {
  page?: number
  pageSize?: number
  breed?: string
  catcafeStatus?: string
  includeHidden?: boolean
}

/**
 * Data for creating a new cat / 创建新猫咪的数据
 * All fields optional except required ones, with null support
 */
export type CatCreate = Partial<NullableFields<Pick<CatMutableFields, 'name' | 'price' | 'description' | 'catcafeStatus' | 'images' | 'thumbnail' | 'storeName'>>> &
  Pick<CatMutableFields, 'breed' | 'birthday'>

/**
 * Data for updating a cat / 更新猫咪的数据
 * All fields optional with null support
 */
export type CatUpdate = Partial<NullableFields<CatMutableFields>>

/**
 * Paginated response structure / 分页响应结构
 */
export interface PaginatedResponse<T> {
  cats: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * API response wrapper / API 响应包装器
 */
export interface ApiResponse<T> {
  data: T
  code?: number
  message?: string
}

// ============================================
// Utility Types / 工具类型
// ============================================

/**
 * Make object properties nullable
 * 将对象属性变为可空
 */
type NullableFields<T> = {
  [P in keyof T]: T[P] | null
}

// Re-export Cat for convenience
export type { Cat }
