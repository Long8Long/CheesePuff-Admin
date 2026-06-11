/**
 * Upload API Service / 上传 API 服务
 *
 * Handles batch image/video uploads for cats
 * 处理猫咪图片/视频批量上传
 */

import api from '@/lib/api'
import { toast } from 'sonner'

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
  failed?: UploadFile[]
}

// ============================================
// Constants / 常量
// ============================================

const VIDEO_ALLOWED_EXTENSIONS = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
const VIDEO_MAX_SIZE_MB = 100
const VIDEO_MAX_COUNT = 5

// ============================================
// Upload Service / 上传服务
// ============================================

/**
 * Validate video files before upload / 上传前校验视频文件
 * Returns valid files array, or throws with specific error messages
 */
function validateVideoFiles(files: File[]): File[] {
  const errors: string[] = []
  const validFiles: File[] = []

  if (files.length > VIDEO_MAX_COUNT) {
    throw new Error(`最多只能上传 ${VIDEO_MAX_COUNT} 个视频文件，当前选择了 ${files.length} 个`)
  }

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !VIDEO_ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`"${file.name}" 格式不支持，仅支持 ${VIDEO_ALLOWED_EXTENSIONS.join('、')} 格式`)
      continue
    }
    if (file.size > VIDEO_MAX_SIZE_MB * 1024 * 1024) {
      errors.push(`"${file.name}" 大小超过 ${VIDEO_MAX_SIZE_MB}MB 限制（当前 ${(file.size / 1024 / 1024).toFixed(1)}MB）`)
      continue
    }
    validFiles.push(file)
  }

  if (errors.length > 0) {
    errors.forEach((err) => toast.error(err))
  }

  return validFiles
}

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

    const { data } = await api.post<BatchUploadResponse>(
      '/api/v1/admin/uploads/batch',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return data.files
  },

  /**
   * Upload cat videos / 上传猫咪视频
   * POST /api/v1/admin/uploads/batch (upload_type=video)
   *
   * @param files - List of video files to upload
   * @returns Promise<UploadFile[]> - Array of upload results (only successful ones)
   * @throws Error if all files fail validation or upload
   */
  uploadVideos: async (files: File[]): Promise<UploadFile[]> => {
    const validFiles = validateVideoFiles(files)

    if (validFiles.length === 0) {
      throw new Error('没有可上传的有效视频文件')
    }

    const formData = new FormData()
    validFiles.forEach((file) => formData.append('files', file))
    formData.append('upload_type', 'video')

    const { data } = await api.post<BatchUploadResponse>(
      '/api/v1/admin/uploads/batch',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    // Report partial failures with specific error messages
    if (data.failed && data.failed.length > 0) {
      data.failed.forEach((f) => {
        toast.error(`"${f.filename}" 上传失败：${f.error || '未知错误'}`)
      })
    }

    if (data.files.length === 0) {
      throw new Error('所有视频文件上传失败')
    }

    return data.files
  },
}
