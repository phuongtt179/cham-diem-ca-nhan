# PROGRESS.md – Trạng thái dự án

## Trạng thái hiện tại: v1.1 – Hoàn thiện UX

**Ngày bắt đầu**: 2026-05-09  
**Phiên làm việc cuối**: 2026-05-11

---

## ✅ Đã hoàn thành (v1.0)

### Cấu hình dự án
- [x] Vite + React 18 + TypeScript
- [x] Tailwind CSS v3 + CSS variables (light/dark)
- [x] TypeScript path alias `@/` → `src/`
- [x] `.env.example` với VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
- [x] `.gitignore` cập nhật (bảo vệ `.env`)

### Database & Backend
- [x] SQL migration: `supabase/migration.sql`
  - Bảng `tasks` + indexes
  - Bảng `score_criteria_a`
  - Bảng `monthly_summary`
  - RLS policies cho cả 3 bảng (select/insert/update/delete)
  - Grants cho `authenticated`

### Core Logic
- [x] `src/types/index.ts` – Tất cả TypeScript types + label constants + color constants
- [x] `src/lib/supabase.ts` – Supabase client
- [x] `src/lib/scoreCalculator.ts` – **Công thức QĐ 32 đầy đủ**:
  - calcScoreQuantity() – Điểm số lượng (20đ)
  - calcScoreTimeline() – Điểm tiến độ (20đ)
  - calcScoreQuality() – Điểm chất lượng (30đ)
  - calcScoreA() – Tổng điểm A từ 10 tiêu chí
  - calcBonusPoints() – Điểm cộng (max 6đ)
  - calcPenaltyPoints() – Điểm trừ
  - getClassification() – Xếp loại
  - calculateScore() – Tính tổng hợp
  - getUpcomingDeadlines() – Cảnh báo sắp đến hạn
  - getOverdueTasks() – Cảnh báo trễ hạn
- [x] `src/lib/utils.ts` – Utilities: cn(), formatDate(), isOverdue(), isUpcoming()
- [x] `src/lib/exportUtils.ts` – Xuất PDF (jsPDF) và CSV
- [x] `src/lib/taskTemplates.ts` – 20 mẫu công việc giáo viên tiểu học

### Hooks
- [x] `useAuth.ts` – Supabase auth (signIn, signUp, signOut)
- [x] `useTasks.ts` – CRUD tasks theo tháng/năm
- [x] `useScore.ts` – CRUD score_criteria_a
- [x] `useMonthSummary.ts` – CRUD monthly_summary

### UI Components
- [x] `src/components/ui/` – UI primitives: Button, Input, Card, Badge, Select, Label, Textarea, Dialog, Alert, Progress
- [x] `Layout.tsx` – App shell với sidebar (desktop) + mobile header
- [x] `ScoreCard.tsx` – Hiển thị điểm (compact + full mode)
- [x] `TaskForm.tsx` – Form thêm/sửa CV với chọn mẫu nhanh + validation Zod
- [x] `TaskList.tsx` – Danh sách CV với filter, sort, expand/collapse
- [x] `Charts.tsx` – TrendChart (line), MonthProgressChart (bar), CategoryPieChart (pie)

### Pages
- [x] `Login.tsx` – Đăng nhập + đăng ký, giao diện tiếng Việt
- [x] `Dashboard.tsx` – Tổng quan: stats, cảnh báo, điểm dự kiến, biểu đồ
- [x] `Tasks.tsx` – Quản lý CV với điều hướng tháng/năm
- [x] `ScoreCriteriaA.tsx` – Nhập điểm 10 tiêu chí với progress bars
- [x] `Summary.tsx` – Bảng tính điểm chi tiết + lưu lịch sử + xuất PDF/CSV
- [x] `History.tsx` – Lịch sử tháng với TrendChart + filter theo năm
- [x] `Settings.tsx` – Thông tin cá nhân + cài đặt Supabase

### Documentation
- [x] `CLAUDE.md` – Hướng dẫn kỹ thuật
- [x] `PROGRESS.md` – Trạng thái dự án (file này)
- [x] `NOTES.md` – Ghi chú quyết định
- [x] `COMPONENTS.md` – Danh sách components
- [x] `README.md` – Hướng dẫn cài đặt và chạy

---

## ✅ Đã hoàn thành (v1.1) – 2026-05-11

- [x] `src/App.css` – Xóa nội dung template Vite cũ
- [x] `src/components/ui/toast.tsx` – Toast notification system (ToastProvider + useToast hook)
- [x] `src/components/ui/confirm-dialog.tsx` – ConfirmDialog thay thế native `window.confirm()`
- [x] `src/lib/exportUtils.ts` – Rewrite PDF: bỏ jsPDF, dùng print window + Google Fonts (Be Vietnam Pro) để hỗ trợ tiếng Việt
- [x] `src/App.tsx` – Bọc ToastProvider
- [x] `src/components/TaskList.tsx` – Dùng ConfirmDialog thay confirm()
- [x] `src/pages/Summary.tsx` – Dùng useToast, bỏ inline state messages
- [x] `src/pages/Settings.tsx` – Dùng useToast, bỏ inline state messages
- [x] `src/pages/ScoreCriteriaA.tsx` – Dùng useToast, bỏ `saved` state + JSX block
- [x] Build `npm run build` thành công, 0 TypeScript errors

## 🔄 TODO (phiên làm việc tiếp theo)

### Cần test
- [ ] Test flow đăng nhập/đăng ký với Supabase thực
- [ ] Test tính điểm với dữ liệu mẫu
- [ ] Test xuất PDF (print window + tiếng Việt)
- [ ] Test responsive trên mobile

### Có thể cải thiện
- [ ] Thêm loading skeleton (hiện chỉ dùng text "Đang tải...")
- [ ] Trang 404
- [ ] Unit tests cho `scoreCalculator.ts`

### Tính năng mở rộng (future)
- [ ] Báo cáo năm học (9 tháng)
- [ ] Chia sẻ kết quả với lãnh đạo
- [ ] Import/export toàn bộ dữ liệu
- [ ] Notification push khi sắp đến hạn

---

## Cấu trúc file hiện tại

```
e:\UNG DUNG\cham-dem-ca-nhan\
├── src/
│   ├── components/ui/    ← 10 UI components
│   ├── components/       ← 5 feature components
│   ├── hooks/            ← 4 hooks
│   ├── lib/              ← 5 utilities
│   ├── pages/            ← 7 pages
│   ├── types/            ← types index
│   ├── App.tsx, main.tsx, index.css
├── supabase/migration.sql
├── CLAUDE.md, PROGRESS.md, NOTES.md, COMPONENTS.md, README.md
├── .env.example, .gitignore
├── tailwind.config.js, vite.config.ts, tsconfig.app.json
└── package.json
```
