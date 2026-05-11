# CLAUDE.md – Hướng dẫn kỹ thuật dự án

## Tên dự án
**Theo dõi & Chấm điểm Công việc Giáo viên** theo QĐ 32/2026/QĐ-UBND TP Đà Nẵng

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + custom CSS variables (shadcn-style)
- **Database/Auth**: Supabase (PostgreSQL + RLS)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Date**: date-fns với locale tiếng Việt
- **Export**: jsPDF (PDF) + custom CSV
- **Routing**: React Router v6
- **State**: React hooks (không dùng Redux/Zustand)

## Cấu trúc thư mục
```
src/
├── components/
│   ├── ui/          ← UI primitives tự viết (không dùng shadcn CLI)
│   │   ├── alert.tsx, badge.tsx, button.tsx, card.tsx
│   │   ├── dialog.tsx, input.tsx, label.tsx, progress.tsx
│   │   ├── select.tsx, textarea.tsx
│   ├── Charts.tsx       ← Recharts: TrendChart, MonthProgressChart, CategoryPieChart
│   ├── Layout.tsx       ← App shell: sidebar + mobile header
│   ├── ScoreCard.tsx    ← Hiển thị điểm tổng hợp
│   ├── TaskForm.tsx     ← Form thêm/sửa công việc (React Hook Form + Zod)
│   └── TaskList.tsx     ← Danh sách CV có filter/sort/expand
├── hooks/
│   ├── useAuth.ts       ← Supabase auth state
│   ├── useMonthSummary.ts ← CRUD monthly_summary
│   ├── useScore.ts      ← CRUD score_criteria_a
│   └── useTasks.ts      ← CRUD tasks theo tháng/năm
├── lib/
│   ├── exportUtils.ts   ← Xuất PDF (jsPDF) và CSV
│   ├── scoreCalculator.ts ← Logic tính điểm QĐ 32 (ĐÂY LÀ FILE QUAN TRỌNG NHẤT)
│   ├── supabase.ts      ← Supabase client
│   ├── taskTemplates.ts ← 20 mẫu CV giáo viên tiểu học
│   └── utils.ts         ← cn(), formatDate(), isOverdue(), isUpcoming()
├── pages/
│   ├── Dashboard.tsx    ← Tổng quan: stats, cảnh báo, điểm dự kiến
│   ├── History.tsx      ← Lịch sử tháng: trend chart + danh sách
│   ├── Login.tsx        ← Đăng nhập/đăng ký Supabase Auth
│   ├── ScoreCriteriaA.tsx ← Nhập điểm tiêu chí A (10 tiêu chí)
│   ├── Settings.tsx     ← Thông tin cá nhân + cài đặt Supabase
│   ├── Summary.tsx      ← Tổng hợp tháng + xuất PDF/CSV
│   └── Tasks.tsx        ← Quản lý công việc theo tháng
├── types/
│   └── index.ts         ← Tất cả TypeScript types + constants (labels, colors)
├── App.tsx              ← Router + auth guard + dark mode
└── index.css            ← Tailwind imports + CSS variables (light/dark theme)
```

## Database Schema (Supabase)

### Bảng `tasks`
Lưu công việc hằng ngày. Filter theo `user_id + month + year`.
- `category`: ke_hoach | chuyen_mon | dot_xuat | kiem_nhiem
- `status`: chua_thuc_hien | dang_thuc_hien | hoan_thanh | chua_hoan_thanh
- `quality`: dat | chua_dat | vuot_muc
- `is_bonus`: boolean – được khen thưởng/biểu dương

### Bảng `score_criteria_a`
Điểm tiêu chí chung (Phần A). UNIQUE(user_id, month, year).
10 tiêu chí thuộc 3 nhóm, tổng tối đa 30 điểm.

### Bảng `monthly_summary`
Lưu tổng hợp cuối tháng. UNIQUE(user_id, month, year).
Được lưu thủ công sau khi người dùng nhấn "Lưu vào lịch sử".

## Công thức tính điểm (scoreCalculator.ts)

```
Tổng điểm = Điểm A (0-30) + Điểm B (0-70) - Điểm trừ

Phần B:
- Điểm số lượng (20đ): (completed/total)*100% → thang điểm
- Điểm tiến độ (20đ): (onTime/total)*100% → thang điểm tương tự
- Điểm chất lượng (30đ): (quality/total)*100% → thang điểm riêng

Điểm cộng (ghi nhận, không cộng vào tổng):
- CV đột xuất: +0.5/việc, max 1đ
- Sớm ≥80%: +1đ; Sớm 50-80%: +0.5đ
- Khen thưởng: +1/việc, max 2đ
- Phức tạp HT: +1/việc, max 2đ

Xếp loại: ≥90: Xuất sắc | 70-89: Tốt | 50-69: HT | <50: Không HT
```

## Quy ước code
- Không dùng `any` trong TypeScript
- Components dùng named export (không default export)
- Hooks trả về object, không array
- CSS: Tailwind utility classes, ưu tiên `cn()` từ `@/lib/utils`
- Không viết comment trừ khi logic phức tạp thực sự cần
- File import: dùng `@/` alias thay đường dẫn tương đối

## Biến môi trường
```
VITE_SUPABASE_URL=   # Supabase Project URL
VITE_SUPABASE_ANON_KEY=  # Supabase anon/public key
```

## Dark Mode
Toggle bằng class `.dark` trên `<html>`. Lưu preference vào `localStorage`.
CSS variables định nghĩa trong `src/index.css` cho cả light và dark.

## Thông tin người dùng mục tiêu
- Giáo viên tiểu học, không giữ chức vụ lãnh đạo
- Kiêm nhiệm: Thanh tra nhân dân + Phụ trách CNTT
- Áp dụng Mẫu 03 (Phụ lục III, QĐ 32/2026)
