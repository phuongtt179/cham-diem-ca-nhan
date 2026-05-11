import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, fmt = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt, { locale: vi })
}

export function formatMonth(month: number, year: number): string {
  return `Tháng ${month}/${year}`
}

export function isOverdue(deadline: string, status: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (
    (status === 'chua_thuc_hien' || status === 'dang_thuc_hien') &&
    isBefore(parseISO(deadline), today)
  )
}

export function isUpcoming(deadline: string, status: string, days = 3): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const limit = addDays(today, days)
  const d = parseISO(deadline)
  return (
    (status === 'chua_thuc_hien' || status === 'dang_thuc_hien') &&
    !isBefore(d, today) &&
    !isAfter(d, limit)
  )
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function getTaskStatusColor(deadline: string, status: string): string {
  if (status === 'hoan_thanh') return 'text-green-600 dark:text-green-400'
  if (status === 'dang_thuc_hien') {
    if (isOverdue(deadline, status)) return 'text-red-600 dark:text-red-400'
    if (isUpcoming(deadline, status)) return 'text-orange-500 dark:text-orange-400'
    return 'text-blue-600 dark:text-blue-400'
  }
  if (status === 'chua_thuc_hien') {
    if (isOverdue(deadline, status)) return 'text-red-600 dark:text-red-400'
    if (isUpcoming(deadline, status)) return 'text-orange-500 dark:text-orange-400'
    return 'text-gray-500 dark:text-gray-400'
  }
  if (status === 'chua_hoan_thanh') return 'text-red-600 dark:text-red-400'
  return 'text-gray-500'
}
