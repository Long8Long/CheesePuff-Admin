import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { breedingKanbanData } from '../data/mock-data'

export function BreedingKanban() {
  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      {/* 配种中 */}
      <Card>
        <CardHeader className='bg-blue-50 dark:bg-blue-950'>
          <CardTitle className='text-lg'>配种中</CardTitle>
        </CardHeader>
        <CardContent className='pt-4 space-y-3'>
          {breedingKanbanData.mating.map((item) => (
            <Card key={item.id}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{item.queenName}</h4>
                  <Badge className='bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'>
                    {item.queenName} × {item.kingName}
                  </Badge>
                </div>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p>配种日期: {item.matingDate}</p>
                  <p>预计确认: {item.expectedConfirmDate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* 妊娠中 */}
      <Card>
        <CardHeader className='bg-pink-50 dark:bg-pink-950'>
          <CardTitle className='text-lg'>妊娠中</CardTitle>
        </CardHeader>
        <CardContent className='pt-4 space-y-3'>
          {breedingKanbanData.pregnant.map((item) => (
            <Card key={item.id}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{item.queenName}</h4>
                  <Badge className='bg-pink-100 text-pink-900 dark:bg-pink-900 dark:text-pink-100'>
                    {item.pregnancyStage}
                  </Badge>
                </div>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p>
                    配种: {item.queenName} × {item.kingName}
                  </p>
                  <p>配种日期: {item.matingDate}</p>
                  <p>预产期: {item.dueDate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* 育儿期 */}
      <Card>
        <CardHeader className='bg-green-50 dark:bg-green-950'>
          <CardTitle className='text-lg'>育儿期</CardTitle>
        </CardHeader>
        <CardContent className='pt-4 space-y-3'>
          {breedingKanbanData.nursing.map((item) => (
            <Card key={item.id}>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <h4 className='font-medium'>{item.queenName}</h4>
                  <Badge className='bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'>
                    {item.kittenCount} 只幼猫
                  </Badge>
                </div>
                <div className='space-y-1 text-sm text-muted-foreground'>
                  <p>
                    配种: {item.queenName} × {item.kingName}
                  </p>
                  <p>生产日期: {item.birthDate}</p>
                  <p>预计断奶: {item.weaningDate}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
