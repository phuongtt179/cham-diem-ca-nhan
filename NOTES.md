# NOTES.md – Ghi chú quan trọng & quyết định thiết kế

## Quyết định kỹ thuật

### 1. Tailwind CSS v3 thay vì v4
**Lý do**: `npm create vite` cài Tailwind v4 theo mặc định, nhưng v4 không tương thích với cú pháp `darkMode: ['class']` và cách shadcn/ui hoạt động. Đã downgrade về v3 (`tailwindcss@3`).

### 2. UI Components tự viết thay vì shadcn/ui CLI
**Lý do**: shadcn/ui CLI yêu cầu cấu hình phức tạp trên Windows (Radix UI, forwardRef v.v.). Để tiết kiệm thời gian, tự viết các primitives đơn giản (Button, Input, Card...) theo style shadcn nhưng không phụ thuộc vào Radix UI.  
**Đánh đổi**: Thiếu một số tính năng nâng cao như Dialog có animation, Select dropdown custom. Có thể nâng cấp sau.

### 3. `<select>` native thay vì Select component custom
**Lý do**: Đơn giản hơn, hoạt động tốt trên mobile, không cần Radix UI.

### 4. Điểm cộng KHÔNG cộng vào tổng điểm chính thức
**Lý do**: Theo QĐ 32/2026, điểm cộng được "ghi nhận" chứ không cộng vào tổng. Xem `scoreCalculator.ts` → `calculateScore()`: tổng = A + B - trừ (không có cộng).

### 5. `monthly_summary` lưu thủ công
**Lý do**: Dữ liệu tổng hợp tháng được tính real-time từ tasks và criteriaA. Bảng `monthly_summary` chỉ là snapshot để xem lịch sử – người dùng phải nhấn "Lưu vào lịch sử" chủ động. Tránh auto-save gây nhầm lẫn khi dữ liệu chưa đầy đủ.

### 6. Profile người dùng lưu localStorage thay vì Supabase
**Lý do**: Thông tin như họ tên, chức vụ, đơn vị không cần đồng bộ đa thiết bị trong giai đoạn đầu. Tránh tạo thêm bảng Supabase và query phức tạp. Có thể migrate sang Supabase sau.

### 7. Dark mode dùng class strategy thay vì media query
**Lý do**: Cho phép user toggle thủ công, lưu preference vào localStorage. Class `.dark` trên `<html>` được toggle bởi `App.tsx`.

### 8. TaskList expand/collapse thay vì modal
**Lý do**: UX tốt hơn trên mobile, tránh mở nhiều modal chồng nhau.

## Công thức điểm quan trọng

### Điểm chất lượng có thang khác
Thang điểm chất lượng bắt đầu từ 50% (thay vì 60% như 2 tiêu chí kia):
- ≥95%: 30đ | ≥90%: 25đ | ≥80%: 20đ | ≥70%: 15đ | ≥60%: 10đ | ≥50%: 5đ | <50%: 0đ

### "Đúng/sớm hạn" = completion_date ≤ deadline
Chỉ tính khi task có status `hoan_thanh` VÀ `completion_date` không null VÀ `completion_date <= deadline`.

### "Đạt yêu cầu chất lượng" = quality != 'chua_dat'
Cả `dat` và `vuot_muc` đều được tính là đạt chất lượng.

## Hạn chế hiện tại (v1.0)
1. PDF xuất bằng jsPDF không hỗ trợ font tiếng Việt (cần embed font). Hiện dùng chữ không dấu trong PDF.
2. Không có toast notifications – dùng inline state messages.
3. Không có unit tests.
4. `App.css` cũ của Vite vẫn tồn tại nhưng không được import trong App.tsx mới.

## Lệnh hay dùng
```bash
npm run dev      # Dev server
npm run build    # Build production
npm run preview  # Preview build
```

## Supabase Setup Checklist
1. Tạo project tại supabase.com
2. Vào SQL Editor, chạy toàn bộ `supabase/migration.sql`
3. Vào Authentication > Email → tắt "Confirm email" nếu muốn test nhanh
4. Copy Project URL và anon key vào file `.env`
