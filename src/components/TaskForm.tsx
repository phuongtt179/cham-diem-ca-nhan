import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Task } from '@/types'
import {
  CATEGORY_LABELS,
  COMPLEXITY_LABELS,
  STATUS_LABELS,
  QUALITY_LABELS,
  PARTICIPATION_LABELS,
} from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogCloseButton } from '@/components/ui/dialog'
import { TASK_TEMPLATES } from '@/lib/taskTemplates'
import { cn } from '@/lib/utils'

const taskSchema = z.object({
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  title: z.string().min(1, 'Vui lòng nhập tên công việc'),
  category: z.enum(['ke_hoach', 'chuyen_mon', 'dot_xuat', 'kiem_nhiem']),
  complexity: z.enum(['binh_thuong', 'phuc_tap', 'rat_phuc_tap']),
  participation: z.enum(['chu_tri', 'phoi_hop']),
  assigned_by: z.string().min(1, 'Vui lòng nhập người giao việc'),
  deadline: z.string().min(1, 'Vui lòng chọn hạn hoàn thành'),
  status: z.enum(['chua_thuc_hien', 'dang_thuc_hien', 'hoan_thanh', 'chua_hoan_thanh']),
  completion_date: z.string().nullable().optional(),
  quality: z.enum(['dat', 'chua_dat', 'vuot_muc']),
  confirmed_by: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  proposal: z.string().nullable().optional(),
  late_reason: z.string().nullable().optional(),
  is_bonus: z.boolean(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  onSubmit: (data: Omit<Task, 'id' | 'user_id' | 'month' | 'year' | 'created_at'>) => Promise<void>
}

function getCompletionTiming(completionDate: string | null | undefined, deadline: string) {
  if (!completionDate) return null
  if (completionDate < deadline) return 'som_han'
  if (completionDate === deadline) return 'dung_han'
  return 'tre_han'
}

function daysDiff(a: string, b: string): number {
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86400000)
}

export function TaskForm({ open, onOpenChange, task, onSubmit }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'ke_hoach',
      complexity: 'binh_thuong',
      participation: 'chu_tri',
      status: 'chua_thuc_hien',
      quality: 'dat',
      is_bonus: false,
    },
  })

  const status = watch('status')
  const deadline = watch('deadline')
  const completionDate = watch('completion_date')

  const isCompleted = status === 'hoan_thanh'
  const timing = isCompleted ? getCompletionTiming(completionDate, deadline) : null

  useEffect(() => {
    if (task) {
      reset({
        date: task.date,
        title: task.title,
        category: task.category,
        complexity: task.complexity,
        participation: task.participation,
        assigned_by: task.assigned_by,
        deadline: task.deadline,
        status: task.status,
        completion_date: task.completion_date ?? '',
        quality: task.quality,
        confirmed_by: task.confirmed_by ?? '',
        note: task.note ?? '',
        proposal: task.proposal ?? '',
        late_reason: task.late_reason ?? '',
        is_bonus: task.is_bonus,
      })
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        category: 'ke_hoach',
        complexity: 'binh_thuong',
        participation: 'chu_tri',
        status: 'chua_thuc_hien',
        quality: 'dat',
        is_bonus: false,
      })
    }
  }, [task, reset, open])

  const handleFormSubmit = async (data: TaskFormData) => {
    await onSubmit({
      ...data,
      participation: data.participation,
      completion_date: data.completion_date || null,
      confirmed_by: data.confirmed_by || null,
      note: data.note || null,
      proposal: data.proposal || null,
      late_reason: timing === 'tre_han' ? (data.late_reason || null) : null,
    })
    onOpenChange(false)
  }

  const applyTemplate = (id: string) => {
    const tpl = TASK_TEMPLATES.find((t) => t.id === id)
    if (!tpl) return
    setValue('title', tpl.title)
    setValue('category', tpl.category)
    setValue('complexity', tpl.complexity)
    setValue('assigned_by', tpl.assigned_by)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}</DialogTitle>
        </DialogHeader>
        <DialogCloseButton onClose={() => onOpenChange(false)} />

        {!task && (
          <div className="mb-4">
            <Label>Chọn từ mẫu nhanh</Label>
            <Select onChange={(e) => applyTemplate(e.target.value)} className="mt-1">
              <option value="">-- Chọn mẫu công việc --</option>
              {TASK_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
              ))}
            </Select>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Ngày thực hiện *</Label>
              <Input type="date" {...register('date')} className="mt-1" />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label>Hạn hoàn thành (yêu cầu) *</Label>
              <Input type="date" {...register('deadline')} className="mt-1" />
              {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline.message}</p>}
            </div>
          </div>

          <div>
            <Label>Tên công việc / Sản phẩm *</Label>
            <Input {...register('title')} placeholder="Nhập tên công việc..." className="mt-1" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Loại công việc</Label>
              <Select {...register('category')} className="mt-1">
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Mức độ tham gia</Label>
              <Select {...register('participation')} className="mt-1">
                {Object.entries(PARTICIPATION_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Tính chất</Label>
              <Select {...register('complexity')} className="mt-1">
                {Object.entries(COMPLEXITY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Người giao việc *</Label>
            <Input {...register('assigned_by')} placeholder="Hiệu trưởng, Tổ trưởng..." className="mt-1" />
            {errors.assigned_by && <p className="text-xs text-destructive mt-1">{errors.assigned_by.message}</p>}
          </div>

          {/* Trạng thái + thời gian hoàn thành */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Trạng thái</Label>
              <Select {...register('status')} className="mt-1">
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Ngày hoàn thành thực tế</Label>
              <Input
                type="date"
                {...register('completion_date')}
                className="mt-1"
                disabled={status !== 'hoan_thanh'}
              />
            </div>
          </div>

          {/* Timing badge — chỉ hiện khi hoàn thành và đã nhập ngày */}
          {isCompleted && timing && (
            <div className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
              timing === 'som_han' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
              timing === 'dung_han' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
              timing === 'tre_han' && 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            )}>
              {timing === 'som_han' && (
                <>✓ Sớm hạn ({daysDiff(deadline, completionDate!)} ngày trước hạn)</>
              )}
              {timing === 'dung_han' && <>✓ Đúng hạn</>}
              {timing === 'tre_han' && (
                <>⚠ Trễ hạn ({daysDiff(completionDate!, deadline)} ngày so với yêu cầu)</>
              )}
            </div>
          )}

          {/* Lý do trễ hạn — chỉ hiện khi trễ */}
          {timing === 'tre_han' && (
            <div>
              <Label>Lý do trễ hạn</Label>
              <Textarea
                {...register('late_reason')}
                placeholder="Nêu rõ lý do hoàn thành trễ so với yêu cầu..."
                className="mt-1"
                rows={2}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Chất lượng</Label>
              <Select {...register('quality')} className="mt-1">
                {Object.entries(QUALITY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Người xác nhận</Label>
              <Input {...register('confirmed_by')} placeholder="Người xác nhận..." className="mt-1" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Ghi chú nội bộ</Label>
              <Textarea
                {...register('note')}
                placeholder="Các bước cần làm, nhắc nhở cá nhân... (không xuất báo cáo)"
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label>Kiến nghị / Đề xuất</Label>
              <Textarea
                {...register('proposal')}
                placeholder="Kiến nghị, đề xuất với lãnh đạo... (xuất vào cột 17 báo cáo)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_bonus" {...register('is_bonus')} className="h-4 w-4 rounded" />
            <Label htmlFor="is_bonus">Được khen thưởng / biểu dương (+1đ cộng)</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : task ? 'Cập nhật' : 'Thêm công việc'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
