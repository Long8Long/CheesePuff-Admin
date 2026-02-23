import { z } from 'zod'
import type { Cat, CatCafeStatus, Store } from '../models'

// Define the enum separately for reuse / 单独定义枚举以便复用
const catCafeStatusEnum = z.string()
const storeEnum = z.string()

/**
 * Zod schema for Cat validation
 * Cat 验证的 Zod schema
 *
 * Note: The Cat type is defined in ../models/cat.types.ts
 * 类型定义在 ../models/cat.types.ts
 */
export const catSchema: z.ZodType<Cat> = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  breed: z.string().min(1, '品种不能为空'),
  store: storeEnum.nullable().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误，应为 YYYY-MM-DD')
    .nullable()
    .optional(),
  price: z.number().positive('价格必须大于0').nullable().optional(),
  images: z.array(z.string()).nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  catcafeStatus: catCafeStatusEnum.nullish(),
  visible: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const catListSchema = z.array(catSchema)

// Re-export types for convenience / 为方便起见重新导出类型
export type { Cat, CatCafeStatus, Store }
