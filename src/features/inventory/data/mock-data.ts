import type { InventoryItem } from '../models/inventory'

// 库存概览卡片数据
export const inventoryOverviewData = {
  totalProducts: 156,
  lowStockProducts: 8,
  monthInbound: 2340,
  monthOutbound: 1876,
}

// 库存分类
export const productCategories = [
  { label: '猫粮', value: '猫粮' },
  { label: '猫砂', value: '猫砂' },
  { label: '猫罐头', value: '猫罐头' },
  { label: '猫零食', value: '猫零食' },
  { label: '猫玩具', value: '猫玩具' },
  { label: '猫窝', value: '猫窝' },
  { label: '猫抓板', value: '猫抓板' },
  { label: '营养品', value: '营养品' },
]

// 库存状态
export const stockStatuses = [
  { label: '正常', value: 'normal' },
  { label: '预警', value: 'warning' },
  { label: '紧急', value: 'urgent' },
]

// 状态颜色映射
export const statusColorMap: Record<
  'normal' | 'warning' | 'urgent',
  string
> = {
  normal: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  warning: 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200',
  urgent: 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
}

// 低库存预警数据
export const lowStockData: Omit<
  InventoryItem,
  'unitPrice' | 'totalValue'
>[] = [
  {
    id: 'P001',
    name: '渴望猫粮 鸡肉成猫配方 5.4kg',
    category: '猫粮',
    currentStock: 8,
    threshold: 15,
    status: 'urgent',
  },
  {
    id: 'P002',
    name: '蓝爵猫粮 无谷鸡肉配方 2kg',
    category: '猫粮',
    currentStock: 12,
    threshold: 20,
    status: 'warning',
  },
  {
    id: 'P003',
    name: 'Ever Clean 猫砂 6kg',
    category: '猫砂',
    currentStock: 6,
    threshold: 10,
    status: 'urgent',
  },
  {
    id: 'P004',
    name: '皇家猫罐头 K36 母幼猫 85g',
    category: '猫罐头',
    currentStock: 15,
    threshold: 24,
    status: 'warning',
  },
  {
    id: 'P005',
    name: 'Chewy 猫咪零食 鸡肉条 56g',
    category: '猫零食',
    currentStock: 9,
    threshold: 15,
    status: 'urgent',
  },
  {
    id: 'P006',
    name: 'Petkit 猫砂盆 智能款',
    category: '猫砂',
    currentStock: 3,
    threshold: 5,
    status: 'urgent',
  },
]

// 库存明细数据
export const inventoryData: InventoryItem[] = [
  {
    id: 'P001',
    name: '渴望猫粮 鸡肉成猫配方 5.4kg',
    category: '猫粮',
    currentStock: 8,
    unitPrice: 468,
    totalValue: 3744,
    status: 'urgent',
  },
  {
    id: 'P002',
    name: '蓝爵猫粮 无谷鸡肉配方 2kg',
    category: '猫粮',
    currentStock: 12,
    unitPrice: 198,
    totalValue: 2376,
    status: 'warning',
  },
  {
    id: 'P003',
    name: 'Ever Clean 猫砂 6kg',
    category: '猫砂',
    currentStock: 6,
    unitPrice: 89,
    totalValue: 534,
    status: 'urgent',
  },
  {
    id: 'P004',
    name: '皇家猫罐头 K36 母幼猫 85g',
    category: '猫罐头',
    currentStock: 15,
    unitPrice: 18,
    totalValue: 270,
    status: 'warning',
  },
  {
    id: 'P005',
    name: 'Chewy 猫咪零食 鸡肉条 56g',
    category: '猫零食',
    currentStock: 9,
    unitPrice: 35,
    totalValue: 315,
    status: 'urgent',
  },
  {
    id: 'P006',
    name: 'Petkit 猫砂盆 智能款',
    category: '猫砂',
    currentStock: 3,
    unitPrice: 1299,
    totalValue: 3897,
    status: 'urgent',
  },
  {
    id: 'P007',
    name: '爱肯拿 农场盛宴猫粮 6kg',
    category: '猫粮',
    currentStock: 28,
    unitPrice: 398,
    totalValue: 11144,
    status: 'normal',
  },
  {
    id: 'P008',
    name: 'N1 猫砂 豆腐砂 6L',
    category: '猫砂',
    currentStock: 45,
    unitPrice: 29,
    totalValue: 1305,
    status: 'normal',
  },
  {
    id: 'P009',
    name: 'wellness 猫罐头 CORE 无谷鸡肉 85g',
    category: '猫罐头',
    currentStock: 56,
    unitPrice: 22,
    totalValue: 1232,
    status: 'normal',
  },
  {
    id: 'P010',
    name: '费利猫零食 猫条 三文鱼 4支',
    category: '猫零食',
    currentStock: 78,
    unitPrice: 28,
    totalValue: 2184,
    status: 'normal',
  },
  {
    id: 'P011',
    name: 'Catit 猫咪小跑球',
    category: '猫玩具',
    currentStock: 34,
    unitPrice: 89,
    totalValue: 3026,
    status: 'normal',
  },
  {
    id: 'P012',
    name: 'Petstages 猫抓板 小号',
    category: '猫抓板',
    currentStock: 67,
    unitPrice: 45,
    totalValue: 3015,
    status: 'normal',
  },
  {
    id: 'P013',
    name: 'Nutramax 关节营养品 软骨素 90片',
    category: '营养品',
    currentStock: 11,
    threshold: 15,
    unitPrice: 268,
    totalValue: 2948,
    status: 'warning',
  },
  {
    id: 'P014',
    name: 'Oregon 猫窝 四季通用款 M',
    category: '猫窝',
    currentStock: 19,
    unitPrice: 168,
    totalValue: 3192,
    status: 'normal',
  },
  {
    id: 'P015',
    name: 'Go! 猫粮 九种肉配方 5.4kg',
    category: '猫粮',
    currentStock: 23,
    unitPrice: 328,
    totalValue: 7544,
    status: 'normal',
  },
]
