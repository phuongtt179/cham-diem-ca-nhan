export type TaskCategory = 'ke_hoach' | 'chuyen_mon' | 'dot_xuat' | 'kiem_nhiem'
export type TaskComplexity = 'binh_thuong' | 'phuc_tap' | 'rat_phuc_tap'
export type TaskStatus = 'chua_thuc_hien' | 'dang_thuc_hien' | 'hoan_thanh' | 'chua_hoan_thanh'
export type TaskQuality = 'dat' | 'chua_dat' | 'vuot_muc'
export type TaskParticipation = 'chu_tri' | 'phoi_hop'
export type Classification = 'xuat_sac' | 'tot' | 'hoan_thanh' | 'khong_hoan_thanh'

export interface Task {
  id: string
  user_id: string
  month: number
  year: number
  date: string
  title: string
  category: TaskCategory
  complexity: TaskComplexity
  participation: TaskParticipation
  assigned_by: string
  deadline: string
  status: TaskStatus
  completion_date: string | null
  quality: TaskQuality
  confirmed_by: string | null
  note: string | null
  proposal: string | null
  late_reason: string | null
  is_bonus: boolean
  created_at: string
}

export interface ScoreCriteriaA {
  id: string
  user_id: string
  month: number
  year: number
  // Nhóm I: Phẩm chất chính trị (tối đa 10đ)
  pham_chat_chinh_tri: number   // tối đa 5đ
  y_thuc_ky_luat: number        // tối đa 5đ
  // Nhóm II: Năng lực chuyên môn (tối đa 10đ)
  nang_luc_chuyen_mon: number   // tối đa 2.5đ
  kha_nang_dap_ung: number      // tối đa 2.5đ
  tinh_than_trach_nhiem: number // tối đa 2.5đ
  thai_do_phuc_vu: number       // tối đa 2.5đ
  // Nhóm III: Năng lực đổi mới (tối đa 10đ)
  sang_tao_dot_pha: number      // tối đa 2.5đ
  dam_nghi_dam_lam: number      // tối đa 2.5đ
  chiu_trach_nhiem: number      // tối đa 2.5đ
  chu_dong_quyet_dinh: number   // tối đa 2.5đ
  created_at: string
}

export interface MonthlySummary {
  id: string
  user_id: string
  month: number
  year: number
  total_tasks: number
  completed_tasks: number
  on_time_tasks: number
  quality_tasks: number
  score_a: number
  score_b: number
  score_total: number
  bonus_points: number
  penalty_points: number
  classification: Classification
  created_at: string
}

export interface ScoreBreakdown {
  // Phần B
  totalTasks: number
  completedTasks: number
  onTimeTasks: number
  qualityTasks: number
  completionRate: number
  onTimeRate: number
  qualityRate: number
  scoreQuantity: number    // 20đ max
  scoreTimeline: number    // 20đ max
  scoreQuality: number     // 30đ max
  scoreB: number           // 70đ max
  // Phần A
  scoreA: number           // 30đ max
  // Điểm cộng/trừ
  bonusPoints: number
  penaltyPoints: number
  // Tổng
  totalScore: number
  classification: Classification
}

export type AchievementType = 'giai_hoc_sinh' | 'khen_thuong' | 'sang_kien' | 'danh_hieu' | 'khac'
export type AchievementLevel = 'cap_truong' | 'cap_phuong' | 'cap_tinh' | 'cap_quoc_gia'

export interface Achievement {
  id: string
  user_id: string
  date: string
  month: number
  year: number
  title: string
  type: AchievementType
  level: AchievementLevel | null
  description: string | null
  created_at: string
}

export const ACHIEVEMENT_TYPE_LABELS: Record<AchievementType, string> = {
  giai_hoc_sinh: 'Giải học sinh',
  khen_thuong: 'Khen thưởng cá nhân',
  sang_kien: 'Sáng kiến kinh nghiệm',
  danh_hieu: 'Danh hiệu thi đua',
  khac: 'Khác',
}

export const ACHIEVEMENT_LEVEL_LABELS: Record<AchievementLevel, string> = {
  cap_truong: 'Cấp trường',
  cap_phuong: 'Cấp phường',
  cap_tinh: 'Cấp tỉnh/TP',
  cap_quoc_gia: 'Cấp quốc gia',
}

export const ACHIEVEMENT_TYPE_COLORS: Record<AchievementType, string> = {
  giai_hoc_sinh: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  khen_thuong: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  sang_kien: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  danh_hieu: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  khac: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
}

export const ACHIEVEMENT_LEVEL_COLORS: Record<AchievementLevel, string> = {
  cap_truong: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  cap_phuong: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  cap_tinh: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  cap_quoc_gia: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export interface UserProfile {
  name: string
  position: string
  unit: string
  school: string
  additional_roles: string[]
}

export interface TaskTemplate {
  id: string
  title: string
  category: TaskCategory
  complexity: TaskComplexity
  assigned_by: string
}

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  ke_hoach: 'Kế hoạch',
  chuyen_mon: 'Chuyên môn',
  dot_xuat: 'Đột xuất',
  kiem_nhiem: 'NV khác',
}

export const PARTICIPATION_LABELS: Record<TaskParticipation, string> = {
  chu_tri: 'Chủ trì',
  phoi_hop: 'Phối hợp',
}

export const COMPLEXITY_LABELS: Record<TaskComplexity, string> = {
  binh_thuong: 'Bình thường',
  phuc_tap: 'Phức tạp',
  rat_phuc_tap: 'Rất phức tạp',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  chua_thuc_hien: 'Chưa thực hiện',
  dang_thuc_hien: 'Đang thực hiện',
  hoan_thanh: 'Hoàn thành',
  chua_hoan_thanh: 'Chưa hoàn thành',
}

export const QUALITY_LABELS: Record<TaskQuality, string> = {
  dat: 'Đạt',
  chua_dat: 'Chưa đạt',
  vuot_muc: 'Vượt mức',
}

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  xuat_sac: 'Hoàn thành xuất sắc',
  tot: 'Hoàn thành tốt',
  hoan_thanh: 'Hoàn thành',
  khong_hoan_thanh: 'Không hoàn thành',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  hoan_thanh: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  dang_thuc_hien: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  chua_hoan_thanh: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  chua_thuc_hien: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
}

export const CLASSIFICATION_COLORS: Record<Classification, string> = {
  xuat_sac: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
  tot: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400',
  hoan_thanh: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400',
  khong_hoan_thanh: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400',
}
