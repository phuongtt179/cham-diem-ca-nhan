-- ============================================================
-- ALTER SCRIPT v1.2 – Chạy trên DB đang có sẵn (không fresh)
-- Áp dụng khi đã có bảng tasks từ phiên v1.0/v1.1
-- ============================================================

-- 1. Thêm cột participation vào tasks (nếu chưa có)
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS participation TEXT NOT NULL DEFAULT 'chu_tri'
  CHECK (participation IN ('chu_tri', 'phoi_hop'));

-- 2. Thêm cột late_reason vào tasks
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS late_reason TEXT;

-- 3. Thêm cột proposal vào tasks
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS proposal TEXT;

-- 4. Tạo bảng achievements (thành tích cá nhân)
CREATE TABLE IF NOT EXISTS public.achievements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year        INTEGER NOT NULL,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('giai_hoc_sinh', 'khen_thuong', 'sang_kien', 'danh_hieu', 'khac')),
  level       TEXT CHECK (level IN ('cap_truong', 'cap_phuong', 'cap_tinh', 'cap_quoc_gia')),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS achievements_user_year_idx ON public.achievements(user_id, year);

-- 5. Bật RLS + policies cho achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_own" ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "achievements_insert_own" ON public.achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "achievements_update_own" ON public.achievements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "achievements_delete_own" ON public.achievements
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Grant quyền
GRANT ALL ON public.achievements TO authenticated;
