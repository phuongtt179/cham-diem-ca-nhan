import { createClient } from '@supabase/supabase-js'
import type { Task, ScoreCriteriaA, MonthlySummary } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at'>
        Update: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>
      }
      score_criteria_a: {
        Row: ScoreCriteriaA
        Insert: Omit<ScoreCriteriaA, 'id' | 'created_at'>
        Update: Partial<Omit<ScoreCriteriaA, 'id' | 'user_id' | 'created_at'>>
      }
      monthly_summary: {
        Row: MonthlySummary
        Insert: Omit<MonthlySummary, 'id' | 'created_at'>
        Update: Partial<Omit<MonthlySummary, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
