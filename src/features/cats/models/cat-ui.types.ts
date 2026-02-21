/**
 * Cat UI Types / 猫咪 UI 类型
 *
 * UI-specific types, options, and configurations
 * UI 专用类型、选项和配置
 */

import type { CatCafeStatus } from './cat.types'

// ============================================
// Type Definitions / 类型定义
// ============================================

/**
 * Select option format / 下拉选项格式
 */
export interface SelectOption {
  label: string
  value: string
}

/**
 * Breed option / 品种选项
 */
export type BreedOption = SelectOption

/**
 * Store option / 门店选项
 */
export type StoreOption = SelectOption

/**
 * Status option / 状态选项
 */
export type StatusOption = SelectOption

/**
 * Status color mapping / 状态颜色映射
 */
export type StatusColorMap = Map<CatCafeStatus, string>

// Re-export CatCafeStatus for convenience
export type { CatCafeStatus }
