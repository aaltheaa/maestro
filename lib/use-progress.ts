'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { getUserId } from '@/lib/user-id'

interface UseProgressReturn {
  completed: Set<string>
  toggle: (itemId: string, itemType: 'lecture' | 'reading' | 'assignment', currentValue: boolean) => void
  isLoading: boolean
}

/**
 * useProgress
 *
 * Loads the user's completed item IDs for a given course from Supabase,
 * and writes back on every toggle with optimistic UI updates.
 *
 * Usage:
 *   const { completed, toggle, isLoading } = useProgress(courseSlug)
 *   const watched = completed.has(lecture.id)
 *   <div onClick={() => toggle(lecture.id, 'lecture', watched)} />
 */
export function useProgress(courseSlug: string): UseProgressReturn {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const pendingWrites = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        const userId = getUserId()
        const res = await fetch(
          `/api/progress?userId=${encodeURIComponent(userId)}&courseSlug=${encodeURIComponent(courseSlug)}`
        )
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setCompleted(new Set(data.completed ?? []))
      } catch (err) {
        console.warn('[useProgress] Failed to load, falling back to empty:', err)
        setCompleted(new Set())
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [courseSlug])

  const toggle = useCallback(
    (
      itemId: string,
      itemType: 'lecture' | 'reading' | 'assignment',
      currentValue: boolean
    ) => {
      const newValue = !currentValue

      // Optimistic update
      setCompleted(prev => {
        const next = new Set(prev)
        if (newValue) {
          next.add(itemId)
        } else {
          next.delete(itemId)
        }
        return next
      })

      // Debounce write — cancel any pending write for this item
      const existing = pendingWrites.current.get(itemId)
      if (existing) clearTimeout(existing)

      const timeout = setTimeout(async () => {
        try {
          const userId = getUserId()
          await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              courseSlug,
              itemId,
              itemType,
              completed: newValue,
            }),
          })
        } catch (err) {
          console.error('[useProgress] Write failed:', err)
          // Revert on failure
          setCompleted(prev => {
            const next = new Set(prev)
            if (currentValue) {
              next.add(itemId)
            } else {
              next.delete(itemId)
            }
            return next
          })
        }
        pendingWrites.current.delete(itemId)
      }, 400)

      pendingWrites.current.set(itemId, timeout)
    },
    [courseSlug]
  )

  return { completed, toggle, isLoading }
}
