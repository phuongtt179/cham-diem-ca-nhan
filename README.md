# Theo dõi & Chấm điểm Công việc Giáo viên

Ứng dụng web giúp giáo viên theo dõi công việc hằng ngày và tự động tính điểm tháng theo **QĐ 32/2026/QĐ-UBND thành phố Đà Nẵng** (Mẫu 03, Phụ lục III).

## Tính năng

- **Dashboard**: Tổng quan tháng, thống kê nhanh, cảnh báo trễ hạn, điểm dự kiến real-time
- **Quản lý công việc**: Thêm/sửa/xóa, lọc theo trạng thái, 20 mẫu công việc sẵn có
- **Chấm điểm tiêu chí A**: Nhập điểm 10 tiêu chí theo 3 nhóm (tối đa 30 điểm)
- **Tổng hợp tháng**: Tính điểm tự động theo công thức QĐ 32, xuất PDF và CSV
- **Lịch sử**: Xem kết quả các tháng trước với biểu đồ xu hướng
- **Dark/Light mode**, **Responsive** (dùng được trên điện thoại)

## Cài đặt

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo Supabase project

1. Truy cập [supabase.com](https://supabase.com) → tạo project mới
2. Vào **SQL Editor** → paste toàn bộ nội dung file `supabase/migration.sql` → chạy
3. Vào **Authentication > Email** → có thể tắt "Confirm email" để test nhanh
4. Vào **Project Settings > API** → copy **Project URL** và **anon/public key**

### 3. Cấu hình môi trường

Tạo file `.env` (copy từ `.env.example`):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở `http://localhost:5173`

## Công thức tính điểm (QĐ 32/2026)

```
Tổng điểm = Điểm A (≤30đ) + Điểm B (≤70đ) - Điểm trừ

Phần B:
• Tỷ lệ hoàn thành (20đ)
• Tỷ lệ tiến độ (20đ)
• Tỷ lệ chất lượng (30đ)

Xếp loại: ≥90: Xuất sắc | 70-89: Tốt | 50-69: Hoàn thành | <50: Không HT
```

## Tech Stack

React 18 + TypeScript + Vite + Tailwind CSS + Supabase + Recharts + React Hook Form + Zod

## Lưu ý

- File `.env` KHÔNG được commit lên git
- Mỗi giáo viên có tài khoản riêng, dữ liệu bảo vệ bằng Supabase RLS
- Xem `CLAUDE.md` để hiểu cấu trúc kỹ thuật
