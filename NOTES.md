# NOTES.md – Ghi chú quan trọng & quyết định thiết kế

## Quyết định kỹ thuật

### 1. Tailwind CSS v3 thay vì v4
**Lý do**: `npm create vite` cài Tailwind v4 theo mặc định, nhưng v4 không tương thích với cú pháp `darkMode: ['class']`. Đã downgrade về v3 (`tailwindcss@3`).
**Áp dụng**: Nếu thêm dependency liên quan Tailwind, kiểm tra tương thích với v3.

### 2. UI Components tự viết thay vì shadcn/ui CLI
**Lý do**: shadcn/ui CLI phức tạp trên Windows (Radix UI, forwardRef). Tự viết primitives theo style shadcn nhưng không phụ thuộc Radix UI.
**Đánh đổi**: Thiếu animation Dialog, Select dropdown custom. Có thể nâng cấp sau.

### 3. `<select>` native thay vì Select component custom
**Lý do**: Đơn giản hơn, hoạt động tốt trên mobile, không cần Radix UI.

### 4. Điểm cộng KHÔNG cộng vào tổng điểm chính thức
**Lý do**: Theo QĐ 32/2026, điểm cộng được "ghi nhận" nhưng không cộng vào tổng. `calculateScore()` trả về `bonusPoints` riêng — tổng = A + B - trừ.

### 5. `monthly_summary` lưu thủ công
**Lý do**: Dữ liệu tổng hợp tháng tính real-time từ tasks + criteriaA. Bảng `monthly_summary` là snapshot lịch sử — user phải nhấn "Lưu vào lịch sử" chủ động. Tránh auto-save khi dữ liệu chưa đầy đủ.

### 6. Profile người dùng lưu localStorage thay vì Supabase
**Lý do**: Thông tin họ tên, chức vụ, đơn vị không cần đồng bộ đa thiết bị giai đoạn đầu. Có thể migrate sang Supabase sau.

### 7. Dark mode dùng class strategy thay vì media query
**Lý do**: Cho phép user toggle thủ công, lưu vào localStorage. Class `.dark` trên `<html>` được toggle bởi `App.tsx`.

### 8. TaskList expand/collapse thay vì modal
**Lý do**: UX tốt hơn trên mobile, tránh modal chồng nhau.

### 9. PDF dùng print window thay vì jsPDF (v1.1)
**Lý do**: jsPDF không hỗ trợ font tiếng Việt nếu không embed font (tốn dung lượng). Print window + Google Fonts (Be Vietnam Pro) đơn giản hơn và in đúng dấu tiếng Việt.
**Áp dụng**: `exportMau01TKNV()` và `exportAchievementsPDF()` đều dùng `window.open()` + `window.print()`.

### 10. Tách `note` và `proposal` trong Task (v1.2)
**Lý do**: Trước đây chỉ có `note` nhưng nó lại xuất vào cột 17 báo cáo — người dùng muốn ghi chú nội bộ mà không bị lộ ra báo cáo.
- `note` = ghi chú nội bộ, private, KHÔNG xuất vào Mẫu 01TKNV
- `proposal` = kiến nghị/đề xuất chính thức, xuất vào **cột 17** Mẫu 01TKNV

### 11. Cột 9 Mẫu 01TKNV chỉ hiện khi thực sự chưa HT (v1.2)
**Lý do**: Task chưa đến hạn mà status `chua_thuc_hien` không nên bị ghi vào cột "Lý do chưa hoàn thành". Chỉ hiện khi: status = `chua_hoan_thanh` HOẶC (deadline < hôm nay VÀ status != `hoan_thanh`).

### 12. Achievements lưu theo tháng, có thể xem cả năm (v1.2)
**Lý do**: Phiên thi đua xét theo năm học nhưng user muốn nhập dần từng tháng không quên. Filter "Cả năm" để xem tổng và xuất PDF khi cần nộp.

### 13. Cấp "phường" thay vì "huyện" trong Achievements (v1.2)
**Lý do**: Đà Nẵng là thành phố trực thuộc TW, không có cấp huyện — đơn vị là phường/xã. Key `cap_phuong`, KHÔNG dùng `cap_huyen`.

---

## Công thức điểm quan trọng

### Thang điểm số lượng & tiến độ (mỗi cái max 20đ)
≥95%: 20đ | ≥90%: 18đ | ≥80%: 15đ | ≥70%: 12đ | ≥60%: 8đ | <60%: 0đ

### Thang điểm chất lượng (max 30đ) — bắt đầu từ 50%
≥95%: 30đ | ≥90%: 25đ | ≥80%: 20đ | ≥70%: 15đ | ≥60%: 10đ | ≥50%: 5đ | <50%: 0đ

### "Đúng/sớm hạn" = completion_date ≤ deadline
Chỉ tính khi status = `hoan_thanh` VÀ `completion_date` không null VÀ `completion_date <= deadline`.

### "Đạt yêu cầu chất lượng" = quality != 'chua_dat'
Cả `dat` và `vuot_muc` đều được tính là đạt chất lượng.

### Điểm cộng (ghi nhận, không cộng vào tổng)
- CV đột xuất hoàn thành: +0.5/việc, max 1đ
- Sớm hạn ≥80%: +1đ; 50–80%: +0.5đ
- Khen thưởng (is_bonus): +1/việc, max 2đ
- CV phức tạp/rất phức tạp hoàn thành: +1/việc, max 2đ

---

## Supabase Setup Checklist

### Fresh install (DB chưa có gì)
1. Tạo project tại supabase.com
2. SQL Editor → chạy toàn bộ `supabase/migration.sql`
3. Authentication > Email → tắt "Confirm email" nếu muốn test nhanh
4. Copy Project URL và anon key vào file `.env`

### Upgrade DB đang chạy (đã có bảng tasks từ v1.0/v1.1)
1. SQL Editor → chạy `supabase/alter_v1.2.sql`
2. Script tự xử lý `IF NOT EXISTS` — an toàn để chạy nhiều lần

---

## Vercel Deployment

Biến môi trường cần set trong Vercel Dashboard → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Sau khi thêm biến → Redeploy. Không cần push code mới.

---

## Lệnh hay dùng
```bash
npm run dev      # Dev server localhost:5173
npm run build    # Build production
npm run preview  # Preview build
```

## Hạn chế hiện tại (v1.2)
1. Không có unit tests cho `scoreCalculator.ts`
2. Profile người dùng lưu localStorage (không đồng bộ đa thiết bị)
3. Chưa có trang 404
4. Không có loading skeleton (chỉ dùng text "Đang tải...")
