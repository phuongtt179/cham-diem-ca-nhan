-- ============================================================
-- Migration: Theo dõi & Chấm điểm Công việc Giáo viên
-- QĐ 32/2026/QĐ-UBND thành phố Đà Nẵng
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. Bảng tasks (công việc hằng ngày) ────────────────────
CREATE TABLE IF NOT EXISTS public.tasks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year            INTEGER NOT NULL,
  date            DATE NOT NULL,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('ke_hoach', 'chuyen_mon', 'dot_xuat', 'kiem_nhiem')),
  complexity      TEXT NOT NULL DEFAULT 'binh_thuong' CHECK (complexity IN ('binh_thuong', 'phuc_tap', 'rat_phuc_tap')),
  participation   TEXT NOT NULL DEFAULT 'chu_tri' CHECK (participation IN ('chu_tri', 'phoi_hop')),
  assigned_by     TEXT NOT NULL DEFAULT '',
  deadline        DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'chua_thuc_hien' CHECK (status IN ('chua_thuc_hien', 'dang_thuc_hien', 'hoan_thanh', 'chua_hoan_thanh')),
  completion_date DATE,
  quality         TEXT NOT NULL DEFAULT 'dat' CHECK (quality IN ('dat', 'chua_dat', 'vuot_muc')),
  confirmed_by    TEXT,
  note            TEXT,
  is_bonus        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index để query nhanh theo user/tháng/năm
CREATE INDEX IF NOT EXISTS tasks_user_month_year_idx ON public.tasks(user_id, year, month);

-- ─── 2. Bảng score_criteria_a (điểm tiêu chí chung) ────────
CREATE TABLE IF NOT EXISTS public.score_criteria_a (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month                 INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year                  INTEGER NOT NULL,
  -- Nhóm I: Phẩm chất chính trị (tối đa 10đ)
  pham_chat_chinh_tri   DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (pham_chat_chinh_tri BETWEEN 0 AND 5),
  y_thuc_ky_luat        DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (y_thuc_ky_luat BETWEEN 0 AND 5),
  -- Nhóm II: Năng lực chuyên môn (tối đa 10đ)
  nang_luc_chuyen_mon   DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (nang_luc_chuyen_mon BETWEEN 0 AND 2.5),
  kha_nang_dap_ung      DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (kha_nang_dap_ung BETWEEN 0 AND 2.5),
  tinh_than_trach_nhiem DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (tinh_than_trach_nhiem BETWEEN 0 AND 2.5),
  thai_do_phuc_vu       DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (thai_do_phuc_vu BETWEEN 0 AND 2.5),
  -- Nhóm III: Năng lực đổi mới (tối đa 10đ)
  sang_tao_dot_pha      DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (sang_tao_dot_pha BETWEEN 0 AND 2.5),
  dam_nghi_dam_lam      DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (dam_nghi_dam_lam BETWEEN 0 AND 2.5),
  chiu_trach_nhiem      DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (chiu_trach_nhiem BETWEEN 0 AND 2.5),
  chu_dong_quyet_dinh   DECIMAL(4,2) NOT NULL DEFAULT 0 CHECK (chu_dong_quyet_dinh BETWEEN 0 AND 2.5),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- ─── 3. Bảng monthly_summary (tổng hợp cuối tháng) ─────────
CREATE TABLE IF NOT EXISTS public.monthly_summary (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month            INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year             INTEGER NOT NULL,
  total_tasks      INTEGER NOT NULL DEFAULT 0,
  completed_tasks  INTEGER NOT NULL DEFAULT 0,
  on_time_tasks    INTEGER NOT NULL DEFAULT 0,
  quality_tasks    INTEGER NOT NULL DEFAULT 0,
  score_a          DECIMAL(5,2) NOT NULL DEFAULT 0,
  score_b          DECIMAL(5,2) NOT NULL DEFAULT 0,
  score_total      DECIMAL(5,2) NOT NULL DEFAULT 0,
  bonus_points     DECIMAL(5,2) NOT NULL DEFAULT 0,
  penalty_points   DECIMAL(5,2) NOT NULL DEFAULT 0,
  classification   TEXT NOT NULL DEFAULT 'khong_hoan_thanh'
                   CHECK (classification IN ('xuat_sac', 'tot', 'hoan_thanh', 'khong_hoan_thanh')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, month, year)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Bật RLS cho tất cả bảng
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_criteria_a ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_summary ENABLE ROW LEVEL SECURITY;

-- ─── RLS Policies: tasks ────────────────────────────────────
CREATE POLICY "tasks_select_own" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_own" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_own" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_own" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- ─── RLS Policies: score_criteria_a ─────────────────────────
CREATE POLICY "score_a_select_own" ON public.score_criteria_a
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "score_a_insert_own" ON public.score_criteria_a
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "score_a_update_own" ON public.score_criteria_a
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "score_a_delete_own" ON public.score_criteria_a
  FOR DELETE USING (auth.uid() = user_id);

-- ─── RLS Policies: monthly_summary ──────────────────────────
CREATE POLICY "summary_select_own" ON public.monthly_summary
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "summary_insert_own" ON public.monthly_summary
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "summary_update_own" ON public.monthly_summary
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "summary_delete_own" ON public.monthly_summary
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Grants cho authenticated users
-- ============================================================
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.score_criteria_a TO authenticated;
GRANT ALL ON public.monthly_summary TO authenticated;
