import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { useScore } from '@/hooks/useScore'
import { useMonthSummary } from '@/hooks/useMonthSummary'
import { calculateScore } from '@/lib/scoreCalculator'
import { exportTasksToCSV, exportMau01TKNV } from '@/lib/exportUtils'
import { getCurrentMonthYear, formatMonth, cn } from '@/lib/utils'
import { ScoreCard } from '@/components/ScoreCard'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { CLASSIFICATION_LABELS, CLASSIFICATION_COLORS } from '@/types'
import { Download, FileText, Save } from 'lucide-react'

export function Summary() {
  const { user } = useAuth()
  const toast = useToast()
  const now = getCurrentMonthYear()
  const [month, setMonth] = useState(now.month)
  const [year, setYear] = useState(now.year)
  const [saving, setSaving] = useState(false)

  const { tasks } = useTasks(user?.id, month, year)
  const { criteriaA } = useScore(user?.id, month, year)
  const { upsertSummary } = useMonthSummary(user?.id)

  const score = calculateScore(tasks, criteriaA)
  const years = Array.from({ length: 5 }, (_, i) => now.year - 2 + i)

  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')

  const handleSaveSummary = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await upsertSummary({
      user_id: user.id,
      month,
      year,
      total_tasks: score.totalTasks,
      completed_tasks: score.completedTasks,
      on_time_tasks: score.onTimeTasks,
      quality_tasks: score.qualityTasks,
      score_a: score.scoreA,
      score_b: score.scoreB,
      score_total: score.totalScore,
      bonus_points: score.bonusPoints,
      penalty_points: score.penaltyPoints,
      classification: score.classification,
    })
    setSaving(false)
    if (error) toast('Lỗi khi lưu tổng hợp!', 'error')
    else toast(`Đã lưu tổng hợp tháng ${month}/${year} vào lịch sử`, 'success')
  }

  const handleExportPDF = () => {
    exportMau01TKNV(
      {
        name: profile.name || 'Giáo viên',
        position: profile.position || 'Giáo viên',
        unit: profile.unit || '',
        school: profile.school || '',
        additional_roles: profile.additional_roles || [],
      },
      tasks,
      score,
      month,
      year,
    )
    toast('Đã mở cửa sổ in Mẫu 01TKNV', 'info')
  }

  const handleExportCSV = () => {
    exportTasksToCSV(tasks, month, year)
    toast('Đã xuất file CSV công việc', 'success')
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tổng hợp tháng</h1>
          <p className="text-muted-foreground text-sm">{formatMonth(month, year)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="h-9 w-28 text-sm">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </Select>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-9 w-20 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      {/* Xếp loại highlight */}
      <div className={cn(
        'rounded-xl border-2 p-4 text-center',
        CLASSIFICATION_COLORS[score.classification],
      )}>
        <div className="text-4xl font-bold mb-1">{score.totalScore.toFixed(1)} điểm</div>
        <div className="text-lg font-semibold">{CLASSIFICATION_LABELS[score.classification]}</div>
        <div className="text-sm opacity-75 mt-1">{formatMonth(month, year)}</div>
      </div>

      {/* Bảng điểm chi tiết */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Bảng tính điểm chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {/* Phần A */}
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Phần A: Tiêu chí chung</span>
              <span className="font-bold text-primary">{score.scoreA.toFixed(1)} / 30</span>
            </div>
            {/* Phần B */}
            <div className="py-1">
              <div className="flex justify-between font-medium mb-2">
                <span>Phần B: Kết quả nhiệm vụ</span>
                <span className="font-bold text-primary">{score.scoreB.toFixed(1)} / 70</span>
              </div>
              <div className="ml-4 space-y-1.5">
                <TableRow
                  label="1. Tỷ lệ số lượng"
                  detail={`${score.completedTasks}/${score.totalTasks} = ${score.completionRate.toFixed(1)}%`}
                  score={score.scoreQuantity}
                  max={20}
                />
                <TableRow
                  label="2. Tỷ lệ tiến độ"
                  detail={`${score.onTimeTasks}/${score.totalTasks} = ${score.onTimeRate.toFixed(1)}%`}
                  score={score.scoreTimeline}
                  max={20}
                />
                <TableRow
                  label="3. Tỷ lệ chất lượng"
                  detail={`${score.qualityTasks}/${score.totalTasks} = ${score.qualityRate.toFixed(1)}%`}
                  score={score.scoreQuality}
                  max={30}
                />
              </div>
            </div>
            {/* Điểm cộng/trừ */}
            <div className="flex justify-between py-1 border-t text-green-600 dark:text-green-400">
              <span>Điểm cộng (không tính vào tổng chính thức)</span>
              <span className="font-semibold">+{score.bonusPoints.toFixed(1)}</span>
            </div>
            <div className="flex justify-between py-1 text-red-600 dark:text-red-400">
              <span>Điểm trừ</span>
              <span className="font-semibold">-{score.penaltyPoints.toFixed(1)}</span>
            </div>
            {/* Tổng */}
            <div className="flex justify-between py-3 border-t-2 font-bold text-base">
              <span>TỔNG ĐIỂM CHÍNH THỨC</span>
              <span className="text-xl text-primary">{score.totalScore.toFixed(1)} / 100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score card đầy đủ */}
      <ScoreCard score={score} />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSaveSummary} disabled={saving} variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Lưu vào lịch sử'}
        </Button>
        <Button onClick={handleExportPDF} variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          In / Xuất PDF
        </Button>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất CSV
        </Button>
      </div>

      {/* Ghi chú tính điểm */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Ghi chú công thức tính điểm (QĐ 32/2026):</p>
          <p>• Tổng điểm = Điểm A (tối đa 30đ) + Điểm B (tối đa 70đ) - Điểm trừ</p>
          <p>• Điểm cộng được ghi nhận nhưng <strong>không cộng</strong> vào tổng điểm chính thức</p>
          <p>• Mức xếp loại: Xuất sắc ≥90đ | Tốt 70-89đ | Hoàn thành 50-69đ | Không HT &lt;50đ</p>
        </CardContent>
      </Card>
    </div>
  )
}

function TableRow({ label, detail, score, max }: { label: string; detail: string; score: number; max: number }) {
  return (
    <div className="flex justify-between items-center text-xs py-1">
      <div>
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground ml-2">({detail})</span>
      </div>
      <span className="font-semibold">{score}/{max}đ</span>
    </div>
  )
}
