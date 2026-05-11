import type { TaskTemplate } from '@/types'

export const TASK_TEMPLATES: TaskTemplate[] = [
  // Kế hoạch - Giảng dạy
  { id: '1', title: 'Soạn giáo án tuần', category: 'ke_hoach', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '2', title: 'Dạy học theo thời khóa biểu', category: 'ke_hoach', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '3', title: 'Chấm bài kiểm tra định kỳ', category: 'ke_hoach', complexity: 'binh_thuong', assigned_by: 'Tổ trưởng chuyên môn' },
  { id: '4', title: 'Nhận xét học bạ học sinh', category: 'ke_hoach', complexity: 'binh_thuong', assigned_by: 'Hiệu phó' },
  { id: '5', title: 'Họp hội đồng sư phạm', category: 'ke_hoach', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  // Chuyên môn
  { id: '6', title: 'Dự giờ đồng nghiệp', category: 'chuyen_mon', complexity: 'binh_thuong', assigned_by: 'Tổ trưởng chuyên môn' },
  { id: '7', title: 'Thao giảng/Dạy chuyên đề', category: 'chuyen_mon', complexity: 'phuc_tap', assigned_by: 'Hiệu phó' },
  { id: '8', title: 'Sinh hoạt tổ chuyên môn', category: 'chuyen_mon', complexity: 'binh_thuong', assigned_by: 'Tổ trưởng chuyên môn' },
  { id: '9', title: 'Tham gia bồi dưỡng chuyên môn', category: 'chuyen_mon', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '10', title: 'Viết sáng kiến kinh nghiệm', category: 'chuyen_mon', complexity: 'rat_phuc_tap', assigned_by: 'Hiệu trưởng' },
  { id: '11', title: 'Ra đề kiểm tra học kỳ', category: 'chuyen_mon', complexity: 'phuc_tap', assigned_by: 'Tổ trưởng chuyên môn' },
  { id: '12', title: 'Hướng dẫn học sinh bồi dưỡng', category: 'chuyen_mon', complexity: 'phuc_tap', assigned_by: 'Hiệu phó' },
  // Kiêm nhiệm - CNTT
  { id: '13', title: 'Cập nhật dữ liệu phần mềm nhà trường', category: 'kiem_nhiem', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '14', title: 'Hỗ trợ kỹ thuật máy tính/thiết bị', category: 'kiem_nhiem', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '15', title: 'Báo cáo thống kê định kỳ (CNTT)', category: 'kiem_nhiem', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  // Kiêm nhiệm - Thanh tra nhân dân
  { id: '16', title: 'Tham dự họp ban Thanh tra nhân dân', category: 'kiem_nhiem', complexity: 'binh_thuong', assigned_by: 'Chủ tịch công đoàn' },
  { id: '17', title: 'Kiểm tra, giám sát hoạt động nhà trường', category: 'kiem_nhiem', complexity: 'phuc_tap', assigned_by: 'Chủ tịch công đoàn' },
  // Đột xuất
  { id: '18', title: 'Trực trường ngày lễ/nghỉ', category: 'dot_xuat', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '19', title: 'Tiếp phụ huynh học sinh', category: 'dot_xuat', complexity: 'binh_thuong', assigned_by: 'Hiệu trưởng' },
  { id: '20', title: 'Tham gia hoạt động ngoại khóa', category: 'dot_xuat', complexity: 'binh_thuong', assigned_by: 'Hiệu phó' },
]
