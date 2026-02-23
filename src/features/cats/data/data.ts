import type { CatCafeStatus } from '../models'

// 品种列表 / Breed list
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

// 店铺列表 / Store list
export const stores = [
  { label: '山东店', value: '山东店' },
  { label: '苏州店', value: '苏州店' },
]

// 工作状态列表 / Work status list
export const catCafeStatuses = [
  { label: '工作中', value: '工作中' },
  { label: '休息中', value: '休息中' },
  { label: '生病中', value: '生病中' },
  { label: '已退休', value: '已退休' },
  { label: '怀孕中', value: '怀孕中' },
  { label: '哺乳期', value: '哺乳期' },
  { label: '训练中', value: '训练中' },
]

// 状态颜色映射 / Status color mapping
export const statusColors: Map<CatCafeStatus, string> = new Map([
  [
    '工作中',
    'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  ],
  [
    '休息中',
    'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  ],
  [
    '生病中',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  ['已退休', 'bg-neutral-300/40 border-neutral-300'],
  [
    '怀孕中',
    'bg-pink-100/30 text-pink-900 dark:text-pink-200 border-pink-200',
  ],
  [
    '哺乳期',
    'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200',
  ],
  [
    '训练中',
    'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200',
  ],
])

