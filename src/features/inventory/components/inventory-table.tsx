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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import {
  inventoryData,
  productCategories,
  statusColorMap,
  stockStatuses,
} from '../data/mock-data'

export function InventoryTable() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredData = inventoryData.filter((item) => {
    const matchCategory =
      categoryFilter === 'all' || item.category === categoryFilter
    const matchStatus = statusFilter === 'all' || item.status === statusFilter
    return matchCategory && matchStatus
  })

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常'
      case 'warning':
        return '预警'
      case 'urgent':
        return '紧急'
      default:
        return '未知'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>库存明细</CardTitle>
          <div className='flex gap-2'>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='选择分类' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部分类</SelectItem>
                {productCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='选择状态' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全部状态</SelectItem>
                {stockStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead className='text-center'>当前库存</TableHead>
              <TableHead className='text-right'>单价</TableHead>
              <TableHead className='text-right'>总价值</TableHead>
              <TableHead className='text-center'>状态</TableHead>
              <TableHead className='text-center'>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className='text-center'>{item.currentStock}</TableCell>
                <TableCell className='text-right'>
                  ¥{item.unitPrice}
                </TableCell>
                <TableCell className='text-right'>
                  ¥{item.totalValue}
                </TableCell>
                <TableCell className='text-center'>
                  <Badge className={statusColorMap[item.status]}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex justify-center gap-1'>
                    <Button variant='ghost' size='sm'>
                      入库
                    </Button>
                    <Button variant='ghost' size='sm'>
                      出库
                    </Button>
                    <Button variant='ghost' size='sm'>
                      编辑
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
