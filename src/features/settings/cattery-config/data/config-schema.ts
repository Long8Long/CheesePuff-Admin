import { z } from 'zod'

export const configFormSchema = z.object({
  value: z.union([
    z.string().min(1, '配置值不能为空'),
    z.array(z.string()).min(1, '至少需要一个配置项'),
  ]),
  description: z.string().min(1, '描述不能为空').max(200, '描述不能超过200字符'),
})

export type ConfigFormData = z.infer<typeof configFormSchema>
