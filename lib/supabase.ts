import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton client — safe to import anywhere (client or server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types matching the DB schema ──────────────────────────────

export interface DBEnrolledCourse {
  id: string
  user_id: string
  slug: string
  title: string
  dept: string
  prof: string
  ocw_url: string
  total_weeks: number
  added_at: string
}

export interface DBItemProgress {
  id: string
  user_id: string
  course_slug: string
  item_id: string
  item_type: 'lecture' | 'reading' | 'assignment'
  completed: boolean
  updated_at: string
}

export interface DBRoadmap {
  id: string
  user_id: string
  goal: string
  courses: unknown[]
  created_at: string
  updated_at: string
}
