# PROGRESS.md – Trạng thái dự án

## Trạng thái hiện tại: v1.2 – Tính năng đầy đủ, responsive mobile

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

## ✅ Đã hoàn thành (v1.2) – 2026-05-11

### Tính năng mới

- [x] **Mức độ tham gia**: Thêm field `participation` (Chủ trì / Phối hợp) vào Task
  - DB: cột `participation TEXT DEFAULT 'chu_tri'` trong bảng `tasks`
  - UI: dropdown trong TaskForm (grid 3 cột cùng Loại CV + Tính chất)
  - Hiển thị trong TaskList expanded view
  - Tính điểm: Phối hợp = Chủ trì (không phân biệt)

- [x] **Tiến độ hoàn thành**: Sớm hạn / Đúng hạn / Trễ hạn
  - DB: cột `late_reason TEXT` trong bảng `tasks`
  - UI: badge màu tự động tính từ `completion_date` vs `deadline`
  - Ô "Lý do trễ hạn" chỉ hiện khi trễ
  - Hiển thị màu trong TaskList expanded view

- [x] **Tách Ghi chú và Kiến nghị/Đề xuất**
  - DB: cột `proposal TEXT` trong bảng `tasks`
  - `note` = ghi chú nội bộ, KHÔNG xuất vào báo cáo PDF
  - `proposal` = kiến nghị chính thức, xuất vào **cột 17** Mẫu 01TKNV
  - Layout: 2 hàng dọc thay vì 2 cột ngang

- [x] **Trang Thành tích** (`src/pages/Achievements.tsx`)
  - Lưu thành tích cá nhân để nộp xét thi đua cuối năm
  - Loại: Giải học sinh / Khen thưởng / Sáng kiến KN / Danh hiệu / Khác
  - Cấp: Cấp trường / Cấp phường / Cấp tỉnh / Cấp quốc gia
  - Ô nhập "Giải học sinh" = Textarea rows=5 (nhập nhiều em 1 lần)
  - Filter theo tháng hoặc cả năm
  - Xuất PDF danh sách thành tích
  - DB: bảng `achievements` + RLS

- [x] **Xuất PDF Mẫu 01TKNV** (Phụ lục III, QĐ 32/2026)
  - A4 landscape, 18 cột, header 3 dòng (rowspan/colspan)
  - 4 nhóm: I=Kế hoạch, II=Chuyên môn, III=Đột xuất, IV=NV khác
  - Cột 9 (Lý do chưa HT): chỉ hiện khi thực sự trễ/chưa HT, không hiện cho task chưa đến hạn
  - Cột 17: lấy từ `proposal`, KHÔNG lấy từ `note`
  - Bảng thống kê số lượng/tiến độ/chất lượng ở cuối
  - Dùng print window + Google Fonts (Be Vietnam Pro) thay jsPDF

- [x] **Đổi nhãn**: "Kiêm nhiệm" → "NV khác" (key `kiem_nhiem` giữ nguyên)
- [x] **Nhãn tham gia**: "Chủ trì thực hiện" → "Chủ trì", "Phối hợp thực hiện" → "Phối hợp"

### Database
- [x] `supabase/migration.sql` – Cập nhật đầy đủ: `participation`, `late_reason`, `proposal`, bảng `achievements`
- [x] `supabase/alter_v1.2.sql` – Script ALTER cho DB đang chạy (không cần tạo lại từ đầu)

### Hooks & Routes
- [x] `src/hooks/useAchievements.ts` – CRUD hook cho bảng achievements
- [x] `src/App.tsx` – Thêm route `/achievements`
- [x] `src/components/Layout.tsx` – Thêm nav "Thành tích" (icon Trophy)

### Responsive Mobile
- [x] `dialog.tsx` – Bỏ `max-w-lg` cứng, padding `p-4 sm:p-6`
- [x] `TaskForm.tsx` – `grid-cols-3` → `grid-cols-1 sm:grid-cols-3`
- [x] `TaskList.tsx` – Tách filter/sort thành 2 hàng riêng
- [x] `Layout.tsx` – Content padding `p-3 sm:p-4 md:p-6`

### Khác
- [x] Icon app: dùng `icon.png` làm favicon + apple-touch-icon
- [x] Title trang: "Chấm điểm GV – QĐ 32/2026"
- [x] Push lên GitHub: `https://github.com/phuongtt179/cham-diem-ca-nhan`
- [x] Git user: `phuongtt179 / phuongtt179@gmail.com`

---

## 🔄 TODO (phiên làm việc tiếp theo)

### Cần test
- [ ] Test flow đăng nhập/đăng ký với Supabase thực
- [ ] Test tính điểm với dữ liệu mẫu
- [ ] Test xuất PDF Mẫu 01TKNV (in thật trên giấy A4 landscape)
- [ ] Test responsive thực tế trên điện thoại (Chrome DevTools + thiết bị thật)
- [ ] Chạy `supabase/alter_v1.2.sql` trên Supabase nếu DB đã có sẵn

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

## Cấu trúc file hiện tại (v1.2)

```
e:\UNG DUNG\cham-dem-ca-nhan\
├── src/
│   ├── components/ui/    ← 11 UI components (+ toast, confirm-dialog)
│   ├── components/       ← 5 feature components (Layout, TaskForm, TaskList, ScoreCard, Charts)
│   ├── hooks/            ← 5 hooks (+ useAchievements)
│   ├── lib/              ← 5 utilities (exportUtils dùng print window)
│   ├── pages/            ← 8 pages (+ Achievements)
│   ├── types/            ← types + constants (PARTICIPATION_LABELS, ACHIEVEMENT_* labels)
│   ├── App.tsx, main.tsx, index.css
├── supabase/
│   ├── migration.sql     ← Schema đầy đủ (fresh install)
│   └── alter_v1.2.sql    ← ALTER script cho DB đang chạy
├── public/
│   ├── icon.png          ← App icon (favicon + apple-touch-icon)
│   └── favicon.svg, icons.svg
├── CLAUDE.md, PROGRESS.md, NOTES.md, COMPONENTS.md, README.md
├── MAU NHAP CONG VIEC.xlsx  ← File mẫu tham khảo Mẫu 01TKNV
├── .env.example, .gitignore
├── tailwind.config.js, vite.config.ts, tsconfig.app.json
└── package.json
```

## Supabase DB Schema hiện tại

| Bảng | Cột đáng chú ý |
|---|---|
| `tasks` | `participation` (chu_tri/phoi_hop), `late_reason`, `proposal`, `note` (private) |
| `score_criteria_a` | 10 tiêu chí thuộc 3 nhóm, max 30đ |
| `monthly_summary` | Lưu thủ công cuối tháng, có `classification` |
| `achievements` | `type`, `level` (cap_phuong thay cap_huyen), `title` (Textarea) |

## GitHub
- Repo: `https://github.com/phuongtt179/cham-diem-ca-nhan`
- Branch: `master`
- Git user: `phuongtt179 / phuongtt179@gmail.com`
