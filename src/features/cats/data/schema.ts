import { z } from 'zod'

export const catCafeStatusSchema = z.union([
  z.literal('working'),
  z.literal('resting'),
  z.literal('sick'),
  z.literal('retired'),
  z.literal('pregnant'),
  z.literal('nursing'),
])

export type CatCafeStatus = z.infer<typeof catCafeStatusSchema>

export const storeSchema = z.union([
  z.literal('山东店'),
  z.literal('苏州店'),
])

export type Store = z.infer<typeof storeSchema>

export const catSchema = z.object({
  id: z.string(),
  name: z.string().min(1, '名称不能为空'),
  breed: z.string().min(1, '品种不能为空'),
  store: storeSchema,
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误，应为 YYYY-MM-DD'),
  price: z.number().positive('价格必须大于0'),
  images: z.array(z.string()).min(1, '至少需要一张图片'),
  thumbnail: z.string().optional(),
  description: z.string().min(1, '描述不能为空'),
  catcafeStatus: catCafeStatusSchema,
  visible: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

export type Cat = z.infer<typeof catSchema>

export const catListSchema = z.array(catSchema)
