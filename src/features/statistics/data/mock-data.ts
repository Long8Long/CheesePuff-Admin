// KPI卡片数据
export const kpiData = {
  // 实体数量
  totalCats: 68,
  newCatsThisMonth: 5,
  totalStores: 5,
  operatingStores: 4,
  totalBreeds: 12,
  topBreeds: ['英短', '美短', '布偶', '暹罗', '缅因'],
  totalMembers: 2341,
  newMembersThisMonth: 186,
  activeMembers: 1523,

  // 运营数据
  totalRevenue: 1523450,
  revenueGrowth: 15.6,
  monthlyRevenue: 234500,
  monthlyOrders: 567,
  orderCompletionRate: 94.5,
  avgOrderAmount: 413,
  activeCats: 52,
  activeCatsRate: 76.5,
  healthyCats: 48,
  pendingTasks: 23,
  urgentTasks: 5,
  completedTasks: 156,
}

// 图表数据
export const chartData = {
  catStatus: [
    { name: '在店', value: 42, color: '#3b82f6' },
    { name: '休假', value: 12, color: '#10b981' },
    { name: '医疗', value: 8, color: '#f59e0b' },
    { name: '已退役', value: 6, color: '#6b7280' },
  ],
  breedDistribution: [
    { name: '英短', count: 18 },
    { name: '美短', count: 15 },
    { name: '布偶', count: 12 },
    { name: '暹罗', count: 10 },
    { name: '缅因', count: 8 },
    { name: '德文', count: 5 },
    { name: '缅因', count: 8 },
  ],
  memberGrowth: [
    { month: '2025-08', count: 1450 },
    { month: '2025-09', count: 1598 },
    { month: '2025-10', count: 1723 },
    { month: '2025-11', count: 1891 },
    { month: '2025-12', count: 2056 },
    { month: '2026-01', count: 2123 },
    { month: '2026-02', count: 2189 },
    { month: '2026-03', count: 2234 },
    { month: '2026-04', count: 2289 },
    { month: '2026-05', count: 2312 },
    { month: '2026-06', count: 2341 },
  ],
  storePerformance: [
    { name: '朝阳店', revenue: 456000, orders: 1234, members: 678, cats: 15 },
    { name: '海淀店', revenue: 398000, orders: 1089, members: 567, cats: 12 },
    { name: '丰台店', revenue: 345000, orders: 945, members: 489, cats: 10 },
    { name: '西城店', revenue: 278000, orders: 756, members: 398, cats: 8 },
    { name: '通州店', revenue: 156000, orders: 423, members: 209, cats: 5 },
  ],
}
