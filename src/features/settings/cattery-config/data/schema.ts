import { z } from 'zod'

export const catBreedSchema = z.object({
  name: z.string().min(1, '品种名称不能为空').max(50, '品种名称不能超过50字符'),
})

export const catStatusSchema = z.object({
  name: z.string().min(1, '状态名称不能为空').max(50, '状态名称不能超过50字符'),
})

export type CatBreedFormData = z.infer<typeof catBreedSchema>
export type CatStatusFormData = z.infer<typeof catStatusSchema>
