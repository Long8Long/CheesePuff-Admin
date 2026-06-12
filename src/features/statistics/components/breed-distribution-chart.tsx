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
  ResponsiveContainer,
} from 'recharts'
import { chartData } from '../data/mock-data'

export function BreedDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>品种分布TOP5</CardTitle>
        <CardDescription>数量最多的5个猫咪品种</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart
            data={chartData.breedDistribution.slice(0, 5)}
            layout='vertical'
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' />
            <YAxis dataKey='name' type='category' width={60} />
            <Tooltip />
            <Bar dataKey='count' fill='#3b82f6' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
