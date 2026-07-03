import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { chartData } from '../data/mock-data'

export function StorePerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>店铺业绩对比</CardTitle>
        <CardDescription>各店铺关键指标对比</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={chartData.storePerformance}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='orders' fill='#10b981' name='订单数' />
            <Bar dataKey='members' fill='#f59e0b' name='会员数' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
