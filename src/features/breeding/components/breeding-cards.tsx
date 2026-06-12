import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { breedingOverviewData } from '../data/mock-data'

export function BreedingCards() {
  const cards = [
    {
      title: '在册种猫',
      value: breedingOverviewData.breedingCats,
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
          <circle cx='12' cy='12' r='10' />
          <path d='M12 16v-4' />
          <path d='M12 8h.01' />
        </svg>
      ),
    },
    {
      title: '本年新生幼猫',
      value: breedingOverviewData.newbornKittens,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-pink-600 dark:text-pink-400'
        >
          <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
          <path d='M12 16v-4' />
          <path d='M12 8h.01' />
        </svg>
      ),
    },
    {
      title: '待产母猫',
      value: breedingOverviewData.pregnantQueens,
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-amber-600 dark:text-amber-400'
        >
          <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
          <polyline points='12 6 12 12 16 14' />
        </svg>
      ),
    },
    {
      title: '配种记录',
      value: breedingOverviewData.totalRecords,
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
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <path d='M14 2v6h6' />
          <path d='M16 13H8' />
          <path d='M16 17H8' />
          <path d='M10 9H8' />
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
