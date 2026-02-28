import { z } from 'zod'

/**
 * AI 填充输出的 Schema
 * 用于验证 AI 返回的结构化数据
 * 注意：后端返回 snake_case，但拦截器会自动转换为 camelCase
 */
export const catAIOutputSchema = z.object({
  name: z.string().nullable(),
  breed: z.string().nullable(),
  storeName: z.string().nullable(), // 拦截器转换后为 storeName (原 store_id)
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  price: z.number().nullable(),
  description: z.string().nullable(),
  catcafeStatus: z.string().nullable(), // 拦截器转换后为 catcafeStatus (原 catcafe_status)
  visible: z.boolean().nullable(),
})

export type CatAIOutput = z.infer<typeof catAIOutputSchema>

/**
 * AI 填充请求输入
 */
export interface CatAIFillInput {
  text?: string
  images?: string[] // 图片 URL 数组
}
