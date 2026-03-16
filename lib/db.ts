/**
 * Maestro data layer
 *
 * All reads and writes to Supabase go through here.
 * Every function takes a userId so the call site doesn't
 * need to know where the ID comes from.
 */

import { supabase } from './supabase'
import type { RoadmapCourse } from './types'

// ── Enrolled courses ──────────────────────────────────────────

export async function getEnrolledCourses(userId: string) {
  const { data, error } = await supabase
    .from('enrolled_courses')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function enrollCourse(
  userId: string,
  course: {
    slug: string
    title: string
    dept: string
    prof: string
    ocwUrl: string
    totalWeeks: number
  }
) {
  const { error } = await supabase
    .from('enrolled_courses')
    .upsert(
      {
        user_id: userId,
        slug: course.slug,
        title: course.title,
        dept: course.dept,
        prof: course.prof,
        ocw_url: course.ocwUrl,
        total_weeks: course.totalWeeks,
      },
      { onConflict: 'user_id,slug' }
    )

  if (error) throw error
}

export async function unenrollCourse(userId: string, slug: string) {
  const { error } = await supabase
    .from('enrolled_courses')
    .delete()
    .eq('user_id', userId)
    .eq('slug', slug)

  if (error) throw error
}

// ── Item progress ─────────────────────────────────────────────

export async function getCourseProgress(userId: string, courseSlug: string) {
  const { data, error } = await supabase
    .from('item_progress')
    .select('item_id, item_type, completed')
    .eq('user_id', userId)
    .eq('course_slug', courseSlug)

  if (error) throw error

  // Return as a Set of completed item IDs for O(1) lookups
  const completed = new Set<string>()
  for (const row of data ?? []) {
    if (row.completed) completed.add(row.item_id)
  }
  return completed
}

export async function setItemProgress(
  userId: string,
  courseSlug: string,
  itemId: string,
  itemType: 'lecture' | 'reading' | 'assignment',
  completed: boolean
) {
  const { error } = await supabase
    .from('item_progress')
    .upsert(
      {
        user_id: userId,
        course_slug: courseSlug,
        item_id: itemId,
        item_type: itemType,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,course_slug,item_id' }
    )

  if (error) throw error
}

// ── Roadmap ───────────────────────────────────────────────────

export async function getRoadmap(userId: string) {
  const { data, error } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  return data ?? null
}

export async function saveRoadmap(
  userId: string,
  goal: string,
  courses: RoadmapCourse[]
) {
  const { error } = await supabase
    .from('roadmaps')
    .upsert(
      {
        user_id: userId,
        goal,
        courses,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) throw error
}
