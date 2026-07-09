import { z } from 'zod'
import type { Cat, CatCafeStatus, Store } from '../models'

/**
 * Media item schema / 媒体资源 schema
 * url 为原图/视频地址，thumbnail 为缩略图/视频首帧（历史数据可能为 null）
 */
export const mediaItemSchema = z.object({
  url: z.string(),
  thumbnail: z.string().nullable(),
})

/**
 * Zod schema for Cat validation
 * Cat 验证的 Zod schema
 */
export const catSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  breed: z.string().min(1, '品种不能为空'),
  storeName: z.string().nullish(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误，应为 YYYY-MM-DD')
    .nullish(),
  price: z.number().positive('价格必须大于0').nullish(),
  images: z.array(mediaItemSchema).nullish(),
  videos: z.array(mediaItemSchema).nullish(),
  idCardImage: z.array(mediaItemSchema).nullish(),
  description: z.string().nullish(),
  catcafeStatus: z.string().nullish(),
  visible: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}) as z.ZodType<Cat>

export const catListSchema = z.array(catSchema)

// Re-export types for convenience / 为方便起见重新导出类型
export type { Cat, CatCafeStatus, Store }
