import { z } from 'zod'

/**
 * AI 填充输出的 Schema
 * 用于验证 AI 返回的结构化数据
 */
export const catAIOutputSchema = z.object({
  name: z.string().optional(),
  breed: z
    .enum([
      '布偶猫',
      '英短',
      '美短',
      '暹罗猫',
      '波斯猫',
      '缅因猫',
      '斯芬克斯',
      '金渐层',
      '银渐层',
      '加菲猫',
      '折耳猫',
      '孟加拉豹猫',
      '挪威森林猫',
      '俄罗斯蓝猫',
      '新加坡猫',
    ])
    .optional(),
  breedEn: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  price: z.number().positive().optional(),
  description: z.string().optional(),
  catcafeStatus: z
    .enum(['working', 'resting', 'sick', 'retired', 'pregnant', 'nursing'])
    .optional(),
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
