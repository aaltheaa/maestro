'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { MOCK_ROADMAP } from '@/lib/mock-data'
import type { RoadmapCourse, Roadmap } from '@/lib/types'
import { maestroFetch, getErrorMessage } from '@/lib/maestro-fetch'
import { getUserId } from '@/lib/user-id'

const STATUS_LABEL: Record<string, string> = {
  done: 'Completed',
  active: 'In progress',
  next: 'Up next',
  locked: 'Locked',
}

const STATUS_COLOR: Record<string, string> = {
  done: 'var(--sage)',
  active: 'var(--navy)',
  next: 'var(--amber)',
  locked: '#b0a898',
}

const FILL_COLOR: Record<string, string> = {
  done: 'var(--sage)',
  active: 'var(--navy)',
  next: 'var(--amber)',
  locked: '#e5dfd6',
}

function CourseNode({
  course,
  index,
  total,
  isSelected,
  onSelect,
}: {
  course: RoadmapCourse
  index: number
  total: number
  isSelected: boolean
  onSelect: (c: RoadmapCourse | null) => void
}) {
  const isLast = index === total - 1
  const isLocked = course.status === 'locked'

  return (
    <div className="flex gap-5">
      {/* Left track */}
      <div className="flex flex-col items-center" style={{ width: 28 }}>
        <div
          onClick={() => !isLocked && onSelect(isSelected ? null : course)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium z-10 relative"
          style={{
            background: STATUS_COLOR[course.status],
            color: course.status === 'locked' ? 'var(--stone-muted)' : '#fff',
            border: `2px solid ${STATUS_COLOR[course.status]}`,
            boxShadow: course.status === 'active' ? '0 0 0 4px rgba(27,45,62,0.1)' : 'none',
            cursor: isLocked ? 'default' : 'pointer',
          }}
        >
          {course.status === 'done' ? '✓' : course.status === 'locked' ? '🔒' : index + 1}
        </div>
        {!isLast && (
          <div
            className="flex-1 mt-1"
            style={{
              width: 2,
              minHeight: 24 + course.weeks * 3,
              background:
                course.status === 'done'
                  ? 'var(--sage)'
                  : course.status === 'active'
                  ? 'linear-gradient(var(--navy), var(--stone-border))'
                  : 'var(--stone-border)',
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl p-5 mb-4 relative overflow-hidden transition-all"
        style={{
          background: '#fff',
          border: `1px solid ${isSelected ? 'var(--amber)' : 'var(--stone-border)'}`,
          opacity: isLocked ? 0.55 : 1,
          cursor: isLocked ? 'default' : 'pointer',
          transform: isSelected ? 'translateX(3px)' : '',
        }}
        onClick={() => !isLocked && onSelect(isSelected ? null : course)}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 4, background: STATUS_COLOR[course.status] }}
        />
        <div className="pl-1">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <p
                className="text-xs uppercase tracking-wide mb-1 font-medium"
                style={{ color: STATUS_COLOR[course.status] }}
              >
                {STATUS_LABEL[course.status]}
              </p>
              <h3 className="font-serif text-lg leading-snug" style={{ fontWeight: 400 }}>
                {course.title}
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--stone-muted)' }}>
                {course.dept} · {course.prof}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)', color: '#7a8a94' }}
              >
                {course.weeks} weeks
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)', color: '#7a8a94' }}
              >
                {course.lectures} lectures
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {course.skills.map((s, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-xl"
                style={{
                  background: s === course.highlightSkill ? 'var(--amber-light)' : 'var(--cream)',
                  border: `1px solid ${s === course.highlightSkill ? 'var(--amber-border)' : 'var(--stone-border)'}`,
                  color: s === course.highlightSkill ? '#7a5010' : 'var(--stone-text)',
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Progress + action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-4">
              <div
                className="h-1.5 rounded-full flex-1 max-w-40 overflow-hidden"
                style={{ background: 'var(--stone-border)' }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${course.progress}%`,
                    background: FILL_COLOR[course.status],
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>
                {course.status === 'done'
                  ? 'Complete'
                  : course.status === 'locked'
                  ? 'Locked'
                  : `${course.progress}% done`}
              </span>
            </div>
            {course.status === 'active' && (
              <Link href="/course/graphic-design-history">
                <button
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'var(--navy)', color: '#f0e8d0', border: '1px solid var(--navy)' }}
                  onClick={e => e.stopPropagation()}
                >
                  Continue →
                </button>
              </Link>
            )}
            {course.status === 'next' && (
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber-border)',
                  color: '#92600a',
                }}
              >
                Start course →
              </button>
            )}
            {course.status === 'done' && (
              <button
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: 'var(--sage-light)',
                  border: '1px solid var(--sage-border)',
                  color: 'var(--sage)',
                }}
              >
                Review ↗
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap>(MOCK_ROADMAP)
  const [loadingRoadmap, setLoadingRoadmap] = useState(true)
  const [selected, setSelected] = useState<RoadmapCourse | null>(null)
  const [adjustQuery, setAdjustQuery] = useState('')
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(false)

  // Load saved roadmap from Supabase on mount
  useEffect(() => {
    const load = async () => {
      try {
        const userId = getUserId()
        const res = await fetch(`/api/roadmap?userId=${encodeURIComponent(userId)}`)
        const data = await res.json()
        if (data.roadmap) {
          setRoadmap(data.roadmap)
        }
        // If no saved roadmap, keep the mock as a demo starting point
      } catch {
        // Network error — keep mock data
      } finally {
        setLoadingRoadmap(false)
      }
    }
    load()
  }, [])

  // Persist roadmap whenever courses change
  const persistRoadmap = async (updated: Roadmap) => {
    try {
      const userId = getUserId()
      await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, goal: updated.goal, courses: updated.courses }),
      })
    } catch {
      // Non-fatal
    }
  }

  const totalWeeks = roadmap.courses.reduce((s, c) => s + c.weeks, 0)
  const totalLectures = roadmap.courses.reduce((s, c) => s + c.lectures, 0)
  const overallPct = Math.round(
    roadmap.courses.reduce((s, c) => s + (c.progress * c.weeks), 0) / totalWeeks
  )

  const defaultInsight = `Based on your goal — history of graphic design and fashion — Maestro has sequenced 5 courses from MIT OCW. You're currently 28% through Course 2. Completing it unlocks the Fashion & Identity course, which pairs directly with your design history work.`

  const askMaestro = async () => {
    if (!adjustQuery.trim() || insightLoading) return
    setInsightLoading(true)
    try {
      const res = await maestroFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          systemPrompt: `You are Maestro, an AI learning guide. The user's goal is: "${roadmap.goal}". Their roadmap has these courses in order: ${roadmap.courses.map(c => c.title).join(', ')}. They are currently in course 2 at 28%. Respond in 2 short paragraphs — warm, direct, and specific. No bullet lists.`,
          messages: [{ role: 'user', content: adjustQuery }],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInsight(getErrorMessage(data.code))
      } else {
        setInsight(data.text ?? '')
        // Persist current roadmap state after any adjustment
        await persistRoadmap(roadmap)
      }
    } catch (err) {
      const msg = err instanceof Error && err.message === 'rate_limit_client'
        ? 'You\'re sending requests too quickly — please wait a moment.'
        : 'Having trouble connecting — please try again.'
      setInsight(msg)
    }
    setInsightLoading(false)
    setAdjustQuery('')
  }

  return (
    <div>
      <Nav backLabel="My learning" backHref="/" />
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--amber)' }}>
            Learning roadmap
          </p>
          <h1 className="font-serif text-3xl mb-2" style={{ fontWeight: 400 }}>
            Your path through graphic design &amp; fashion
          </h1>
          <p className="text-sm max-w-xl" style={{ color: '#7a8a94', lineHeight: 1.6 }}>
            Maestro has sequenced these MIT OCW courses based on your goal. Each course unlocks
            the next. You can adjust anytime.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-3.5 rounded-full px-3.5 py-1.5"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{ background: 'var(--navy)', color: '#f0e8d0' }}
            >
              ✦
            </div>
            <span className="text-xs" style={{ color: 'var(--stone-text)' }}>
              Goal: {roadmap.goal}
            </span>
            <span className="text-xs cursor-pointer" style={{ color: 'var(--amber)' }}>
              Edit
            </span>
          </div>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {[
            { n: roadmap.courses.length, l: 'Courses' },
            { n: totalWeeks, l: 'Total weeks' },
            { n: totalLectures, l: 'Lectures' },
            { n: `~${Math.round(totalWeeks * 2.5)}h`, l: 'Est. reading' },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5 text-center"
              style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
            >
              <div className="font-serif text-2xl" style={{ fontWeight: 400 }}>
                {s.n}
              </div>
              <div
                className="text-xs mt-0.5 uppercase tracking-wide"
                style={{ color: 'var(--stone-muted)' }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div
          className="flex items-center gap-4 rounded-xl px-4 py-3.5 mb-5"
          style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
        >
          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--stone-muted)' }}>
            Overall progress
          </span>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--stone-border)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${overallPct}%`,
                background: 'linear-gradient(90deg, var(--sage), var(--amber))',
              }}
            />
          </div>
          <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--navy)' }}>
            {overallPct}%
          </span>
        </div>

        {/* Maestro insight */}
        <div
          className="flex gap-3 rounded-xl p-4 mb-5"
          style={{
            background: '#fff',
            border: '1px solid var(--stone-border)',
            borderLeft: '3px solid var(--amber)',
          }}
        >
          <span
            className="text-xs px-2 py-0.5 rounded-md h-fit shrink-0 mt-0.5"
            style={{ background: 'var(--navy)', color: '#f0e8d0', letterSpacing: '0.5px' }}
          >
            Maestro
          </span>
          <p className="text-sm leading-relaxed" style={{ color: '#2c3340' }}>
            {insight || defaultInsight}
            {insightLoading && (
              <span style={{ color: 'var(--stone-muted)', fontStyle: 'italic' }}> thinking…</span>
            )}
          </p>
        </div>

        {/* Adjust input */}
        <div className="flex gap-2 mb-7">
          <input
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{
              border: '1px solid var(--stone-border)',
              background: '#fff',
              color: 'var(--navy)',
              fontFamily: 'DM Sans, sans-serif',
            }}
            placeholder='Ask Maestro to adjust — e.g. "I only have 6 weeks, what should I focus on?"'
            value={adjustQuery}
            onChange={e => setAdjustQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') askMaestro() }}
          />
          <button
            onClick={askMaestro}
            className="px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
            style={{ background: 'var(--navy)', color: '#f0e8d0', border: 'none' }}
          >
            Ask Maestro →
          </button>
        </div>

        {/* Why panel (selected course) */}
        {selected && (
          <div
            className="rounded-xl p-5 mb-5 relative"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div className="flex items-start justify-between mb-2.5">
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: 'var(--amber)' }}
                >
                  Why this course
                </p>
                <h3 className="font-serif text-base" style={{ fontWeight: 400 }}>
                  {selected.title}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-lg cursor-pointer"
                style={{ color: 'var(--stone-muted)', background: 'none', border: 'none' }}
              >
                ×
              </button>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#2c3340' }}>
              {selected.why}
            </p>
          </div>
        )}

        {/* Track */}
        <div>
          {roadmap.courses.map((course, i) => (
            <CourseNode
              key={course.id}
              course={course}
              index={i}
              total={roadmap.courses.length}
              isSelected={selected?.id === course.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
