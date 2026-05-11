import type { Task, ScoreBreakdown, UserProfile } from '@/types'
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  QUALITY_LABELS,
  CLASSIFICATION_LABELS,
} from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// ─── Xuất Mẫu 01TKNV (Phụ lục III – QĐ 32/2026) ─────────────────────────────
export function exportMau01TKNV(
  profile: UserProfile,
  tasks: Task[],
  score: ScoreBreakdown,
  month: number,
  year: number,
): void {
  const today = format(new Date(), 'dd/MM/yyyy', { locale: vi })
  const esc = (s: string | null | undefined) =>
    (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const fmtDate = (d: string | null | undefined) =>
    d ? d.split('-').reverse().join('/') : ''
  const X = (c: boolean) => c ? '<b>X</b>' : ''

  const getTiming = (t: Task) => {
    if (t.status !== 'hoan_thanh' || !t.completion_date)
      return { som: false, dung: false, tre: 0 }
    if (t.completion_date < t.deadline) return { som: true, dung: false, tre: 0 }
    if (t.completion_date === t.deadline) return { som: false, dung: true, tre: 0 }
    return {
      som: false, dung: false,
      tre: Math.round((new Date(t.completion_date).getTime() - new Date(t.deadline).getTime()) / 86400000),
    }
  }

  const groups = [
    {
      roman: 'I',
      label: 'Các nhiệm vụ theo chương trình, kế hoạch đã đề ra (từ nhiệm vụ được phân công theo kế hoạch công tác tháng/năm của cơ quan, tổ chức, đơn vị)',
      tasks: tasks.filter((t) => t.category === 'ke_hoach'),
    },
    {
      roman: 'II',
      label: 'Các nhiệm vụ chuyên môn, thường xuyên theo vị trí việc làm',
      tasks: tasks.filter((t) => t.category === 'chuyen_mon'),
    },
    {
      roman: 'III',
      label: 'Các nhiệm vụ đột xuất, phát sinh được giao theo sự phân công của lãnh đạo đơn vị',
      tasks: tasks.filter((t) => t.category === 'dot_xuat'),
    },
    {
      roman: 'IV',
      label: 'Các nhiệm vụ khác: Hội họp, tham gia tập huấn, đào tạo, bồi dưỡng, tham gia hoạt động khác theo phân công của cấp có thẩm quyền...',
      tasks: tasks.filter((t) => t.category === 'kiem_nhiem'),
    },
  ]

  const renderRows = (grp: typeof groups[0]) => {
    const header = `<tr class="grp">
      <td class="c b">${grp.roman}</td>
      <td colspan="17" class="b">${esc(grp.label)}</td>
    </tr>`

    const todayStr = new Date().toISOString().split('T')[0]
    const dataRows = grp.tasks.length > 0
      ? grp.tasks.map((t, i) => {
          const tm = getTiming(t)
          const done = t.status === 'hoan_thanh'
          const part = t.participation ?? 'chu_tri'
          const doneNote = done
            ? (t.confirmed_by ? `Đã hoàn thành (XN: ${esc(t.confirmed_by)})` : 'Đã hoàn thành')
            : ''
          // Cột 9 chỉ điền khi thực sự chưa hoàn thành (không phải chưa đến hạn)
          const isFailed = t.status === 'chua_hoan_thanh'
          const isOverdue = !done && t.deadline < todayStr
          const notDoneNote = isFailed
            ? esc(t.late_reason || t.note || 'Không hoàn thành')
            : isOverdue
            ? esc(t.late_reason || 'Chưa hoàn thành đúng hạn')
            : ''
          return `<tr>
            <td class="c">${i + 1}</td>
            <td>${esc(t.title)}</td>
            <td class="c">${X(t.complexity === 'binh_thuong')}</td>
            <td class="c">${X(t.complexity === 'phuc_tap')}</td>
            <td class="c">${X(t.complexity === 'rat_phuc_tap')}</td>
            <td class="c">${X(part === 'chu_tri')}</td>
            <td class="c">${X(part === 'phoi_hop')}</td>
            <td>${doneNote}</td>
            <td>${notDoneNote}</td>
            <td class="c">${fmtDate(t.deadline)}</td>
            <td class="c">${X(tm.som)}</td>
            <td class="c">${X(tm.dung)}</td>
            <td class="c">${tm.tre > 0 ? `${tm.tre} ngày` : ''}</td>
            <td class="c">${X(done && t.quality === 'chua_dat')}</td>
            <td class="c">${X(done && t.quality === 'dat')}</td>
            <td class="c">${X(done && (t.quality === 'vuot_muc' || t.is_bonus))}</td>
            <td class="sm">${esc(t.proposal || '')}</td>
            <td class="sm">${done && tm.tre > 0 ? esc(t.late_reason || '') : ''}</td>
          </tr>`
        }).join('')
      : `<tr>
          <td class="c">1</td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td class="c">2</td><td></td><td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>`

    return header + dataRows
  }

  // Tổng hợp cho bảng thống kê cuối
  const cDone = tasks.filter((t) => t.status === 'hoan_thanh')
  const earlyN = cDone.filter((t) => t.completion_date && t.completion_date < t.deadline).length
  const exactN = cDone.filter((t) => t.completion_date && t.completion_date === t.deadline).length
  const lateN  = cDone.filter((t) => t.completion_date && t.completion_date > t.deadline).length
  const qGood  = cDone.filter((t) => t.quality === 'dat').length
  const qOver  = cDone.filter((t) => t.quality === 'vuot_muc' || t.is_bonus).length
  const qBad   = cDone.filter((t) => t.quality === 'chua_dat').length
  const total  = tasks.length
  const onTimeRate = total > 0 ? (((earlyN + exactN) / total) * 100).toFixed(1) : '0.0'
  const qualRate   = total > 0 ? (((qGood + qOver) / total) * 100).toFixed(1) : '0.0'

  const roles = Array.isArray(profile.additional_roles)
    ? profile.additional_roles.join(', ')
    : (profile.additional_roles || '')

  const html = `<!DOCTYPE html>
<html lang="vi"><head>
<meta charset="UTF-8">
<title>Mẫu 01TKNV – Tháng ${month}/${year}</title>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet">
<style>
@page { size: A4 landscape; margin: 7mm 8mm; }
*{ box-sizing:border-box; margin:0; padding:0; }
body{ font-family:'Be Vietnam Pro',sans-serif; font-size:7.5px; color:#000; }
.hdr{ display:flex; justify-content:space-between; margin-bottom:3px; }
.hdr-l{ font-size:7.5px; line-height:1.5; }
.hdr-r{ text-align:center; font-size:7.5px; line-height:1.5; }
h1{ font-size:9px; text-align:center; text-transform:uppercase; font-weight:700; margin:4px 0 1px; }
.sub{ text-align:center; font-size:8.5px; font-weight:700; margin-bottom:1px; }
.sub2{ text-align:center; font-size:7px; font-style:italic; margin-bottom:4px; }
.info{ font-size:7.5px; margin-bottom:3px; }
table{ width:100%; border-collapse:collapse; table-layout:fixed; }
th,td{ border:1px solid #000; padding:1.5px 2px; vertical-align:middle; word-wrap:break-word; font-size:7px; }
th{ background:#ddd; font-weight:700; text-align:center; font-size:6.5px; line-height:1.3; }
td{ line-height:1.3; }
.c{ text-align:center; }
.b{ font-weight:700; }
.sm{ font-size:6.5px; }
.grp td{ background:#f0f0f0; font-weight:700; font-size:7.5px; }
.sum-hdr{ font-size:7px; margin:4px 0 2px; font-weight:700; }
.sign{ display:flex; justify-content:space-around; margin-top:6px; }
.sign-col{ text-align:center; width:28%; font-size:7.5px; }
</style>
</head><body>
<div style="text-align:center;font-size:6.5px;margin-bottom:3px;">Phụ lục III – CÁC BIỂU MẪU ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG THEO HIỆU QUẢ CÔNG VIỆC ĐỐI VỚI CÁN BỘ, CÔNG CHỨC, VIÊN CHỨC (Ban hành kèm theo QĐ số /QĐ-UBND ngày /2026 của UBND thành phố) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mẫu 01TKNV</b></div>
<div class="hdr">
  <div class="hdr-l">
    <div class="b">CƠ QUAN CHỦ QUẢN</div>
    <div>ĐƠN VỊ: <b>${esc(profile.school) || '..............................'}</b></div>
    <div style="font-size:6.5px;">────────────────</div>
  </div>
  <div class="hdr-r">
    <div class="b">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
    <div>Độc lập – Tự do – Hạnh phúc</div>
    <div style="font-size:6.5px;">────────────────────────</div>
  </div>
</div>
<h1>Bảng thống kê, tự đánh giá kết quả thực hiện nhiệm vụ của cá nhân cán bộ/công chức/viên chức</h1>
<div class="sub">THÁNG ${month}/NĂM ${year}</div>
<div class="sub2">(Kèm theo Phiếu đánh giá, xếp loại chất lượng hàng tháng của cá nhân)</div>
<div class="info">
  Họ và tên: <b>${esc(profile.name) || '........................................'}</b>
  &nbsp;&nbsp; Chức vụ: <b>${esc(profile.position) || 'Giáo viên'}</b>
  &nbsp;&nbsp; Đơn vị: <b>${esc(profile.school) || '..............................'}</b>
  ${roles ? `&nbsp;&nbsp; Kiêm nhiệm: <b>${esc(roles)}</b>` : ''}
</div>

<table>
<colgroup>
  <col style="width:2.2%">
  <col style="width:16%">
  <col style="width:3.2%"><col style="width:3.2%"><col style="width:3.8%">
  <col style="width:3.8%"><col style="width:4%">
  <col style="width:10.5%"><col style="width:8%">
  <col style="width:4.8%">
  <col style="width:2.8%"><col style="width:2.8%"><col style="width:4.2%">
  <col style="width:6%"><col style="width:5.5%"><col style="width:6%">
  <col style="width:8%"><col style="width:7.2%">
</colgroup>
<thead>
<tr>
  <th rowspan="3">TT</th>
  <th rowspan="3">Nội dung công việc/ sản phẩm được giao trong kỳ đánh giá</th>
  <th colspan="3">Tính chất công việc<br><i style="font-weight:normal">(Đánh dấu X)</i></th>
  <th colspan="2">Mức độ tham gia<br><i style="font-weight:normal">(Đánh dấu X)</i></th>
  <th colspan="2">Sản phẩm, công việc đã thực hiện trong kỳ đánh giá</th>
  <th colspan="4">Thời gian thực hiện</th>
  <th colspan="3">Chất lượng sản phẩm, công việc đã hoàn thành</th>
  <th rowspan="3">Kiến nghị, đề xuất (nếu có)</th>
  <th rowspan="3">Giải trình (nếu có)</th>
</tr>
<tr>
  <th rowspan="2">Bình thường</th>
  <th rowspan="2">Phức tạp</th>
  <th rowspan="2">Rất phức tạp</th>
  <th rowspan="2">Chủ trì thực hiện</th>
  <th rowspan="2">Phối hợp thực hiện</th>
  <th rowspan="2">Đã hoàn thành<br><i style="font-weight:normal">(Ghi rõ thông tin văn bản, nội dung CV đã giải quyết)</i></th>
  <th rowspan="2">Chưa hoàn thành<br><i style="font-weight:normal">(Ghi rõ lý do)</i></th>
  <th rowspan="2">Thời gian yêu cầu của nhiệm vụ đặt ra<br><i style="font-weight:normal">(ghi rõ thời gian phải hoàn thành)</i></th>
  <th colspan="3">Thời gian hoàn thành<br><i style="font-weight:normal">(Ghi rõ thời gian hoàn thành tương ứng)</i></th>
  <th rowspan="2">HT nhưng chưa đảm bảo CL theo yêu cầu</th>
  <th rowspan="2">HT đảm bảo CL theo yêu cầu</th>
  <th rowspan="2">HT đảm bảo CL vượt mức theo yêu cầu (được biểu dương, khen thưởng)</th>
</tr>
<tr>
  <th>Sớm hạn</th>
  <th>Đúng hạn</th>
  <th>Trễ hạn<br><i style="font-weight:normal">(Ghi rõ số ngày/giờ trễ)</i></th>
</tr>
</thead>
<tbody>
${groups.map((g) => renderRows(g)).join('')}
</tbody>
</table>

<div class="sum-hdr">TỔNG SỐ SẢN PHẨM/CÔNG VIỆC: Cán bộ, công chức, viên chức căn cứ nội dung đã thống kê, đánh giá ở trên để điền thông tin vào bảng dưới đây làm cơ sở tính điểm các tiêu chí tương ứng</div>
<table>
<colgroup>
  <col style="width:5%"><col style="width:5.5%"><col style="width:6%"><col style="width:8%">
  <col style="width:5%"><col style="width:5%"><col style="width:5%"><col style="width:9%">
  <col style="width:5.5%"><col style="width:7%"><col style="width:6.5%"><col style="width:9%">
  <col style="width:10%">
</colgroup>
<thead>
<tr>
  <th colspan="4">Tổng số lượng sản phẩm, công việc<br><i style="font-weight:normal">(Ghi tổng số lượng tương ứng)</i></th>
  <th colspan="4">Tiến độ sản phẩm, công việc<br><i style="font-weight:normal">(Ghi tổng số lượng tương ứng)</i></th>
  <th colspan="4">Chất lượng sản phẩm, công việc<br><i style="font-weight:normal">(Ghi tổng số lượng tương ứng)</i></th>
  <th rowspan="2">Ghi chú</th>
</tr>
<tr>
  <th>Được giao<br>(1)</th>
  <th>Hoàn thành<br>(2)</th>
  <th>Chưa HT<br>(3)</th>
  <th>Tỷ lệ %<br>(4)=(2)/(1)×100</th>
  <th>Sớm hạn<br>(5)</th>
  <th>Đúng hạn<br>(6)</th>
  <th>Trễ hạn<br>(7)</th>
  <th>Tỷ lệ %<br>(8)=(5+6)/(1)×100</th>
  <th>Đảm bảo<br>(9)</th>
  <th>Vượt mức (được biểu dương, KT)<br>(10)</th>
  <th>Chưa đảm bảo<br>(11)</th>
  <th>Tỷ lệ %<br>(12)=(9+10)/(1)×100</th>
</tr>
</thead>
<tbody>
<tr>
  <td class="c">${total}</td>
  <td class="c">${score.completedTasks}</td>
  <td class="c">${total - score.completedTasks}</td>
  <td class="c">${score.completionRate.toFixed(1)}%</td>
  <td class="c">${earlyN}</td>
  <td class="c">${exactN}</td>
  <td class="c">${lateN}</td>
  <td class="c">${onTimeRate}%</td>
  <td class="c">${qGood}</td>
  <td class="c">${qOver}</td>
  <td class="c">${qBad}</td>
  <td class="c">${qualRate}%</td>
  <td></td>
</tr>
</tbody>
</table>

<div style="text-align:right;font-size:7.5px;font-style:italic;margin-top:3px;">Đà Nẵng, ngày ${today}</div>
<div class="sign">
  <div class="sign-col">
    <div class="b">TRƯỞNG PHÒNG/BAN/ĐƠN VỊ</div>
    <div style="font-style:italic;">(Ký, ghi rõ họ tên)</div>
    <div style="height:28px;"></div>
  </div>
  <div class="sign-col">
    <div class="b">CẤP PHÓ PHỤ TRÁCH</div>
    <div style="font-style:italic;">(Ký, ghi rõ họ tên)</div>
    <div style="height:28px;"></div>
  </div>
  <div class="sign-col">
    <div class="b">CÁ NHÂN TỰ ĐÁNH GIÁ</div>
    <div style="font-style:italic;">(Ký, ghi rõ họ tên)</div>
    <div style="height:28px;"></div>
    <div class="b">${esc(profile.name) || ''}</div>
  </div>
</div>
<script>window.onload=()=>window.print()</script>
</body></html>`

  const w = window.open('', '_blank', 'width=1100,height=700')
  if (w) { w.document.write(html); w.document.close() }
}

// ─── Xuất CSV ────────────────────────────────────────────────────────────────
export function exportTasksToCSV(tasks: Task[], month: number, year: number): void {
  const headers = [
    'STT', 'Ngày', 'Tên công việc', 'Loại', 'Người giao',
    'Hạn hoàn thành', 'Trạng thái', 'Ngày hoàn thành',
    'Chất lượng', 'Người xác nhận', 'Khen thưởng', 'Ghi chú',
  ]

  const rows = tasks.map((t, i) => [
    i + 1,
    t.date,
    `"${t.title.replace(/"/g, '""')}"`,
    CATEGORY_LABELS[t.category],
    `"${t.assigned_by}"`,
    t.deadline,
    STATUS_LABELS[t.status],
    t.completion_date ?? '',
    QUALITY_LABELS[t.quality],
    t.confirmed_by ?? '',
    t.is_bonus ? 'Có' : 'Không',
    `"${(t.note ?? '').replace(/"/g, '""')}"`,
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cong-viec-thang-${month}-${year}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// ─── Xuất PDF – dùng print window để hỗ trợ tiếng Việt chuẩn ────────────────
export function exportSummaryToPDF(
  profile: UserProfile,
  _tasks: Task[],
  score: ScoreBreakdown,
  month: number,
  year: number,
): void {
  const today = format(new Date(), 'dd/MM/yyyy', { locale: vi })
  const classLabel = CLASSIFICATION_LABELS[score.classification]

  const classColor =
    score.classification === 'xuat_sac' ? '#b45309' :
    score.classification === 'tot' ? '#15803d' :
    score.classification === 'hoan_thanh' ? '#1d4ed8' : '#dc2626'

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Phiếu tự đánh giá tháng ${month}/${year}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Be Vietnam Pro', 'Segoe UI', sans-serif; font-size: 13px; color: #111; padding: 24px 32px; max-width: 800px; margin: auto; }
    h1 { font-size: 15px; text-align: center; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 13px; color: #555; margin-bottom: 20px; }
    .section { margin-bottom: 16px; }
    .section-title { font-weight: 700; font-size: 13px; background: #f3f4f6; padding: 5px 10px; border-left: 3px solid #2563eb; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 6px 10px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    .score-box { text-align: center; padding: 16px; border: 2px solid ${classColor}; border-radius: 8px; margin: 16px 0; }
    .score-total { font-size: 36px; font-weight: 700; color: ${classColor}; }
    .score-label { font-size: 16px; font-weight: 600; color: ${classColor}; margin-top: 4px; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 32px; }
    .sign-col { text-align: center; flex: 1; }
    .sign-title { font-weight: 600; margin-bottom: 4px; }
    .sign-sub { font-size: 11px; color: #666; }
    .sign-name { margin-top: 60px; font-weight: 600; }
    .date-line { text-align: right; font-style: italic; font-size: 12px; color: #555; margin-top: 4px; }
    @media print {
      body { padding: 12px 20px; }
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>
  <h1>Phiếu tự đánh giá kết quả công tác hằng tháng</h1>
  <p class="subtitle">Tháng ${month} năm ${year} – Theo QĐ 32/2026/QĐ-UBND TP Đà Nẵng (Mẫu 03)</p>

  <div class="section">
    <div class="section-title">I. THÔNG TIN CÁ NHÂN</div>
    <table>
      <tr><th style="width:35%">Họ và tên</th><td>${profile.name || '...'}</td></tr>
      <tr><th>Chức vụ</th><td>${profile.position || 'Giáo viên'}</td></tr>
      <tr><th>Tổ/Nhóm</th><td>${profile.unit || '...'}</td></tr>
      <tr><th>Trường/Đơn vị</th><td>${profile.school || '...'}</td></tr>
      <tr><th>Kiêm nhiệm</th><td>${(profile.additional_roles || []).join(', ') || '...'}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">II. ĐIỂM TIÊU CHÍ CHUNG – PHẦN A (tối đa 30 điểm)</div>
    <table>
      <tr><th>Phần A</th><th style="width:120px;text-align:center">Điểm đạt được</th><th style="width:100px;text-align:center">Tối đa</th></tr>
      <tr><td>Tổng điểm tiêu chí A</td><td style="text-align:center;font-weight:700">${score.scoreA.toFixed(1)}</td><td style="text-align:center">30</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">III. KẾT QUẢ THỰC HIỆN NHIỆM VỤ – PHẦN B (tối đa 70 điểm)</div>
    <table>
      <tr>
        <th>Tiêu chí</th>
        <th style="text-align:center">Số lượng</th>
        <th style="text-align:center">Tỷ lệ</th>
        <th style="text-align:center;width:80px">Điểm đạt</th>
        <th style="text-align:center;width:70px">Tối đa</th>
      </tr>
      <tr>
        <td>Tổng số công việc được giao</td>
        <td style="text-align:center">${score.totalTasks}</td>
        <td style="text-align:center">–</td>
        <td style="text-align:center">–</td>
        <td style="text-align:center">–</td>
      </tr>
      <tr>
        <td>1. Tỷ lệ số lượng hoàn thành</td>
        <td style="text-align:center">${score.completedTasks}</td>
        <td style="text-align:center">${score.completionRate.toFixed(1)}%</td>
        <td style="text-align:center;font-weight:700">${score.scoreQuantity}</td>
        <td style="text-align:center">20</td>
      </tr>
      <tr>
        <td>2. Tỷ lệ tiến độ (đúng/sớm hạn)</td>
        <td style="text-align:center">${score.onTimeTasks}</td>
        <td style="text-align:center">${score.onTimeRate.toFixed(1)}%</td>
        <td style="text-align:center;font-weight:700">${score.scoreTimeline}</td>
        <td style="text-align:center">20</td>
      </tr>
      <tr>
        <td>3. Tỷ lệ chất lượng (đạt yêu cầu)</td>
        <td style="text-align:center">${score.qualityTasks}</td>
        <td style="text-align:center">${score.qualityRate.toFixed(1)}%</td>
        <td style="text-align:center;font-weight:700">${score.scoreQuality}</td>
        <td style="text-align:center">30</td>
      </tr>
      <tr style="background:#f9fafb">
        <td colspan="3"><strong>Tổng điểm Phần B</strong></td>
        <td style="text-align:center;font-weight:700">${score.scoreB.toFixed(1)}</td>
        <td style="text-align:center">70</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">IV. ĐIỂM CỘNG / ĐIỂM TRỪ</div>
    <table>
      <tr><th style="width:60%">Mục</th><th style="text-align:center">Điểm</th></tr>
      <tr><td>Điểm cộng (tối đa 6đ – ghi nhận, không tính vào tổng)</td><td style="text-align:center;color:#15803d;font-weight:600">+${score.bonusPoints.toFixed(1)}</td></tr>
      <tr><td>Điểm trừ</td><td style="text-align:center;color:#dc2626;font-weight:600">-${score.penaltyPoints.toFixed(1)}</td></tr>
    </table>
  </div>

  <div class="score-box">
    <div class="score-total">${score.totalScore.toFixed(1)} / 100</div>
    <div class="score-label">${classLabel}</div>
    <div style="font-size:11px;color:#666;margin-top:8px">Tổng = Điểm A (${score.scoreA.toFixed(1)}) + Điểm B (${score.scoreB.toFixed(1)}) − Điểm trừ (${score.penaltyPoints.toFixed(1)})</div>
  </div>

  <p class="date-line">Đà Nẵng, ngày ${today}</p>
  <div class="sign-row">
    <div class="sign-col">
      <div class="sign-title">Người tự đánh giá</div>
      <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
      <div class="sign-name">${profile.name || ''}</div>
    </div>
    <div class="sign-col">
      <div class="sign-title">Lãnh đạo xác nhận</div>
      <div class="sign-sub">(Ký, đóng dấu)</div>
      <div class="sign-name">&nbsp;</div>
    </div>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}
