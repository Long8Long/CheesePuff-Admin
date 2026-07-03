import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { chartData } from '../data/mock-data'

export function CatStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>猫咪状态分布</CardTitle>
        <CardDescription>各状态猫咪数量占比</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={250}>
          <PieChart>
            <Pie
              data={chartData.catStatus}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
              stroke='white'
              strokeWidth={1}
            >
              {chartData.catStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
