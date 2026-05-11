import { useState } from 'react'
import type { Task } from '@/types'
import { CATEGORY_LABELS, STATUS_LABELS, QUALITY_LABELS, STATUS_COLORS, PARTICIPATION_LABELS } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { cn, formatDate, isOverdue, isUpcoming } from '@/lib/utils'
import { Pencil, Trash2, AlertCircle, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

type SortKey = 'date' | 'deadline' | 'status' | 'category'
type FilterStatus = 'all' | Task['status']

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const filtered = tasks
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => {
      const va = a[sortKey] as string
      const vb = b[sortKey] as string
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  const getDeadlineIcon = (task: Task) => {
    if (task.status === 'hoan_thanh') return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
    if (isOverdue(task.deadline, task.status)) return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
    if (isUpcoming(task.deadline, task.status)) return <Clock className="h-3.5 w-3.5 text-orange-500" />
    return null
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="space-y-2">
        <div className="flex gap-1 flex-wrap">
          {(['all', 'chua_thuc_hien', 'dang_thuc_hien', 'hoan_thanh', 'chua_hoan_thanh'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
                filterStatus === s
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-accent',
              )}
            >
              {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 items-center">
          <span className="text-xs text-muted-foreground mr-1">Sắp xếp:</span>
          {(['date', 'deadline', 'status'] as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => handleSort(k)}
              className={cn(
                'px-2.5 py-1 rounded text-xs border transition-colors',
                sortKey === k ? 'bg-secondary' : 'hover:bg-accent',
              )}
            >
              {k === 'date' ? 'Ngày' : k === 'deadline' ? 'Hạn' : 'Trạng thái'}
              {sortKey === k && (sortAsc ? ' ↑' : ' ↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Task count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} / {tasks.length} công việc
      </p>

      {/* Task items */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Không có công việc nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((task) => {
            const isExpanded = expandedId === task.id
            const overdue = isOverdue(task.deadline, task.status)
            const upcoming = isUpcoming(task.deadline, task.status)

            return (
              <div
                key={task.id}
                className={cn(
                  'rounded-lg border bg-card transition-all',
                  overdue && task.status !== 'hoan_thanh' ? 'border-red-300 dark:border-red-800' : '',
                  upcoming ? 'border-orange-300 dark:border-orange-800' : '',
                )}
              >
                {/* Task header row */}
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : task.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{task.title}</span>
                      {task.is_bonus && (
                        <Badge variant="secondary" className="text-xs">⭐ Khen</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{CATEGORY_LABELS[task.category]}</span>
                      <span>·</span>
                      <span>{task.assigned_by}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {getDeadlineIcon(task)}
                        {formatDate(task.deadline)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[task.status])}>
                      {STATUS_LABELS[task.status]}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t pt-3 space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ngày: </span>
                        {formatDate(task.date)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tính chất: </span>
                        {task.complexity === 'binh_thuong' ? 'Bình thường' : task.complexity === 'phuc_tap' ? 'Phức tạp' : 'Rất phức tạp'}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mức độ tham gia: </span>
                        {PARTICIPATION_LABELS[task.participation]}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Chất lượng: </span>
                        {QUALITY_LABELS[task.quality]}
                      </div>
                      {task.completion_date && (
                        <div>
                          <span className="text-muted-foreground">Ngày HT: </span>
                          {formatDate(task.completion_date)}
                        </div>
                      )}
                      {task.status === 'hoan_thanh' && task.completion_date && (
                        <div>
                          <span className="text-muted-foreground">Tiến độ: </span>
                          {task.completion_date < task.deadline
                            ? <span className="text-green-600 dark:text-green-400 font-medium">Sớm hạn</span>
                            : task.completion_date === task.deadline
                            ? <span className="text-blue-600 dark:text-blue-400 font-medium">Đúng hạn</span>
                            : <span className="text-red-600 dark:text-red-400 font-medium">Trễ hạn</span>
                          }
                        </div>
                      )}
                      {task.confirmed_by && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Xác nhận: </span>
                          {task.confirmed_by}
                        </div>
                      )}
                      {task.late_reason && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Lý do trễ: </span>
                          <span className="text-red-600 dark:text-red-400">{task.late_reason}</span>
                        </div>
                      )}
                      {task.note && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Ghi chú: </span>
                          {task.note}
                        </div>
                      )}
                      {task.proposal && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Kiến nghị/ĐX: </span>
                          <span className="text-blue-600 dark:text-blue-400">{task.proposal}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); onEdit(task) }}
                        className="h-7 text-xs"
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => { e.stopPropagation(); setConfirmId(task.id) }}
                        className="h-7 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Xóa
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Xóa công việc"
        message="Công việc này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?"
        confirmLabel="Xóa"
        onConfirm={() => {
          if (confirmId) onDelete(confirmId)
          setConfirmId(null)
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  )
}
