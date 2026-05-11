import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MonthlySummary } from '@/types'

export function useMonthSummary(userId: string | undefined) {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSummaries = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data } = await supabase
      .from('monthly_summary')
      .select('*')
      .eq('user_id', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
    setSummaries(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchSummaries() }, [fetchSummaries])

  const upsertSummary = async (summary: Omit<MonthlySummary, 'id' | 'created_at'>) => {
    const existing = summaries.find(
      (s) => s.month === summary.month && s.year === summary.year,
    )
    if (existing) {
      const { data, error } = await supabase
        .from('monthly_summary')
        .update(summary)
        .eq('id', existing.id)
        .select()
        .single()
      if (!error) setSummaries((prev) => prev.map((s) => (s.id === existing.id ? data : s)))
      return { error }
    } else {
      const { data, error } = await supabase
        .from('monthly_summary')
        .insert(summary)
        .select()
        .single()
      if (!error) setSummaries((prev) => [data, ...prev])
      return { error }
    }
  }

  return { summaries, loading, upsertSummary, refetch: fetchSummaries }
}
