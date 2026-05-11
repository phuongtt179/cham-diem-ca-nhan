import { cn } from '@/lib/utils'
import type { ScoreBreakdown } from '@/types'
import { CLASSIFICATION_LABELS, CLASSIFICATION_COLORS } from '@/types'
import { Progress } from '@/components/ui/progress'

interface ScoreCardProps {
  score: ScoreBreakdown
  compact?: boolean
}

export function ScoreCard({ score, compact = false }: ScoreCardProps) {
  const classColor = CLASSIFICATION_COLORS[score.classification]

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{score.totalScore.toFixed(1)}</span>
          <span className={cn('px-3 py-1 rounded-full text-sm font-semibold border', classColor)}>
            {CLASSIFICATION_LABELS[score.classification]}
          </span>
        </div>
        <Progress value={score.totalScore} max={100} className="h-2" />
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-muted rounded p-2">
            <div className="font-semibold">{score.scoreA.toFixed(1)}/30</div>
            <div className="text-muted-foreground">Tiêu chí A</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className="font-semibold">{score.scoreB.toFixed(1)}/70</div>
            <div className="text-muted-foreground">Kết quả B</div>
          </div>
          <div className="bg-muted rounded p-2">
            <div className={cn('font-semibold', score.penaltyPoints > 0 ? 'text-red-500' : 'text-green-500')}>
              {score.bonusPoints > 0 ? `+${score.bonusPoints.toFixed(1)}` : ''}{' '}
              {score.penaltyPoints > 0 ? `-${score.penaltyPoints.toFixed(1)}` : ''}
            </div>
            <div className="text-muted-foreground">Cộng/Trừ</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tổng điểm */}
      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <div className="text-5xl font-bold text-primary mb-2">{score.totalScore.toFixed(1)}</div>
        <div className="text-muted-foreground text-sm mb-3">Tổng điểm / 100</div>
        <div className={cn('inline-flex px-4 py-1.5 rounded-full text-sm font-semibold border', classColor)}>
          {CLASSIFICATION_LABELS[score.classification]}
        </div>
        <Progress value={score.totalScore} max={100} className="mt-4 h-3" />
      </div>

      {/* Chi tiết Phần B */}
      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-sm">Phần B – Kết quả nhiệm vụ (tối đa 70đ)</h3>
        <ScoreRow
          label="Tỷ lệ hoàn thành"
          detail={`${score.completedTasks}/${score.totalTasks} = ${score.completionRate.toFixed(1)}%`}
          score={score.scoreQuantity}
          max={20}
        />
        <ScoreRow
          label="Tỷ lệ tiến độ"
          detail={`${score.onTimeTasks}/${score.totalTasks} = ${score.onTimeRate.toFixed(1)}%`}
          score={score.scoreTimeline}
          max={20}
        />
        <ScoreRow
          label="Tỷ lệ chất lượng"
          detail={`${score.qualityTasks}/${score.totalTasks} = ${score.qualityRate.toFixed(1)}%`}
          score={score.scoreQuality}
          max={30}
        />
        <div className="border-t pt-2 flex justify-between items-center font-semibold text-sm">
          <span>Tổng điểm B</span>
          <span className="text-lg text-primary">{score.scoreB.toFixed(1)} / 70</span>
        </div>
      </div>

      {/* Phần A */}
      <div className="rounded-lg border bg-card p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-sm">Phần A – Tiêu chí chung</h3>
          <p className="text-xs text-muted-foreground">Tối đa 30 điểm</p>
        </div>
        <span className="text-xl font-bold text-primary">{score.scoreA.toFixed(1)}</span>
      </div>

      {/* Điểm cộng/trừ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-3">
          <div className="text-xs text-muted-foreground mb-1">Điểm cộng (tối đa 6đ)</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            +{score.bonusPoints.toFixed(1)}
          </div>
        </div>
        <div className="rounded-lg border bg-red-50 dark:bg-red-950/20 p-3">
          <div className="text-xs text-muted-foreground mb-1">Điểm trừ</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            -{score.penaltyPoints.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreRow({
  label,
  detail,
  score,
  max,
}: {
  label: string
  detail: string
  score: number
  max: number
}) {
  const pct = (score / max) * 100
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {score}/{max}đ
          <span className="text-xs text-muted-foreground ml-1">({detail})</span>
        </span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  )
}
