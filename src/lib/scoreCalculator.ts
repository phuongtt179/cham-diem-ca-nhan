import type { Task, ScoreCriteriaA, ScoreBreakdown, Classification } from '@/types'

// ─── Phần B: Tỷ lệ số lượng (20đ) ───────────────────────────────────────────
function calcScoreQuantity(rate: number): number {
  if (rate >= 100) return 20
  if (rate >= 90) return 15
  if (rate >= 80) return 10
  if (rate >= 70) return 5
  if (rate >= 60) return 1
  return 0
}

// ─── Phần B: Tỷ lệ tiến độ (20đ) ────────────────────────────────────────────
function calcScoreTimeline(rate: number): number {
  if (rate >= 100) return 20
  if (rate >= 90) return 15
  if (rate >= 80) return 10
  if (rate >= 70) return 5
  if (rate >= 60) return 1
  return 0
}

// ─── Phần B: Tỷ lệ chất lượng (30đ) ─────────────────────────────────────────
function calcScoreQuality(rate: number): number {
  if (rate >= 95) return 30
  if (rate >= 90) return 25
  if (rate >= 80) return 20
  if (rate >= 70) return 15
  if (rate >= 60) return 10
  if (rate >= 50) return 5
  return 0
}

// ─── Điểm tiêu chí A ─────────────────────────────────────────────────────────
export function calcScoreA(criteria: ScoreCriteriaA): number {
  const groupI = criteria.pham_chat_chinh_tri + criteria.y_thuc_ky_luat
  const groupII =
    criteria.nang_luc_chuyen_mon +
    criteria.kha_nang_dap_ung +
    criteria.tinh_than_trach_nhiem +
    criteria.thai_do_phuc_vu
  const groupIII =
    criteria.sang_tao_dot_pha +
    criteria.dam_nghi_dam_lam +
    criteria.chiu_trach_nhiem +
    criteria.chu_dong_quyet_dinh
  return Math.min(groupI, 10) + Math.min(groupII, 10) + Math.min(groupIII, 10)
}

// ─── Điểm cộng (không tính vào tổng chính thức, tối đa 6đ) ──────────────────
export function calcBonusPoints(tasks: Task[]): number {
  let bonus = 0

  // CV đột xuất hoàn thành tốt: +0.5đ/việc, tối đa 1đ
  const dotXuatDone = tasks.filter(
    (t) => t.category === 'dot_xuat' && t.status === 'hoan_thanh' && t.quality !== 'chua_dat',
  )
  bonus += Math.min(dotXuatDone.length * 0.5, 1)

  // Hoàn thành sớm
  const totalAssigned = tasks.length
  if (totalAssigned > 0) {
    const earlyDone = tasks.filter(
      (t) =>
        t.status === 'hoan_thanh' &&
        t.completion_date !== null &&
        t.completion_date < t.deadline,
    )
    const earlyRate = (earlyDone.length / totalAssigned) * 100
    if (earlyRate >= 80) bonus += 1
    else if (earlyRate >= 50) bonus += 0.5
  }

  // Được khen thưởng/biểu dương: +1đ/việc, tối đa 2đ
  const bonusTasks = tasks.filter((t) => t.is_bonus)
  bonus += Math.min(bonusTasks.length, 2)

  // Hoàn thành CV phức tạp/mới hoàn toàn: +1đ/việc, tối đa 2đ
  const complexDone = tasks.filter(
    (t) =>
      (t.complexity === 'phuc_tap' || t.complexity === 'rat_phuc_tap') &&
      t.status === 'hoan_thanh',
  )
  bonus += Math.min(complexDone.length, 2)

  return Math.min(bonus, 6)
}

// ─── Điểm trừ ────────────────────────────────────────────────────────────────
export function calcPenaltyPoints(tasks: Task[]): number {
  let penalty = 0
  const todayStr = new Date().toISOString().split('T')[0]

  for (const task of tasks) {
    // CV chưa hoàn thành ảnh hưởng chung: -2đ/việc
    if (task.status === 'chua_hoan_thanh' && task.deadline < todayStr) {
      penalty += 2
    }
    // CV chậm tiến độ ảnh hưởng chung: -1đ/việc
    else if (
      task.status === 'hoan_thanh' &&
      task.completion_date !== null &&
      task.completion_date > task.deadline
    ) {
      penalty += 1
    }
    // CV không đảm bảo chất lượng, hậu quả nghiêm trọng: -2đ/việc
    if (task.quality === 'chua_dat' && task.status === 'hoan_thanh') {
      penalty += 2
    }
  }

  return penalty
}

// ─── Xếp loại ────────────────────────────────────────────────────────────────
export function getClassification(total: number): Classification {
  if (total >= 90) return 'xuat_sac'
  if (total >= 70) return 'tot'
  if (total >= 50) return 'hoan_thanh'
  return 'khong_hoan_thanh'
}

// ─── Tính điểm toàn bộ ───────────────────────────────────────────────────────
export function calculateScore(tasks: Task[], criteriaA: ScoreCriteriaA | null): ScoreBreakdown {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'hoan_thanh').length

  // Đúng/sớm hạn = hoàn thành và completion_date <= deadline
  const onTimeTasks = tasks.filter(
    (t) =>
      t.status === 'hoan_thanh' &&
      t.completion_date !== null &&
      t.completion_date <= t.deadline,
  ).length

  // Đạt yêu cầu chất lượng = hoàn thành và quality != chua_dat
  const qualityTasks = tasks.filter(
    (t) => t.status === 'hoan_thanh' && t.quality !== 'chua_dat',
  ).length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const onTimeRate = totalTasks > 0 ? (onTimeTasks / totalTasks) * 100 : 0
  const qualityRate = totalTasks > 0 ? (qualityTasks / totalTasks) * 100 : 0

  const scoreQuantity = calcScoreQuantity(completionRate)
  const scoreTimeline = calcScoreTimeline(onTimeRate)
  const scoreQuality = calcScoreQuality(qualityRate)
  const scoreB = scoreQuantity + scoreTimeline + scoreQuality

  const scoreA = criteriaA ? calcScoreA(criteriaA) : 0
  const bonusPoints = calcBonusPoints(tasks)
  const penaltyPoints = calcPenaltyPoints(tasks)

  const totalScore = Math.max(0, scoreA + scoreB - penaltyPoints)
  const classification = getClassification(totalScore)

  return {
    totalTasks,
    completedTasks,
    onTimeTasks,
    qualityTasks,
    completionRate,
    onTimeRate,
    qualityRate,
    scoreQuantity,
    scoreTimeline,
    scoreQuality,
    scoreB,
    scoreA,
    bonusPoints,
    penaltyPoints,
    totalScore,
    classification,
  }
}

// ─── Kiểm tra CV sắp đến hạn (≤3 ngày) ──────────────────────────────────────
export function getUpcomingDeadlines(tasks: Task[], days = 3): Task[] {
  const today = new Date()
  const limit = new Date(today)
  limit.setDate(limit.getDate() + days)
  const todayStr = today.toISOString().split('T')[0]
  const limitStr = limit.toISOString().split('T')[0]

  return tasks.filter(
    (t) =>
      (t.status === 'chua_thuc_hien' || t.status === 'dang_thuc_hien') &&
      t.deadline >= todayStr &&
      t.deadline <= limitStr,
  )
}

// ─── Kiểm tra CV trễ hạn ─────────────────────────────────────────────────────
export function getOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date().toISOString().split('T')[0]
  return tasks.filter(
    (t) =>
      (t.status === 'chua_thuc_hien' || t.status === 'dang_thuc_hien') &&
      t.deadline < today,
  )
}
