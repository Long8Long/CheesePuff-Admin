/**
 * Cats API Service / 猫咪 API 服务
 *
 * Cat-related API calls for v1 endpoints
 * v1 端点的猫咪相关 API 调用
 */

import api from '@/lib/api'
import type {
  GetCatsListParams,
  CatCreate,
  CatUpdate,
  PaginatedResponse,
  ApiResponse,
  Cat,
} from '@/features/cats/models'

// ============================================
// API Service Functions / API 服务函数
// ============================================

/**
 * Cats Service / 猫咪管理服务
 */
export const catsService = {
  /**
   * Get cats list / 获取猫咪列表
   * GET /api/v1/admin/cats
   */
  getList: async (
    params: GetCatsListParams
  ): Promise<PaginatedResponse<Cat>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Cat>>>(
      '/api/v1/admin/cats',
      { params }
    )
    return response.data.data
  },

  /**
   * Get cat by ID / 根据 ID 获取猫咪
   * GET /api/v1/admin/cats/:id
   */
  getById: async (id: string): Promise<Cat> => {
    const response = await api.get<ApiResponse<Cat>>(`/api/v1/admin/cats/${id}`)
    return response.data.data
  },

  /**
   * Create a new cat / 创建新猫咪
   * POST /api/v1/admin/cats
   */
  create: async (data: CatCreate): Promise<Cat> => {
    const response = await api.post<ApiResponse<Cat>>(
      '/api/v1/admin/cats',
      data
    )
    return response.data.data
  },

  /**
   * Update cat information / 更新猫咪信息
   * PUT /api/v1/admin/cats/:id
   */
  update: async (id: string, data: CatUpdate): Promise<Cat> => {
    const response = await api.put<ApiResponse<Cat>>(
      `/api/v1/admin/cats/${id}`,
      data
    )
    return response.data.data
  },

  /**
   * Delete a cat / 删除猫咪
   * DELETE /api/v1/admin/cats/:id
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/cats/${id}`)
  },

  /**
   * Bulk delete cats / 批量删除猫咪
   * DELETE /api/v1/admin/cats/bulk
   */
  bulkDelete: async (ids: string[]): Promise<void> => {
    await api.delete('/api/v1/admin/cats/bulk', { data: { ids } })
  },
}
