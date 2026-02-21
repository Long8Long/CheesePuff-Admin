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
  | 'working'
  | 'resting'
  | 'sick'
  | 'retired'
  | 'pregnant'
  | 'nursing'
  | 'training'

/**
 * Store location / 门店位置
 */
export type Store = '山东店' | '苏州店'

/**
 * Cat entity / 猫咪实体
 *
 * This is the core Cat type used throughout the application
 * 这是整个应用中使用的核心 Cat 类型
 */
export interface Cat {
  id: string
  name: string | null
  breed: string
  store: Store | null
  birthday: string | null
  price: number | null
  images: string[] | null
  thumbnail: string | null
  description: string | null
  catcafeStatus: CatCafeStatus | null
  visible: boolean
  createdAt: string | undefined
  updatedAt: string | undefined
}
