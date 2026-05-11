import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useScore } from '@/hooks/useScore'
import { calculateScore, getUpcomingDeadlines, getOverdueTasks } from '@/lib/scoreCalculator'
import { getCurrentMonthYear, formatDate, formatMonth } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScoreCard } from '@/components/ScoreCard'
import { MonthProgressChart, CategoryPieChart } from '@/components/Charts'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PlayCircle,
  TrendingUp,
  Plus,
  ChevronRight,
} from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const { month, year } = getCurrentMonthYear()
  const { tasks, loading } = useTasks(user?.id, month, year)
  const { criteriaA } = useScore(user?.id, month, year)

  const score = calculateScore(tasks, criteriaA)
  const upcoming = getUpcomingDeadlines(tasks)
  const overdue = getOverdueTasks(tasks)

  const stats = [
    {
      label: 'Tổng công việc',
      value: score.totalTasks,
      icon: PlayCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Đã hoàn thành',
      value: score.completedTasks,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Đang thực hiện',
      value: tasks.filter((t) => t.status === 'dang_thuc_hien').length,
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      label: 'Điểm dự kiến',
      value: score.totalScore.toFixed(1),
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ]

  const categoryData = [
    { name: 'Kế hoạch', value: tasks.filter((t) => t.category === 'ke_hoach').length, color: '#3b82f6' },
    { name: 'Chuyên môn', value: tasks.filter((t) => t.category === 'chuyen_mon').length, color: '#10b981' },
    { name: 'Đột xuất', value: tasks.filter((t) => t.category === 'dot_xuat').length, color: '#f59e0b' },
    { name: 'Kiêm nhiệm', value: tasks.filter((t) => t.category === 'kiem_nhiem').length, color: '#8b5cf6' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <p className="text-muted-foreground text-sm">{formatMonth(month, year)}</p>
        </div>
        <Link to="/tasks">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Thêm CV
          </Button>
        </Link>
      </div>

      {/* Cảnh báo */}
      {(overdue.length > 0 || upcoming.length > 0) && (
        <div className="space-y-2">
          {overdue.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Trễ hạn ({overdue.length} việc)</AlertTitle>
              <AlertDescription>
                {overdue.map((t) => (
                  <span key={t.id} className="block text-xs">• {t.title} (hạn: {formatDate(t.deadline)})</span>
                ))}
              </AlertDescription>
            </Alert>
          )}
          {upcoming.length > 0 && (
            <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-300">
              <Clock className="h-4 w-4" />
              <AlertTitle>Sắp đến hạn ({upcoming.length} việc)</AlertTitle>
              <AlertDescription>
                {upcoming.map((t) => (
                  <span key={t.id} className="block text-xs">• {t.title} (hạn: {formatDate(t.deadline)})</span>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score + Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Score card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              Điểm dự kiến tháng này
              <Link to="/summary" className="text-sm font-normal text-primary hover:underline flex items-center gap-1">
                Chi tiết <ChevronRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreCard score={score} compact />
          </CardContent>
        </Card>

        {/* Progress chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tiến độ công việc</CardTitle>
          </CardHeader>
          <CardContent>
            {score.totalTasks > 0 ? (
              <MonthProgressChart
                totalTasks={score.totalTasks}
                completedTasks={score.completedTasks}
                onTimeTasks={score.onTimeTasks}
                qualityTasks={score.qualityTasks}
              />
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Chưa có công việc tháng này
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category distribution */}
      {score.totalTasks > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Phân loại công việc</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart categoryData={categoryData} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
