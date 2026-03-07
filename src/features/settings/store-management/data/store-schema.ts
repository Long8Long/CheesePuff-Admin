import { z } from 'zod'

export const storeTypeEnum = z.enum(['main', 'branch'], {
  message: '请选择店铺类型',
})

export const storeLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

export const storeFormSchema = z.object({
  name: z.string().min(1, '门店名称不能为空').max(100, '门店名称不能超过100字符'),
  type: storeTypeEnum.optional(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  wechat: z.string().max(50, '微信号不能超过50字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  address: z.string().max(200, '地址不能超过200字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  businessHours: z.string().max(100, '营业时间不能超过100字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  description: z.string().max(500, '描述不能超过500字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  isActive: z.boolean().optional(),
  location: storeLocationSchema.optional().or(z.null()).transform(val => val === null ? null : val).optional(),
})

export type StoreFormData = z.infer<typeof storeFormSchema>
