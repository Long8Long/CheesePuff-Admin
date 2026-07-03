import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { incomeExpenseTrend } from '../data/mock-data'

export function IncomeExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>收支趋势</CardTitle>
        <CardDescription>近6个月收入与支出对比</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={incomeExpenseTrend}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip
              formatter={(value) => `¥${Number(value).toLocaleString()}`}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='income'
              stroke='#10b981'
              name='收入'
              strokeWidth={2}
            />
            <Line
              type='monotone'
              dataKey='expense'
              stroke='#ef4444'
              name='支出'
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
