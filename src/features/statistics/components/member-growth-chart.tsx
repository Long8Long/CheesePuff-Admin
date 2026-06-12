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
  ResponsiveContainer,
} from 'recharts'
import { chartData } from '../data/mock-data'

export function MemberGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>会员增长趋势</CardTitle>
        <CardDescription>近12个月会员数量变化</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={chartData.memberGrowth}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-30}
              textAnchor='end'
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='count'
              stroke='#10b981'
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
