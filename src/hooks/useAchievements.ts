import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Achievement } from '@/types'

export function useAchievements(userId: string | undefined, month?: number, year?: number) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    let q = supabase.from('achievements').select('*').eq('user_id', userId).order('date', { ascending: false })
    if (year) q = q.eq('year', year)
    if (month) q = q.eq('month', month)
    const { data } = await q
    setAchievements(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [userId, month, year])

  const addAchievement = async (data: Omit<Achievement, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('achievements').insert(data)
    if (!error) fetch()
    return { error }
  }

  const updateAchievement = async (id: string, data: Partial<Achievement>) => {
    const { error } = await supabase.from('achievements').update(data).eq('id', id)
    if (!error) fetch()
    return { error }
  }

  const deleteAchievement = async (id: string) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id)
    if (!error) fetch()
    return { error }
  }

  return { achievements, loading, addAchievement, updateAchievement, deleteAchievement }
}
