import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Task } from '@/types'

export function useTasks(userId: string | undefined, month: number, year: number) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .order('date', { ascending: false })

    if (error) setError(error.message)
    else setTasks(data ?? [])
    setLoading(false)
  }, [userId, month, year])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('tasks').insert(task).select().single()
    if (error) return { error }
    setTasks((prev) => [data, ...prev])
    return { data }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks').update(updates).eq('id', id).select().single()
    if (error) return { error }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
    return { data }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) return { error }
    setTasks((prev) => prev.filter((t) => t.id !== id))
    return {}
  }

  return { tasks, loading, error, addTask, updateTask, deleteTask, refetch: fetchTasks }
}
