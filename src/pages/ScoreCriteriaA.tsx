import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useScore } from '@/hooks/useScore'
import { getCurrentMonthYear, formatMonth } from '@/lib/utils'
import { calcScoreA } from '@/lib/scoreCalculator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Save, Info } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import type { ScoreCriteriaA as ScoreCriteriaAType } from '@/types'

interface CriteriaField {
  key: keyof ScoreCriteriaAType
  label: string
  description: string
  max: number
}

const CRITERIA_GROUPS: { title: string; description: string; max: number; fields: CriteriaField[] }[] = [
  {
    title: 'Nhóm I: Phẩm chất chính trị, đạo đức, lối sống',
    description: 'Tối đa 10 điểm',
    max: 10,
    fields: [
      {
        key: 'pham_chat_chinh_tri',
        label: 'Phẩm chất chính trị',
        description: 'Lập trường, quan điểm chính trị; chấp hành chủ trương, chính sách...',
        max: 5,
      },
      {
        key: 'y_thuc_ky_luat',
        label: 'Ý thức kỷ luật, đạo đức lối sống',
        description: 'Chấp hành kỷ luật, nội quy cơ quan; trung thực, liêm khiết...',
        max: 5,
      },
    ],
  },
  {
    title: 'Nhóm II: Năng lực chuyên môn, nghiệp vụ',
    description: 'Tối đa 10 điểm',
    max: 10,
    fields: [
      {
        key: 'nang_luc_chuyen_mon',
        label: 'Năng lực chuyên môn',
        description: 'Kiến thức, kỹ năng chuyên môn; hiệu quả công việc...',
        max: 2.5,
      },
      {
        key: 'kha_nang_dap_ung',
        label: 'Khả năng đáp ứng yêu cầu nhiệm vụ',
        description: 'Hoàn thành nhiệm vụ được giao đúng tiến độ, chất lượng...',
        max: 2.5,
      },
      {
        key: 'tinh_than_trach_nhiem',
        label: 'Tinh thần trách nhiệm',
        description: 'Nhiệt tình, chủ động trong công việc; phối hợp với đồng nghiệp...',
        max: 2.5,
      },
      {
        key: 'thai_do_phuc_vu',
        label: 'Thái độ phục vụ nhân dân',
        description: 'Giao tiếp, ứng xử với học sinh, phụ huynh và đồng nghiệp...',
        max: 2.5,
      },
    ],
  },
  {
    title: 'Nhóm III: Năng lực đổi mới, sáng tạo',
    description: 'Tối đa 10 điểm',
    max: 10,
    fields: [
      {
        key: 'sang_tao_dot_pha',
        label: 'Sáng tạo, đột phá',
        description: 'Đề xuất giải pháp mới, sáng kiến cải tiến; ứng dụng công nghệ...',
        max: 2.5,
      },
      {
        key: 'dam_nghi_dam_lam',
        label: 'Dám nghĩ, dám làm',
        description: 'Mạnh dạn đề xuất, thực hiện các giải pháp mới...',
        max: 2.5,
      },
      {
        key: 'chiu_trach_nhiem',
        label: 'Chịu trách nhiệm',
        description: 'Dám chịu trách nhiệm trước kết quả công việc...',
        max: 2.5,
      },
      {
        key: 'chu_dong_quyet_dinh',
        label: 'Chủ động, quyết đoán',
        description: 'Chủ động trong xử lý công việc; quyết đoán trong phạm vi thẩm quyền...',
        max: 2.5,
      },
    ],
  },
]

const defaultValues = {
  pham_chat_chinh_tri: 0,
  y_thuc_ky_luat: 0,
  nang_luc_chuyen_mon: 0,
  kha_nang_dap_ung: 0,
  tinh_than_trach_nhiem: 0,
  thai_do_phuc_vu: 0,
  sang_tao_dot_pha: 0,
  dam_nghi_dam_lam: 0,
  chiu_trach_nhiem: 0,
  chu_dong_quyet_dinh: 0,
}

export function ScoreCriteriaAPage() {
  const { user } = useAuth()
  const toast = useToast()
  const now = getCurrentMonthYear()
  const [month, setMonth] = useState(now.month)
  const [year, setYear] = useState(now.year)
  const { criteriaA, loading, saveCriteriaA } = useScore(user?.id, month, year)
  const [values, setValues] = useState({ ...defaultValues })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (criteriaA) {
      setValues({
        pham_chat_chinh_tri: criteriaA.pham_chat_chinh_tri,
        y_thuc_ky_luat: criteriaA.y_thuc_ky_luat,
        nang_luc_chuyen_mon: criteriaA.nang_luc_chuyen_mon,
        kha_nang_dap_ung: criteriaA.kha_nang_dap_ung,
        tinh_than_trach_nhiem: criteriaA.tinh_than_trach_nhiem,
        thai_do_phuc_vu: criteriaA.thai_do_phuc_vu,
        sang_tao_dot_pha: criteriaA.sang_tao_dot_pha,
        dam_nghi_dam_lam: criteriaA.dam_nghi_dam_lam,
        chiu_trach_nhiem: criteriaA.chiu_trach_nhiem,
        chu_dong_quyet_dinh: criteriaA.chu_dong_quyet_dinh,
      })
    } else {
      setValues({ ...defaultValues })
    }
  }, [criteriaA])

  const totalA = calcScoreA({ ...values } as ScoreCriteriaAType)

  const handleChange = (key: keyof typeof values, rawVal: string, max: number) => {
    const val = Math.min(max, Math.max(0, parseFloat(rawVal) || 0))
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await saveCriteriaA({ ...values, user_id: user.id, month, year })
    setSaving(false)
    if (error) toast('Lỗi khi lưu điểm tiêu chí A!', 'error')
    else toast(`Đã lưu điểm tiêu chí A tháng ${month}/${year}`, 'success')
  }

  const years = Array.from({ length: 5 }, (_, i) => now.year - 2 + i)

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tiêu chí A</h1>
          <p className="text-muted-foreground text-sm">Điểm tiêu chí chung – nhập 1 lần/tháng</p>
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

      {/* Tổng điểm A */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tổng điểm A ({formatMonth(month, year)})</p>
            <p className="text-3xl font-bold text-primary mt-1">{totalA.toFixed(1)} / 30</p>
          </div>
          <Progress value={totalA} max={30} className="w-32 h-3" />
        </CardContent>
      </Card>

      {/* Criteria groups */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : (
        CRITERIA_GROUPS.map((group) => {
          const groupTotal = group.fields.reduce((sum, f) => sum + (values[f.key as keyof typeof values] as number), 0)
          return (
            <Card key={group.title}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{group.title}</CardTitle>
                  <span className="text-sm font-semibold text-primary">
                    {groupTotal.toFixed(1)} / {group.max}
                  </span>
                </div>
                <CardDescription>{group.description}</CardDescription>
                <Progress value={groupTotal} max={group.max} className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">{field.label}</Label>
                      <span className="text-xs text-muted-foreground">Tối đa {field.max}đ</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={0}
                        max={field.max}
                        step={0.25}
                        value={values[field.key as keyof typeof values]}
                        onChange={(e) => handleChange(field.key as keyof typeof values, e.target.value, field.max)}
                        className="w-24 text-center font-semibold"
                      />
                      <Progress
                        value={(values[field.key as keyof typeof values] as number)}
                        max={field.max}
                        className="flex-1 h-2"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })
      )}

      {/* Save button */}
      <div className="flex items-center gap-3 sticky bottom-4">
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg">
          <Save className="h-4 w-4" />
          {saving ? 'Đang lưu...' : 'Lưu điểm tiêu chí A'}
        </Button>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Điểm tiêu chí A được nhập thủ công theo đánh giá của tập thể/lãnh đạo. Giá trị mỗi tiêu chí
          từ 0 đến điểm tối đa, có thể nhập số lẻ (0.25, 0.5...).
        </p>
      </div>
    </div>
  )
}
