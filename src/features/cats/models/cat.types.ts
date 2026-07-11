/**
 * Cat Entity Types / 猫咪实体类型
 *
 * Core Cat entity definition used across the application
 * 跨应用使用的核心猫咪实体定义
 */

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * Cat cafe working status / 猫咖工作状态
 */
export type CatCafeStatus =
  | '工作中'
  | '休息中'
  | '生病中'
  | '已退休'
  | '怀孕中'
  | '哺乳期'
  | '训练中'

/**
 * Store location / 门店位置
 */
export type Store = string

/**
 * Media item / 媒体资源
 *
 * `url` 为原图/视频地址；图片缩略图不再独立存储，改由 OSS 按场景实时生成
 * （见 src/lib/image.ts 的 withImageProcess），分辨率可控、流量更省。
 * `thumbnail` 仅用于视频首帧（OSS 图片处理无法从视频 URL 生成缩略图），
 * 图片数据中应视为 undefined。
 */
export interface MediaItem {
  url: string
  /** 视频首帧；图片数据不使用此字段 */
  thumbnail?: string | null
}

/**
 * Cat entity / 猫咪实体
 *
 * This is the core Cat type used throughout the application
 * 这是整个应用中使用的核心 Cat 类型
 */
export interface Cat {
  id: string
  name: string | null | undefined
  breed: string
  storeName: Store | null
  birthday: string | null
  price: number | null
  images: MediaItem[] | null
  videos: MediaItem[] | null
  /**
   * 身份卡图片（小程序详情页展示，当前限 1 张，结构预留多张） / ID card image
   */
  idCardImage: MediaItem[] | null
  description: string | null | undefined
  catcafeStatus: CatCafeStatus | null | undefined
  visible: boolean
  createdAt: string | undefined
  updatedAt: string | undefined
}
