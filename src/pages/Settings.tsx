import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { TASK_TEMPLATES } from '@/lib/taskTemplates'
import { CATEGORY_LABELS, COMPLEXITY_LABELS } from '@/types'
import { Save, User, Database, ListTodo, Info } from 'lucide-react'

interface ProfileData {
  name: string
  position: string
  unit: string
  school: string
  additional_roles: string
}

interface SupabaseConfig {
  url: string
  anonKey: string
}

export function Settings() {
  const { user, signOut } = useAuth()
  const toast = useToast()

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    position: 'Giáo viên',
    unit: '',
    school: '',
    additional_roles: 'Thanh tra nhân dân, Phụ trách CNTT',
  })

  const [supabaseConfig] = useState<SupabaseConfig>({
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '(đã cấu hình)' : '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('userProfile')
    if (saved) {
      const parsed = JSON.parse(saved)
      setProfile((prev) => ({
        ...prev,
        ...parsed,
        additional_roles: Array.isArray(parsed.additional_roles)
          ? parsed.additional_roles.join(', ')
          : parsed.additional_roles || '',
      }))
    }
  }, [])

  const handleSaveProfile = () => {
    const toSave = {
      ...profile,
      additional_roles: profile.additional_roles.split(',').map((s) => s.trim()).filter(Boolean),
    }
    localStorage.setItem('userProfile', JSON.stringify(toSave))
    toast('Đã lưu thông tin cá nhân', 'success')
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold">Cài đặt</h1>

      {/* Thông tin cá nhân */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Thông tin cá nhân
          </CardTitle>
          <CardDescription>Thông tin này dùng để xuất phiếu tự đánh giá PDF</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Họ và tên</Label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Chức vụ</Label>
              <Input
                value={profile.position}
                onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                placeholder="Giáo viên"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tổ/Nhóm</Label>
              <Input
                value={profile.unit}
                onChange={(e) => setProfile({ ...profile, unit: e.target.value })}
                placeholder="Tổ Toán - Lý"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Trường/Đơn vị</Label>
            <Input
              value={profile.school}
              onChange={(e) => setProfile({ ...profile, school: e.target.value })}
              placeholder="Trường Tiểu học..."
              className="mt-1"
            />
          </div>
          <div>
            <Label>Kiêm nhiệm (phân cách bằng dấu phẩy)</Label>
            <Input
              value={profile.additional_roles}
              onChange={(e) => setProfile({ ...profile, additional_roles: e.target.value })}
              placeholder="Thanh tra nhân dân, Phụ trách CNTT"
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="h-4 w-4" /> Lưu thông tin
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tài khoản */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" /> Tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">Email đăng nhập</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Dữ liệu được lưu trên Supabase và đồng bộ theo tài khoản của bạn.
            </p>
            <Button variant="destructive" size="sm" onClick={signOut}>
              Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cấu hình Supabase */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" /> Cấu hình Supabase
          </CardTitle>
          <CardDescription>
            Thông tin kết nối Supabase (cấu hình qua file .env)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Cách cấu hình:</p>
              <p>Tạo file <code className="bg-background px-1 rounded">.env</code> ở thư mục gốc với nội dung:</p>
              <pre className="mt-2 p-2 bg-background rounded text-xs font-mono">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...`}
              </pre>
            </div>
          </div>
          <div>
            <Label>Supabase URL hiện tại</Label>
            <Input value={supabaseConfig.url} readOnly className="mt-1 opacity-60" />
          </div>
          <div>
            <Label>Anon Key</Label>
            <Input value={supabaseConfig.anonKey || '(chưa cấu hình)'} readOnly className="mt-1 opacity-60" />
          </div>
        </CardContent>
      </Card>

      {/* Template công việc */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ListTodo className="h-4 w-4" /> Mẫu công việc thường dùng
          </CardTitle>
          <CardDescription>
            {TASK_TEMPLATES.length} mẫu công việc sẵn có cho giáo viên tiểu học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {TASK_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50 text-sm"
              >
                <span className="font-medium">{tpl.title}</span>
                <div className="flex gap-2 text-xs text-muted-foreground flex-shrink-0 ml-2">
                  <span>{CATEGORY_LABELS[tpl.category]}</span>
                  <span>·</span>
                  <span>{COMPLEXITY_LABELS[tpl.complexity]}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Các mẫu này xuất hiện khi bạn thêm công việc mới để chọn nhanh.
          </p>
        </CardContent>
      </Card>

      {/* Thông tin ứng dụng */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Về ứng dụng</p>
          <p>Theo dõi & Chấm điểm Công việc Giáo viên v1.0</p>
          <p>Áp dụng theo QĐ 32/2026/QĐ-UBND thành phố Đà Nẵng</p>
          <p>Mẫu 03 (Phụ lục III) – Dành cho giáo viên không giữ chức vụ lãnh đạo</p>
        </CardContent>
      </Card>
    </div>
  )
}
