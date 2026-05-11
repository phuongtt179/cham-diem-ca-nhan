import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import type { MonthlySummary } from '@/types'

// ─── Biểu đồ xu hướng điểm theo tháng ───────────────────────────────────────
interface TrendChartProps {
  summaries: MonthlySummary[]
}

export function TrendChart({ summaries }: TrendChartProps) {
  const data = [...summaries]
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .slice(-12)
    .map((s) => ({
      name: `T${s.month}/${s.year}`,
      'Tổng điểm': s.score_total,
      'Điểm A': s.score_a,
      'Điểm B': s.score_b,
    }))

  if (data.length === 0) {
    return <EmptyChart message="Chưa có dữ liệu lịch sử" />
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Tổng điểm" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="Điểm A" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" />
        <Line type="monotone" dataKey="Điểm B" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Biểu đồ tiến độ tháng (bar) ─────────────────────────────────────────────
interface MonthProgressChartProps {
  totalTasks: number
  completedTasks: number
  onTimeTasks: number
  qualityTasks: number
}

export function MonthProgressChart({
  totalTasks,
  completedTasks,
  onTimeTasks,
  qualityTasks,
}: MonthProgressChartProps) {
  const data = [
    { name: 'Hoàn thành', value: completedTasks, max: totalTasks, color: '#10b981' },
    { name: 'Đúng hạn', value: onTimeTasks, max: totalTasks, color: '#3b82f6' },
    { name: 'Đạt CL', value: qualityTasks, max: totalTasks, color: '#8b5cf6' },
  ]

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 50, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
        <XAxis type="number" domain={[0, totalTasks || 1]} tick={{ fontSize: 11 }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={55} />
        <Tooltip formatter={(v, name, props) => [`${v}/${props.payload.max}`, name]} />
        <Bar dataKey="value" radius={4}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Biểu đồ phân loại công việc (pie) ───────────────────────────────────────
interface CategoryPieChartProps {
  categoryData: { name: string; value: number; color: string }[]
}

export function CategoryPieChart({ categoryData }: CategoryPieChartProps) {
  const nonZero = categoryData.filter((d) => d.value > 0)
  if (nonZero.length === 0) return <EmptyChart message="Chưa có công việc" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={nonZero}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
        >
          {nonZero.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v, name) => [v, name]} />
        <Legend iconSize={10} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
      {message}
    </div>
  )
}
