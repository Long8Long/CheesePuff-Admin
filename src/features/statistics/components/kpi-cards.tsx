import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cat, Building2, Layers, Users } from 'lucide-react'
import { kpiData } from '../data/mock-data'

export function KpiCards() {
  const cards = [
    {
      title: '猫咪总数',
      value: kpiData.totalCats,
      description: `本月新增 ${kpiData.newCatsThisMonth}`,
      icon: <Cat className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: '店铺数量',
      value: kpiData.totalStores,
      description: `营业中 ${kpiData.operatingStores}`,
      icon: <Building2 className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: '品种数量',
      value: kpiData.totalBreeds,
      description: `常见: ${kpiData.topBreeds.slice(0, 3).join('、')}`,
      icon: <Layers className='h-4 w-4 text-muted-foreground' />,
    },
    {
      title: '会员总数',
      value: kpiData.totalMembers,
      description: `本月新增 ${kpiData.newMembersThisMonth}`,
      icon: <Users className='h-4 w-4 text-muted-foreground' />,
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{card.value}</div>
            <p className='text-xs text-muted-foreground'>
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
