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
import { transactionsData } from '../data/mock-data'

export function TransactionsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>最近交易记录</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>描述</TableHead>
              <TableHead>类型</TableHead>
              <TableHead className='text-right'>金额</TableHead>
              <TableHead className='text-center'>日期</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className='font-medium'>
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.type === 'income' ? 'default' : 'secondary'}
                    className={
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
                    }
                  >
                    {transaction.type === 'income' ? '收入' : '支出'}
                  </Badge>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  ¥{Math.abs(transaction.amount).toLocaleString()}
                </TableCell>
                <TableCell className='text-center'>
                  {transaction.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
