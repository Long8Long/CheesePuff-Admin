import { z } from 'zod'

/**
 * AI 填充输出的 Schema
 * 用于验证 AI 返回的结构化数据
 */
export const catAIOutputSchema = z.object({
  name: z.string().optional(),
  breed: z
    .enum([
      '豹猫妹妹',
      '纯白德文妹妹',
      '短毛11色金渐层妹妹',
      '短毛12色金渐层弟弟',
      '短毛12色金渐层妹妹',
      '短毛金点弟弟',
      '短毛金点妹妹',
      '短毛金加白弟弟',
      '短毛蓝金加白弟弟',
      '短毛蓝金渐层弟弟',
      '短毛紫金弟弟',
      '短毛紫金渐层妹妹',
      '短毛紫金妹妹',
      '海山双布偶妹妹',
      '黑白德文卷毛猫妹妹',
      '虎斑加白德文妹妹',
      '蓝双布偶妹妹',
      '蓝重点加白曼基康妹妹',
      '长毛金渐层弟弟',
      '长毛紫金弟弟',
      '长毛紫金渐层妹妹',
      '棕虎斑缅因弟弟',
    ])
    .optional(),
  store: z.enum(['山东店', '苏州店']).optional(),
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
