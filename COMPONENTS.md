# COMPONENTS.md – Danh sách Components

## UI Primitives (`src/components/ui/`)

| File | Export | Props chính | Ghi chú |
|------|--------|-------------|---------|
| `alert.tsx` | `Alert`, `AlertTitle`, `AlertDescription` | `variant?: 'default'\|'destructive'` | |
| `badge.tsx` | `Badge` | `variant?: 'default'\|'secondary'\|'destructive'\|'outline'` | |
| `button.tsx` | `Button` | `variant`, `size` | forwardRef |
| `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | className | |
| `dialog.tsx` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogCloseButton` | `open`, `onOpenChange` | Custom, không dùng Radix |
| `input.tsx` | `Input` | extends HTMLInputElement | forwardRef |
| `label.tsx` | `Label` | extends HTMLLabelElement | forwardRef |
| `progress.tsx` | `Progress` | `value`, `max` | |
| `select.tsx` | `Select` | extends HTMLSelectElement | Native select |
| `textarea.tsx` | `Textarea` | extends HTMLTextAreaElement | forwardRef |

## Feature Components (`src/components/`)

### `Layout.tsx`
**Export**: `Layout`  
**Props**: `children`, `darkMode: boolean`, `onToggleDark: () => void`  
**Chức năng**: App shell. Sidebar desktop (w-60) + mobile overlay + header mobile. NavLink active styling. User info + logout + dark toggle ở bottom sidebar.

### `ScoreCard.tsx`
**Export**: `ScoreCard`  
**Props**: `score: ScoreBreakdown`, `compact?: boolean`  
**Chức năng**: Hiển thị điểm. Compact mode: dùng ở Dashboard (3 dòng). Full mode: dùng ở Summary (đầy đủ với progress bars từng tiêu chí).

### `TaskForm.tsx`
**Export**: `TaskForm`  
**Props**: `open`, `onOpenChange`, `task?: Task`, `onSubmit`  
**Chức năng**: Dialog form thêm/sửa công việc. Có dropdown chọn mẫu nhanh từ TASK_TEMPLATES. Validation Zod. Disable completion_date khi status != hoan_thanh.

### `TaskList.tsx`
**Export**: `TaskList`  
**Props**: `tasks: Task[]`, `onEdit: (task) => void`, `onDelete: (id) => void`  
**Chức năng**: Filter theo status (all/4 trạng thái), sort theo date/deadline/status. Expand/collapse từng task. Hiển thị badge màu deadline (đỏ=trễ, cam=sắp đến, xanh=đúng hạn).

### `Charts.tsx`
**Export**: `TrendChart`, `MonthProgressChart`, `CategoryPieChart`

| Component | Loại chart | Props | Dùng ở |
|-----------|-----------|-------|--------|
| `TrendChart` | LineChart | `summaries: MonthlySummary[]` | History |
| `MonthProgressChart` | BarChart horizontal | `totalTasks`, `completedTasks`, `onTimeTasks`, `qualityTasks` | Dashboard |
| `CategoryPieChart` | PieChart donut | `categoryData: {name, value, color}[]` | Dashboard |

## Pages (`src/pages/`)

| Page | Route | Chức năng chính |
|------|-------|----------------|
| `Login.tsx` | `/login` | Đăng nhập/đăng ký Supabase Auth |
| `Dashboard.tsx` | `/` | Tổng quan tháng hiện tại: stats, cảnh báo, điểm dự kiến, biểu đồ |
| `Tasks.tsx` | `/tasks` | Quản lý CV: thêm/sửa/xóa, điều hướng tháng/năm |
| `ScoreCriteriaA.tsx` | `/score-a` | Nhập điểm 10 tiêu chí A theo 3 nhóm |
| `Summary.tsx` | `/summary` | Bảng tính điểm chi tiết + lưu lịch sử + xuất PDF/CSV |
| `History.tsx` | `/history` | Lịch sử tháng với trend chart + filter theo năm |
| `Settings.tsx` | `/settings` | Thông tin cá nhân + cài đặt Supabase + danh sách mẫu CV |

## Hooks (`src/hooks/`)

| Hook | Returns | Dùng ở |
|------|---------|--------|
| `useAuth` | `user, session, loading, signIn, signUp, signOut` | App.tsx, Layout, Login, Settings |
| `useTasks` | `tasks, loading, error, addTask, updateTask, deleteTask, refetch` | Dashboard, Tasks, Summary |
| `useScore` | `criteriaA, loading, saveCriteriaA, refetch` | Dashboard, ScoreCriteriaA, Summary |
| `useMonthSummary` | `summaries, loading, upsertSummary, refetch` | History, Summary |

## Lib (`src/lib/`)

| File | Functions |
|------|-----------|
| `scoreCalculator.ts` | `calculateScore()`, `calcScoreA()`, `calcBonusPoints()`, `calcPenaltyPoints()`, `getClassification()`, `getUpcomingDeadlines()`, `getOverdueTasks()` |
| `exportUtils.ts` | `exportTasksToCSV()`, `exportSummaryToPDF()` |
| `taskTemplates.ts` | `TASK_TEMPLATES: TaskTemplate[]` (20 mẫu) |
| `utils.ts` | `cn()`, `formatDate()`, `formatMonth()`, `isOverdue()`, `isUpcoming()`, `getCurrentMonthYear()`, `getTaskStatusColor()` |
| `supabase.ts` | `supabase` (client) |
