import { z } from 'zod'

export const storeTypeEnum = z.enum(['main', 'branch'], {
  message: '请选择店铺类型',
})

export const storeFormSchema = z.object({
  name: z.string().min(1, '门店名称不能为空').max(100, '门店名称不能超过100字符'),
  storeType: storeTypeEnum.optional(),
  ownerContact: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  location: z.string().max(200, '位置不能超过200字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  businessHours: z.string().max(100, '营业时间不能超过100字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
  catteryDescription: z.string().max(500, '描述不能超过500字符').or(z.literal('')).or(z.null()).transform(val => val === '' ? null : val).optional(),
})

export type StoreFormData = z.infer<typeof storeFormSchema>
