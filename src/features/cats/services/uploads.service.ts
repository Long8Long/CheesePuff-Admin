/**
 * Upload API Service / 上传 API 服务
 *
 * Handles batch image uploads for cats
 * 处理猫咪图片批量上传
 */

import api from '@/lib/api'

// ============================================
// Types / 类型定义
// ============================================

export interface UploadFile {
  success: boolean
  originalUrl: string | null
  thumbnailUrl: string | null
  url: string | null // Fallback for compatibility
  filename: string
  error: string | null
}

export interface BatchUploadResponse {
  files: UploadFile[]
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// ============================================
// Upload Service / 上传服务
// ============================================

/**
 * Upload Service / 上传服务
 */
export const uploadService = {
  /**
   * Upload cat images / 上传猫咪图片
   * POST /api/v1/admin/uploads/batch
   *
   * @param files - List of image files to upload
   * @returns Promise<UploadFile[]> - Array of upload results
   */
  uploadCatImages: async (files: File[]): Promise<UploadFile[]> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('upload_type', 'cat_image')

    const response = await api.post<ApiResponse<BatchUploadResponse>>(
      '/api/v1/admin/uploads/batch',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data.data.files
  },
}
