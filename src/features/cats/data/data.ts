import { type CatCafeStatus } from './schema'

// 品种列表
export const breeds = [
  { label: '布偶猫', value: '布偶猫', breedEn: 'Ragdoll' },
  { label: '英短', value: '英短', breedEn: 'British Shorthair' },
  { label: '美短', value: '美短', breedEn: 'American Shorthair' },
  { label: '暹罗猫', value: '暹罗猫', breedEn: 'Siamese' },
  { label: '波斯猫', value: '波斯猫', breedEn: 'Persian' },
  { label: '缅因猫', value: '缅因猫', breedEn: 'Maine Coon' },
  { label: '斯芬克斯', value: '斯芬克斯', breedEn: 'Sphynx' },
  { label: '金渐层', value: '金渐层', breedEn: 'Golden Shaded' },
  { label: '银渐层', value: '银渐层', breedEn: 'Silver Shaded' },
  { label: '加菲猫', value: '加菲猫', breedEn: 'Exotic Shorthair' },
  { label: '折耳猫', value: '折耳猫', breedEn: 'Scottish Fold' },
  { label: '孟加拉豹猫', value: '孟加拉豹猫', breedEn: 'Bengal' },
  { label: '挪威森林猫', value: '挪威森林猫', breedEn: 'Norwegian Forest Cat' },
  { label: '俄罗斯蓝猫', value: '俄罗斯蓝猫', breedEn: 'Russian Blue' },
  { label: '新加坡猫', value: '新加坡猫', breedEn: 'Singapura' },
]

// 工作状态列表
export const catCafeStatuses = [
  { label: '工作中', value: 'working' },
  { label: '休息中', value: 'resting' },
  { label: '生病中', value: 'sick' },
  { label: '已退休', value: 'retired' },
]

// 状态颜色映射
export const statusColors = new Map<CatCafeStatus, string>([
  [
    'working',
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  ],
  ['resting', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  ['sick', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
  ['retired', 'bg-neutral-300/40 border-neutral-300'],
])

// 根据 breed 获取英文品种名
export function getBreedEn(breed: string): string {
  const found = breeds.find((b) => b.value === breed)
  return found?.breedEn || ''
}
