'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '@/lib/user-id'

export interface EnrolledCourse {
  id: string
  slug: string
  title: string
  dept: string
  prof: string
  ocw_url: string
  total_weeks: number
  added_at: string
}

export function useEnrolledCourses() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const userId = getUserId()
        const res = await fetch(`/api/courses?userId=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error('Failed to load courses')
        const data = await res.json()
        setCourses(data.courses ?? [])
      } catch (err) {
        console.warn('[useEnrolledCourses] Failed to load:', err)
        setCourses([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const enroll = async (course: Omit<EnrolledCourse, 'id' | 'added_at'>) => {
    try {
      const userId = getUserId()
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          slug: course.slug,
          title: course.title,
          dept: course.dept,
          prof: course.prof,
          ocwUrl: course.ocw_url,
          totalWeeks: course.total_weeks,
        }),
      })
      // Reload list
      const res = await fetch(`/api/courses?userId=${encodeURIComponent(userId)}`)
      const data = await res.json()
      setCourses(data.courses ?? [])
    } catch (err) {
      console.error('[useEnrolledCourses] Enroll failed:', err)
    }
  }

  return { courses, isLoading, enroll }
}
