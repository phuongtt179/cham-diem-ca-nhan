import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ScoreCriteriaA } from '@/types'

export function useScore(userId: string | undefined, month: number, year: number) {
  const [criteriaA, setCriteriaA] = useState<ScoreCriteriaA | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCriteriaA = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('score_criteria_a')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year)
      .maybeSingle()
    setCriteriaA(data)
    setLoading(false)
  }, [userId, month, year])

  useEffect(() => { fetchCriteriaA() }, [fetchCriteriaA])

  const saveCriteriaA = async (data: Omit<ScoreCriteriaA, 'id' | 'created_at'>) => {
    if (criteriaA) {
      const { data: updated, error } = await supabase
        .from('score_criteria_a')
        .update(data)
        .eq('id', criteriaA.id)
        .select()
        .single()
      if (!error) setCriteriaA(updated)
      return { error }
    } else {
      const { data: inserted, error } = await supabase
        .from('score_criteria_a')
        .insert(data)
        .select()
        .single()
      if (!error) setCriteriaA(inserted)
      return { error }
    }
  }

  return { criteriaA, loading, saveCriteriaA, refetch: fetchCriteriaA }
}
