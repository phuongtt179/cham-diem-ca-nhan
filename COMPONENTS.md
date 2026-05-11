# COMPONENTS.md – Danh sách Components (v1.2)

## UI Primitives (`src/components/ui/`)

| File | Export | Props chính | Ghi chú |
|------|--------|-------------|---------|
| `alert.tsx` | `Alert`, `AlertTitle`, `AlertDescription` | `variant?: 'default'\|'destructive'` | |
| `badge.tsx` | `Badge` | `variant?: 'default'\|'secondary'\|'destructive'\|'outline'` | |
| `button.tsx` | `Button` | `variant`, `size` | forwardRef |
| `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | className | |
| `confirm-dialog.tsx` | `ConfirmDialog` | `open`, `title`, `message`, `confirmLabel`, `onConfirm`, `onCancel` | Thay thế `window.confirm()` |
| `dialog.tsx` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogCloseButton` | `open`, `onOpenChange` | Responsive mobile: wrapper `px-3`, content `p-4 sm:p-6` |
| `input.tsx` | `Input` | extends HTMLInputElement | forwardRef |
| `label.tsx` | `Label` | extends HTMLLabelElement | forwardRef |
| `progress.tsx` | `Progress` | `value`, `max` | |
| `select.tsx` | `Select` | extends HTMLSelectElement | Native `<select>`, tốt cho mobile |
| `textarea.tsx` | `Textarea` | extends HTMLTextAreaElement | forwardRef |
| `toast.tsx` | `ToastProvider`, `useToast` | — | Context-based, `useToast()` trả về `(message, type) => void` |

---

## Feature Components (`src/components/`)

### `Layout.tsx`
**Export**: `Layout`  
**Props**: `children`, `darkMode: boolean`, `onToggleDark: () => void`  
**Nav items**: Tổng quan / Công việc / Tiêu chí A / Tổng hợp tháng / Thành tích / Lịch sử / Cài đặt  
**Chức năng**: Sidebar desktop (w-60) + mobile overlay + mobile header. NavLink active styling. User email + dark toggle + logout ở bottom sidebar.

### `ScoreCard.tsx`
**Export**: `ScoreCard`  
**Props**: `score: ScoreBreakdown`, `compact?: boolean`  
**Chức năng**: Hiển thị điểm. Compact: Dashboard (tóm tắt). Full: Summary (progress bars từng tiêu chí).

### `TaskForm.tsx`
**Export**: `TaskForm`  
**Props**: `open`, `onOpenChange`, `task?: Task`, `onSubmit`  
**Fields**:
- Ngày thực hiện, Hạn hoàn thành
- Tên công việc/Sản phẩm
- Loại CV / Mức độ tham gia (Chủ trì/Phối hợp) / Tính chất — grid 1 cột mobile, 3 cột sm+
- Người giao việc
- Trạng thái / Ngày hoàn thành thực tế
- Badge tiến độ tự động: Sớm hạn (xanh) / Đúng hạn (xanh dương) / Trễ hạn (đỏ)
- Lý do trễ hạn — chỉ hiện khi trễ
- Chất lượng / Người xác nhận
- Ghi chú nội bộ (không xuất báo cáo)
- Kiến nghị/Đề xuất (xuất cột 17 Mẫu 01TKNV)
- Được khen thưởng (+1đ)

### `TaskList.tsx`
**Export**: `TaskList`  
**Props**: `tasks: Task[]`, `onEdit: (task) => void`, `onDelete: (id) => void`  
**Toolbar**: Hàng 1 = filter theo status (5 nút pill). Hàng 2 = sort theo Ngày/Hạn/Trạng thái.  
**Expanded view hiển thị**: Ngày, Tính chất, Mức độ tham gia, Chất lượng, Ngày HT, Tiến độ (Sớm/Đúng/Trễ màu), Xác nhận, Lý do trễ (đỏ), Ghi chú nội bộ, Kiến nghị/ĐX (xanh).

### `Charts.tsx`
**Export**: `TrendChart`, `MonthProgressChart`, `CategoryPieChart`

| Component | Loại chart | Props | Dùng ở |
|-----------|-----------|-------|--------|
| `TrendChart` | LineChart | `summaries: MonthlySummary[]` | History |
| `MonthProgressChart` | BarChart horizontal | `totalTasks`, `completedTasks`, `onTimeTasks`, `qualityTasks` | Dashboard |
| `CategoryPieChart` | PieChart donut | `categoryData: {name, value, color}[]` | Dashboard |

---

## Pages (`src/pages/`)

| Page | Route | Chức năng chính |
|------|-------|----------------|
| `Login.tsx` | `/login` | Đăng nhập/đăng ký Supabase Auth |
| `Dashboard.tsx` | `/` | Tổng quan tháng hiện tại: stats, cảnh báo trễ/sắp hạn, điểm dự kiến, biểu đồ |
| `Tasks.tsx` | `/tasks` | Quản lý CV: thêm/sửa/xóa, điều hướng tháng/năm, mini stats bar |
| `ScoreCriteriaA.tsx` | `/score-a` | Nhập điểm 10 tiêu chí A (3 nhóm, max 30đ), progress bars real-time |
| `Summary.tsx` | `/summary` | Bảng tính điểm chi tiết + lưu lịch sử + xuất PDF Mẫu 01TKNV + xuất CSV |
| `Achievements.tsx` | `/achievements` | Thành tích cá nhân: thêm/sửa/xóa, filter tháng/năm, xuất PDF danh sách |
| `History.tsx` | `/history` | Lịch sử tháng với TrendChart + filter theo năm |
| `Settings.tsx` | `/settings` | Thông tin cá nhân (localStorage) + danh sách mẫu CV |

---

## Hooks (`src/hooks/`)

| Hook | Returns | Dùng ở |
|------|---------|--------|
| `useAuth` | `user, session, loading, signIn, signUp, signOut` | App.tsx, Layout, Login, Settings |
| `useTasks` | `tasks, loading, error, addTask, updateTask, deleteTask, refetch` | Dashboard, Tasks, Summary |
| `useScore` | `criteriaA, loading, saveCriteriaA, refetch` | Dashboard, ScoreCriteriaA, Summary |
| `useMonthSummary` | `summaries, loading, upsertSummary, refetch` | History, Summary |
| `useAchievements` | `achievements, loading, addAchievement, updateAchievement, deleteAchievement` | Achievements |

---

## Lib (`src/lib/`)

| File | Functions chính | Ghi chú |
|------|----------------|---------|
| `scoreCalculator.ts` | `calculateScore()`, `calcScoreA()`, `calcBonusPoints()`, `calcPenaltyPoints()`, `getClassification()`, `getUpcomingDeadlines()`, `getOverdueTasks()` | File quan trọng nhất |
| `exportUtils.ts` | `exportMau01TKNV()`, `exportTasksToCSV()` | Print window + Google Fonts, KHÔNG dùng jsPDF |
| `taskTemplates.ts` | `TASK_TEMPLATES: TaskTemplate[]` | 20 mẫu CV giáo viên tiểu học |
| `utils.ts` | `cn()`, `formatDate()`, `formatMonth()`, `isOverdue()`, `isUpcoming()`, `getCurrentMonthYear()` | |
| `supabase.ts` | `supabase` (client) | |

---

## Types & Constants (`src/types/index.ts`)

| Type/Constant | Giá trị |
|---|---|
| `TaskCategory` | `ke_hoach` / `chuyen_mon` / `dot_xuat` / `kiem_nhiem` |
| `TaskStatus` | `chua_thuc_hien` / `dang_thuc_hien` / `hoan_thanh` / `chua_hoan_thanh` |
| `TaskComplexity` | `binh_thuong` / `phuc_tap` / `rat_phuc_tap` |
| `TaskParticipation` | `chu_tri` / `phoi_hop` |
| `TaskQuality` | `dat` / `chua_dat` / `vuot_muc` |
| `AchievementType` | `giai_hoc_sinh` / `khen_thuong` / `sang_kien` / `danh_hieu` / `khac` |
| `AchievementLevel` | `cap_truong` / `cap_phuong` / `cap_tinh` / `cap_quoc_gia` |
| `Classification` | `xuat_sac` / `tot` / `hoan_thanh` / `khong_hoan_thanh` |
| `CATEGORY_LABELS` | "NV khác" cho `kiem_nhiem` (không phải "Kiêm nhiệm") |
| `PARTICIPATION_LABELS` | "Chủ trì" / "Phối hợp" (ngắn gọn) |
