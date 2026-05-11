import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'
import { getCurrentMonthYear } from '@/lib/utils'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import type { Task } from '@/types'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'

export function Tasks() {
  const { user } = useAuth()
  const now = getCurrentMonthYear()
  const [month, setMonth] = useState(now.month)
  const [year, setYear] = useState(now.year)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(user?.id, month, year)

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleAddTask = async (data: Omit<Task, 'id' | 'user_id' | 'month' | 'year' | 'created_at'>) => {
    if (!user) return
    await addTask({ ...data, user_id: user.id, month, year })
  }

  const handleUpdateTask = async (data: Omit<Task, 'id' | 'user_id' | 'month' | 'year' | 'created_at'>) => {
    if (!editingTask) return
    await updateTask(editingTask.id, data)
    setEditingTask(undefined)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteTask(id)
  }

  const years = Array.from({ length: 5 }, (_, i) => now.year - 2 + i)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Công việc</h1>
        <Button
          onClick={() => { setEditingTask(undefined); setFormOpen(true) }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" /> Thêm công việc
        </Button>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2 w-fit">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border-0 h-8 w-24 text-center font-medium focus-visible:ring-0"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>Tháng {m}</option>
          ))}
        </Select>
        <Select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border-0 h-8 w-20 text-center font-medium focus-visible:ring-0"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </Select>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Task stats mini */}
      <div className="flex gap-3 text-sm flex-wrap">
        {[
          { label: 'Tổng', value: tasks.length, color: 'text-foreground' },
          { label: 'Hoàn thành', value: tasks.filter(t => t.status === 'hoan_thanh').length, color: 'text-green-500' },
          { label: 'Đang thực hiện', value: tasks.filter(t => t.status === 'dang_thuc_hien').length, color: 'text-blue-500' },
          { label: 'Chưa thực hiện', value: tasks.filter(t => t.status === 'chua_thuc_hien').length, color: 'text-gray-500' },
          { label: 'Chưa hoàn thành', value: tasks.filter(t => t.status === 'chua_hoan_thanh').length, color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border rounded-lg px-3 py-1.5">
            <span className="text-muted-foreground">{label}: </span>
            <span className={`font-semibold ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Đang tải...</div>
      ) : (
        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Form dialog */}
      <TaskForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingTask(undefined)
        }}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
      />
    </div>
  )
}
