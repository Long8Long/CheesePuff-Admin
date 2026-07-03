import {
  Card,
  CardContent,
  CardDescription,
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
import { lowStockData, statusColorMap } from '../data/mock-data'

export function LowStockAlert() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>低库存预警</CardTitle>
        <CardDescription>
          库存不足的商品列表，请及时补货
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名称</TableHead>
              <TableHead>分类</TableHead>
              <TableHead className='text-center'>当前库存</TableHead>
              <TableHead className='text-center'>预警阈值</TableHead>
              <TableHead className='text-center'>状态</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className='text-center'>{item.currentStock}</TableCell>
                <TableCell className='text-center'>{item.threshold}</TableCell>
                <TableCell className='text-center'>
                  <Badge className={statusColorMap[item.status]}>
                    {item.status === 'urgent' ? '紧急' : '预警'}
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
