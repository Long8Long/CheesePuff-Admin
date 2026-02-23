import { z } from 'zod'

/**
 * AI 填充输出的 Schema
 * 用于验证 AI 返回的结构化数据
 */
export const catAIOutputSchema = z.object({
  name: z.string().optional(),
  breed: z.string().optional(),
  store: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  catcafeStatus: z.string().optional(),
  visible: z.boolean().optional(),
})

export type CatAIOutput = z.infer<typeof catAIOutputSchema>

/**
 * AI 填充请求输入
 */
export interface CatAIFillInput {
  text?: string
  images?: string[] // 图片 URL 数组
}
