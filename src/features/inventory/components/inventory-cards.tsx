import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { inventoryOverviewData } from '../data/mock-data'

export function InventoryCards() {
  const cards = [
    {
      title: '商品总数',
      value: inventoryOverviewData.totalProducts,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          <path d='M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' />
          <line x1='3' x2='21' y1='6' y2='6' />
          <path d='M16 10a4 4 0 0 1-8 0' />
        </svg>
      ),
    },
    {
      title: '低库存商品',
      value: inventoryOverviewData.lowStockProducts,
      description: '库存不足预警',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-destructive'
        >
          <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
          <path d='M12 9v4' />
          <path d='M12 17h.01' />
        </svg>
      ),
    },
    {
      title: '本月入库',
      value: inventoryOverviewData.monthInbound,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-green-600 dark:text-green-400'
        >
          <path d='M12 5v14' />
          <path d='m19 12-7 7-7-7' />
        </svg>
      ),
    },
    {
      title: '本月出库',
      value: inventoryOverviewData.monthOutbound,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-blue-600 dark:text-blue-400'
        >
          <path d='M12 19V5' />
          <path d='m5 12 7-7 7 7' />
        </svg>
      ),
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
            {card.description && (
              <p className='text-xs text-muted-foreground'>{card.description}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
