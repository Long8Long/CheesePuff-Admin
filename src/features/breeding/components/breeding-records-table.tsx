import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  breedingRecords,
  breedingStatuses,
  statusColorMap,
} from '../data/mock-data'

export function BreedingRecordsTable() {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = breedingRecords.filter((item) => {
    return statusFilter === 'all' || item.status === statusFilter
  })

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mating':
        return '配种中'
      case 'pregnant':
        return '妊娠中'
      case 'born':
        return '已生产'
      case 'cancelled':
        return '已取消'
      default:
        return '未知'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>育种记录</CardTitle>
          <div className='flex gap-2'>
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setStatusFilter('all')}
            >
              全部
            </Button>
            {breedingStatuses.map((status) => (
              <Button
                key={status.value}
                variant={statusFilter === status.value ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter(status.value)}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>母猫ID</TableHead>
              <TableHead>公猫ID</TableHead>
              <TableHead>配种日期</TableHead>
              <TableHead>预产期</TableHead>
              <TableHead>实产日期</TableHead>
              <TableHead className='text-center'>幼猫数</TableHead>
              <TableHead className='text-center'>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className='font-medium'>
                  {record.queenName}
                  <span className='text-muted-foreground text-xs ml-1'>
                    {record.queenId}
                  </span>
                </TableCell>
                <TableCell>
                  {record.kingName}
                  <span className='text-muted-foreground text-xs ml-1'>
                    {record.kingId}
                  </span>
                </TableCell>
                <TableCell>{record.matingDate}</TableCell>
                <TableCell>{record.dueDate}</TableCell>
                <TableCell>
                  {record.birthDate || <span className='text-muted-foreground'>-</span>}
                </TableCell>
                <TableCell className='text-center'>
                  {record.kittenCount || <span className='text-muted-foreground'>-</span>}
                </TableCell>
                <TableCell className='text-center'>
                  <Badge className={statusColorMap[record.status]}>
                    {getStatusLabel(record.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
