import { type CatCafeStatus } from './schema'

// 品种列表
export const breeds = [
  { label: '布偶猫', value: '布偶猫' },
  { label: '英短', value: '英短' },
  { label: '美短', value: '美短' },
  { label: '暹罗猫', value: '暹罗猫' },
  { label: '波斯猫', value: '波斯猫' },
  { label: '缅因猫', value: '缅因猫' },
  { label: '斯芬克斯', value: '斯芬克斯' },
  { label: '金渐层', value: '金渐层' },
  { label: '银渐层', value: '银渐层' },
  { label: '加菲猫', value: '加菲猫' },
  { label: '折耳猫', value: '折耳猫' },
  { label: '孟加拉豹猫', value: '孟加拉豹猫' },
  { label: '挪威森林猫', value: '挪威森林猫' },
  { label: '俄罗斯蓝猫', value: '俄罗斯蓝猫' },
  { label: '新加坡猫', value: '新加坡猫' },
]

// 工作状态列表
export const catCafeStatuses = [
  { label: '工作中', value: 'working' },
  { label: '休息中', value: 'resting' },
  { label: '生病中', value: 'sick' },
  { label: '已退休', value: 'retired' },
  { label: '怀孕中', value: 'pregnant' },
  { label: '哺乳期', value: 'nursing' },
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
  ['pregnant', 'bg-pink-100/30 text-pink-900 dark:text-pink-200 border-pink-200'],
  ['nursing', 'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200'],
])

