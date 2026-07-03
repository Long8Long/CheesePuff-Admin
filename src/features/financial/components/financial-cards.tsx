import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { financialOverviewData } from '../data/mock-data'

export function FinancialCards() {
  const cards = [
    {
      title: '今日收入',
      value: `¥${financialOverviewData.todayRevenue.toLocaleString()}`,
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
          <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
        </svg>
      ),
    },
    {
      title: '本月收入',
      value: `¥${financialOverviewData.monthRevenue.toLocaleString()}`,
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
          <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
          <circle cx='9' cy='7' r='4' />
          <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
        </svg>
      ),
    },
    {
      title: '本月支出',
      value: `¥${financialOverviewData.monthExpense.toLocaleString()}`,
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
          <path d='M5 12h14' />
          <path d='M12 5l7 7-7 7' />
        </svg>
      ),
    },
    {
      title: '净利润',
      value: `¥${financialOverviewData.netProfit.toLocaleString()}`,
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
          <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' />
          <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
          <line x1='12' x2='12' y1='22.08' y2='12' />
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
