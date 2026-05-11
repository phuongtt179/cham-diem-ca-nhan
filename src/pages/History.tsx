import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useMonthSummary } from '@/hooks/useMonthSummary'
import { TrendChart } from '@/components/Charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CLASSIFICATION_LABELS, CLASSIFICATION_COLORS } from '@/types'
import { TrendingUp, BarChart3 } from 'lucide-react'

export function History() {
  const { user } = useAuth()
  const { summaries, loading } = useMonthSummary(user?.id)
  const [filterYear, setFilterYear] = useState<number | 'all'>('all')

  const availableYears = [...new Set(summaries.map((s) => s.year))].sort((a, b) => b - a)

  const filtered = filterYear === 'all'
    ? summaries
    : summaries.filter((s) => s.year === filterYear)

  // Thống kê tổng hợp
  const avgScore = filtered.length > 0
    ? filtered.reduce((sum, s) => sum + s.score_total, 0) / filtered.length
    : 0

  const classificationCounts = {
    xuat_sac: filtered.filter((s) => s.classification === 'xuat_sac').length,
    tot: filtered.filter((s) => s.classification === 'tot').length,
    hoan_thanh: filtered.filter((s) => s.classification === 'hoan_thanh').length,
    khong_hoan_thanh: filtered.filter((s) => s.classification === 'khong_hoan_thanh').length,
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Lịch sử các tháng</h1>
        <Select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="h-9 w-32 text-sm"
        >
          <option value="all">Tất cả năm</option>
          {availableYears.map((y) => <option key={y} value={y}>Năm {y}</option>)}
        </Select>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="font-medium">Chưa có dữ liệu lịch sử</p>
          <p className="text-sm mt-1">Lưu tổng hợp tháng để xem lịch sử ở đây</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{filtered.length}</div>
                <div className="text-xs text-muted-foreground">Tháng có dữ liệu</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{avgScore.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Điểm TB</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{classificationCounts.xuat_sac}</div>
                <div className="text-xs text-muted-foreground">Xuất sắc</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{classificationCounts.tot}</div>
                <div className="text-xs text-muted-foreground">Tốt</div>
              </CardContent>
            </Card>
          </div>

          {/* Trend chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Xu hướng điểm số
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart summaries={filtered} />
            </CardContent>
          </Card>

          {/* Month list */}
          <div className="space-y-2">
            {filtered.map((summary) => (
              <Card key={summary.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="font-semibold">Tháng {summary.month}/{summary.year}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {summary.total_tasks} công việc ·{' '}
                        {summary.completed_tasks} hoàn thành ·{' '}
                        Điểm A: {summary.score_a.toFixed(1)} + B: {summary.score_b.toFixed(1)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xl font-bold">{summary.score_total.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">tổng điểm</div>
                      </div>
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-semibold border',
                        CLASSIFICATION_COLORS[summary.classification],
                      )}>
                        {CLASSIFICATION_LABELS[summary.classification]}
                      </span>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-center">
                    <div className="bg-muted rounded p-1.5">
                      <div className="font-medium">{((summary.completed_tasks / Math.max(summary.total_tasks, 1)) * 100).toFixed(0)}%</div>
                      <div className="text-muted-foreground">Hoàn thành</div>
                    </div>
                    <div className="bg-muted rounded p-1.5">
                      <div className="font-medium">{((summary.on_time_tasks / Math.max(summary.total_tasks, 1)) * 100).toFixed(0)}%</div>
                      <div className="text-muted-foreground">Đúng hạn</div>
                    </div>
                    <div className="bg-muted rounded p-1.5">
                      <div className="font-medium">{((summary.quality_tasks / Math.max(summary.total_tasks, 1)) * 100).toFixed(0)}%</div>
                      <div className="text-muted-foreground">Chất lượng</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
