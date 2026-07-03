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
 * 原图/视频与其缩略图原子绑定，拖拽重排时缩略图随对象自动跟随，避免错位。
 * `thumbnail` 为图片缩略图 / 视频首帧；历史数据可能为 null，渲染时需降级用 url。
 */
export interface MediaItem {
  url: string
  thumbnail: string | null
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
  description: string | null | undefined
  catcafeStatus: CatCafeStatus | null | undefined
  visible: boolean
  createdAt: string | undefined
  updatedAt: string | undefined
}
