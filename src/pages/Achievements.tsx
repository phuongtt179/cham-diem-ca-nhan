import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useAchievements } from '@/hooks/useAchievements'
import { getCurrentMonthYear, formatDate, cn } from '@/lib/utils'
import {
  ACHIEVEMENT_TYPE_LABELS,
  ACHIEVEMENT_LEVEL_LABELS,
  ACHIEVEMENT_TYPE_COLORS,
  ACHIEVEMENT_LEVEL_COLORS,
} from '@/types'
import type { Achievement, AchievementType, AchievementLevel } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogCloseButton } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toast'
import { Trophy, Plus, Pencil, Trash2, FileText, Star } from 'lucide-react'

const schema = z.object({
  date: z.string().min(1, 'Vui lòng chọn ngày'),
  title: z.string().min(1, 'Vui lòng nhập tên thành tích'),
  type: z.enum(['giai_hoc_sinh', 'khen_thuong', 'sang_kien', 'danh_hieu', 'khac']),
  level: z.enum(['cap_truong', 'cap_phuong', 'cap_tinh', 'cap_quoc_gia']).nullable().optional(),
  description: z.string().nullable().optional(),
})

type FormData = z.infer<typeof schema>

const TYPE_WITH_LEVEL: AchievementType[] = ['giai_hoc_sinh', 'danh_hieu', 'khen_thuong']

function AchievementForm({
  open,
  onOpenChange,
  item,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  item?: Achievement
  onSubmit: (data: FormData) => Promise<void>
}) {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'giai_hoc_sinh', level: 'cap_phuong' },
  })

  const type = watch('type') as AchievementType
  const showLevel = TYPE_WITH_LEVEL.includes(type)

  useState(() => {
    if (item) {
      reset({
        date: item.date,
        title: item.title,
        type: item.type,
        level: item.level ?? undefined,
        description: item.description ?? '',
      })
    } else {
      reset({ date: new Date().toISOString().split('T')[0], type: 'giai_hoc_sinh', level: 'cap_phuong' })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? 'Sửa thành tích' : 'Thêm thành tích'}</DialogTitle>
        </DialogHeader>
        <DialogCloseButton onClose={() => onOpenChange(false)} />
        <form onSubmit={handleSubmit(async (d) => { await onSubmit(d); onOpenChange(false) })} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ngày đạt *</Label>
              <Input type="date" {...register('date')} className="mt-1" />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <Label>Loại thành tích *</Label>
              <Select {...register('type')} className="mt-1">
                {Object.entries(ACHIEVEMENT_TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
          </div>

          {showLevel && (
            <div>
              <Label>Cấp độ</Label>
              <Select {...register('level')} className="mt-1">
                {Object.entries(ACHIEVEMENT_LEVEL_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Label>
              {type === 'giai_hoc_sinh'
                ? 'Danh sách học sinh đạt giải *'
                : 'Tên thành tích / Nội dung *'}
            </Label>
            <Textarea
              {...register('title')}
              placeholder={
                type === 'giai_hoc_sinh'
                  ? 'Nhập mỗi em 1 dòng, VD:\nNguyễn Văn A – Giải Nhì\nTrần Thị B – Giải Ba\nLê Văn C – Giải Khuyến khích'
                  : type === 'sang_kien'
                  ? 'VD: SKKN "Ứng dụng Scratch vào dạy lập trình lớp 4..."'
                  : type === 'danh_hieu'
                  ? 'VD: Chiến sĩ thi đua cơ sở năm học 2025-2026'
                  : 'Mô tả thành tích...'
              }
              className="mt-1"
              rows={type === 'giai_hoc_sinh' ? 5 : 3}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label>Mô tả chi tiết</Label>
            <Textarea
              {...register('description')}
              placeholder="Ghi thêm chi tiết, hoàn cảnh, kết quả cụ thể..."
              className="mt-1"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : item ? 'Cập nhật' : 'Thêm thành tích'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function exportAchievementsPDF(achievements: Achievement[], month: number | null, year: number, name: string) {
  const title = month
    ? `Thành tích tháng ${month}/${year}`
    : `Thành tích năm ${year}`

  const rows = achievements.map((a) => `
    <tr>
      <td>${formatDate(a.date)}</td>
      <td><span class="badge ${a.type}">${ACHIEVEMENT_TYPE_LABELS[a.type]}</span></td>
      <td>${a.level ? ACHIEVEMENT_LEVEL_LABELS[a.level] : '—'}</td>
      <td>${a.title}</td>
      <td>${a.description || '—'}</td>
    </tr>
  `).join('')

  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Be Vietnam Pro', sans-serif; font-size: 13px; padding: 24px; color: #111; }
    h2 { font-size: 16px; font-weight: 700; text-align: center; margin-bottom: 4px; }
    p.sub { text-align: center; color: #555; margin-bottom: 16px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f0f4ff; font-weight: 600; padding: 8px 10px; border: 1px solid #ccc; text-align: left; font-size: 12px; }
    td { padding: 7px 10px; border: 1px solid #ddd; vertical-align: top; font-size: 12px; }
    tr:nth-child(even) td { background: #fafafa; }
    .badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .giai_hoc_sinh { background: #fef9c3; color: #854d0e; }
    .khen_thuong { background: #dcfce7; color: #166534; }
    .sang_kien { background: #dbeafe; color: #1e40af; }
    .danh_hieu { background: #f3e8ff; color: #6b21a8; }
    .khac { background: #f1f5f9; color: #475569; }
    @media print { body { padding: 12px; } }
  </style></head><body>
  <h2>${title}</h2>
  <p class="sub">${name} — In ngày ${new Date().toLocaleDateString('vi-VN')}</p>
  <table>
    <thead><tr><th>Ngày</th><th>Loại</th><th>Cấp độ</th><th>Nội dung</th><th>Chi tiết</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:#888">Chưa có thành tích nào</td></tr>'}</tbody>
  </table>
  <script>window.onload=()=>window.print()</script>
  </body></html>`

  const w = window.open('', '_blank')
  if (w) { w.document.write(html); w.document.close() }
}

export function Achievements() {
  const { user } = useAuth()
  const toast = useToast()
  const now = getCurrentMonthYear()

  const [month, setMonth] = useState<number | null>(null)
  const [year, setYear] = useState(now.year)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Achievement | undefined>()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const { achievements, loading, addAchievement, updateAchievement, deleteAchievement } =
    useAchievements(user?.id, month ?? undefined, year)

  const years = Array.from({ length: 5 }, (_, i) => now.year - 2 + i)

  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')

  const handleSubmit = async (data: FormData) => {
    const date = data.date
    const m = parseInt(date.split('-')[1])
    const y = parseInt(date.split('-')[0])
    const payload = {
      user_id: user!.id,
      date,
      month: m,
      year: y,
      title: data.title,
      type: data.type as AchievementType,
      level: (data.level as AchievementLevel) || null,
      description: data.description || null,
    }
    if (editing) {
      const { error } = await updateAchievement(editing.id, payload)
      if (error) toast('Lỗi khi cập nhật!', 'error')
      else toast('Đã cập nhật thành tích', 'success')
    } else {
      const { error } = await addAchievement(payload)
      if (error) toast('Lỗi khi thêm thành tích!', 'error')
      else toast('Đã thêm thành tích', 'success')
    }
    setEditing(undefined)
  }

  const handleDelete = async (id: string) => {
    const { error } = await deleteAchievement(id)
    if (error) toast('Lỗi khi xóa!', 'error')
    else toast('Đã xóa thành tích', 'success')
  }

  const stats = Object.keys(ACHIEVEMENT_TYPE_LABELS).map((type) => ({
    type: type as AchievementType,
    count: achievements.filter((a) => a.type === type).length,
  })).filter((s) => s.count > 0)

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Thành tích
          </h1>
          <p className="text-muted-foreground text-sm">Lưu thành tích cá nhân để nộp xét thi đua</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={month ?? ''}
            onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
            className="h-9 w-28 text-sm"
          >
            <option value="">Cả năm</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </Select>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="h-9 w-20 text-sm">
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {stats.map(({ type, count }) => (
            <span key={type} className={cn('px-3 py-1 rounded-full text-xs font-semibold', ACHIEVEMENT_TYPE_COLORS[type])}>
              {ACHIEVEMENT_TYPE_LABELS[type]}: {count}
            </span>
          ))}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            Tổng: {achievements.length}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => { setEditing(undefined); setFormOpen(true) }} className="gap-2">
          <Plus className="h-4 w-4" /> Thêm thành tích
        </Button>
        {achievements.length > 0 && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              exportAchievementsPDF(achievements, month, year, profile.name || 'Giáo viên')
              toast('Đã mở cửa sổ in danh sách thành tích', 'info')
            }}
          >
            <FileText className="h-4 w-4" /> Xuất PDF
          </Button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : achievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có thành tích nào được ghi nhận</p>
            <p className="text-sm mt-1">Nhấn "Thêm thành tích" để bắt đầu lưu lại</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {achievements.map((a) => (
            <Card key={a.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', ACHIEVEMENT_TYPE_COLORS[a.type])}>
                        {ACHIEVEMENT_TYPE_LABELS[a.type]}
                      </span>
                      {a.level && (
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', ACHIEVEMENT_LEVEL_COLORS[a.level])}>
                          {ACHIEVEMENT_LEVEL_LABELS[a.level]}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(a.date)}</span>
                    </div>
                    <p className="font-medium text-sm">{a.title}</p>
                    {a.description && (
                      <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => { setEditing(a); setFormOpen(true) }}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={() => setConfirmId(a.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <AchievementForm
        open={formOpen}
        onOpenChange={(v) => { setFormOpen(v); if (!v) setEditing(undefined) }}
        item={editing}
        onSubmit={handleSubmit}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmId !== null}
        title="Xóa thành tích"
        message="Thành tích này sẽ bị xóa vĩnh viễn. Bạn có chắc không?"
        confirmLabel="Xóa"
        onConfirm={() => { if (confirmId) handleDelete(confirmId); setConfirmId(null) }}
        onCancel={() => setConfirmId(null)}
      />

      {/* Note */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Hướng dẫn sử dụng</p>
          <p>• <strong>Giải học sinh</strong>: Ghi rõ tên HS, môn, cấp, giải (VD: HS Nguyễn A – Giải Nhì Tin học cấp huyện)</p>
          <p>• <strong>Khen thưởng cá nhân</strong>: Quyết định khen, giấy khen từ cấp nào</p>
          <p>• <strong>Sáng kiến KN</strong>: Tên SKKN, đã được công nhận cấp nào, năm nào</p>
          <p>• <strong>Danh hiệu</strong>: CSTĐ cơ sở, Lao động tiên tiến, Chiến sĩ thi đua...</p>
          <p>• Xuất PDF để nộp Hội đồng thi đua khi xét cuối năm</p>
        </CardContent>
      </Card>
    </div>
  )
}
