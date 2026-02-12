import { type CatCafeStatus } from './schema'

// 品种列表
export const breeds = [
  { label: '豹猫妹妹', value: '豹猫妹妹' },
  { label: '纯白德文妹妹', value: '纯白德文妹妹' },
  { label: '短毛11色金渐层妹妹', value: '短毛11色金渐层妹妹' },
  { label: '短毛12色金渐层弟弟', value: '短毛12色金渐层弟弟' },
  { label: '短毛12色金渐层妹妹', value: '短毛12色金渐层妹妹' },
  { label: '短毛金点弟弟', value: '短毛金点弟弟' },
  { label: '短毛金点妹妹', value: '短毛金点妹妹' },
  { label: '短毛金加白弟弟', value: '短毛金加白弟弟' },
  { label: '短毛蓝金加白弟弟', value: '短毛蓝金加白弟弟' },
  { label: '短毛蓝金渐层弟弟', value: '短毛蓝金渐层弟弟' },
  { label: '短毛紫金弟弟', value: '短毛紫金弟弟' },
  { label: '短毛紫金渐层妹妹', value: '短毛紫金渐层妹妹' },
  { label: '短毛紫金妹妹', value: '短毛紫金妹妹' },
  { label: '海山双布偶妹妹', value: '海山双布偶妹妹' },
  { label: '黑白德文卷毛猫妹妹', value: '黑白德文卷毛猫妹妹' },
  { label: '虎斑加白德文妹妹', value: '虎斑加白德文妹妹' },
  { label: '蓝双布偶妹妹', value: '蓝双布偶妹妹' },
  { label: '蓝重点加白曼基康妹妹', value: '蓝重点加白曼基康妹妹' },
  { label: '长毛金渐层弟弟', value: '长毛金渐层弟弟' },
  { label: '长毛紫金弟弟', value: '长毛紫金弟弟' },
  { label: '长毛紫金渐层妹妹', value: '长毛紫金渐层妹妹' },
  { label: '棕虎斑缅因弟弟', value: '棕虎斑缅因弟弟' },
]

// 店铺列表
export const stores = [
  { label: '山东店', value: '山东店' },
  { label: '苏州店', value: '苏州店' },
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

