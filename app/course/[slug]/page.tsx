'use client'

import { useState, useRef, useEffect } from 'react'
import Nav from '@/components/Nav'
import { MOCK_COURSES } from '@/lib/mock-data'
import { buildTutorSystemPrompt } from '@/lib/anthropic'
import type { Course, Week, ChatMessage } from '@/lib/types'
import { maestroFetch } from '@/lib/maestro-fetch'
import { useProgress } from '@/lib/use-progress'

// ─── Progress circle ──────────────────────────────────────────────────────────

function ProgressCircle({ pct }: { pct: number }) {
  const r = 14
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={36} height={36} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={18} cy={18} r={r} fill="none" stroke="var(--stone-border)" strokeWidth={3} />
      <circle
        cx={18} cy={18} r={r} fill="none" stroke="var(--amber)"
        strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  )
}

// ─── Lectures tab ─────────────────────────────────────────────────────────────

function LecturesTab({
  week,
  completed,
  onToggle,
}: {
  week: Week
  completed: Set<string>
  onToggle: (id: string, type: 'lecture', current: boolean) => void
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--stone-muted)' }}>
        This week&apos;s lectures
      </p>
      {week.lectures.map((l) => {
        const watched = completed.has(l.id)
        return (
          <div
            key={l.id}
            className="flex items-center gap-3.5 rounded-xl p-3.5 mb-2.5 transition-all cursor-pointer"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div
              className="w-13 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: watched ? 'var(--sage)' : 'var(--navy)', width: 52, height: 36 }}
            >
              <div
                style={{
                  width: 0, height: 0,
                  borderStyle: 'solid',
                  borderWidth: '6px 0 6px 11px',
                  borderColor: 'transparent transparent transparent #f0e8d0',
                  marginLeft: 2,
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug" style={{ color: 'var(--navy)' }}>
                {l.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>{l.duration}</span>
                {l.hasTranscript ? (
                  <span
                    className="text-xs px-2 py-0.5 rounded-xl"
                    style={{ background: 'var(--sage-light)', border: '1px solid var(--sage-border)', color: 'var(--sage)' }}
                  >
                    Transcript available
                  </span>
                ) : (
                  <span
                    className="text-xs px-2 py-0.5 rounded-xl"
                    style={{ background: 'var(--amber-light)', border: '1px solid var(--amber-border)', color: '#92600a' }}
                  >
                    No transcript
                  </span>
                )}
              </div>
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer"
              style={{
                border: `2px solid ${watched ? 'var(--sage)' : 'var(--stone-border)'}`,
                background: watched ? 'var(--sage)' : 'transparent',
              }}
              onClick={() => onToggle(l.id, 'lecture', watched)}
            >
              {watched && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Readings tab ─────────────────────────────────────────────────────────────

function ReadingsTab({
  week,
  completed,
  onToggle,
}: {
  week: Week
  completed: Set<string>
  onToggle: (id: string, type: 'reading', current: boolean) => void
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--stone-muted)' }}>
        Assigned readings
      </p>
      {week.readings.map((r) => {
        const done = completed.has(r.id)
        return (
          <div
            key={r.id}
            className="flex items-center gap-3 rounded-xl p-3 mb-2 cursor-pointer transition-all"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
            onClick={() => onToggle(r.id, 'reading', done)}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
              style={{ background: r.type === 'Textbook' ? '#e8eef5' : 'var(--amber-light)' }}
            >
              {r.type === 'Textbook' ? '📚' : '📄'}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium leading-snug"
                style={{
                  color: 'var(--navy)',
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.5 : 1,
                }}
              >
                {r.title}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--stone-muted)' }}>
                {r.type}
              </p>
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{
                border: `2px solid ${done ? 'var(--sage)' : 'var(--stone-border)'}`,
                background: done ? 'var(--sage)' : 'transparent',
              }}
            >
              {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Assignments tab ──────────────────────────────────────────────────────────

function AssignmentsTab({
  week,
  completed,
  onToggle,
}: {
  week: Week
  completed: Set<string>
  onToggle: (id: string, type: 'assignment', current: boolean) => void
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--stone-muted)' }}>
        Assignments
      </p>
      {week.assignments.length === 0 && (
        <p className="text-sm text-center py-8" style={{ color: 'var(--stone-muted)' }}>
          No assignments this week.
        </p>
      )}
      {week.assignments.map((a) => {
        const done = completed.has(a.id)
        return (
          <div
            key={a.id}
            className="flex items-start gap-3 rounded-xl p-3.5 mb-2.5 cursor-pointer transition-all"
            style={{
              background: done ? '#f8fdf9' : '#fff',
              border: '1px solid var(--stone-border)',
            }}
            onClick={() => onToggle(a.id, 'assignment', done)}
          >
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
              style={{
                border: `2px solid ${done ? 'var(--sage)' : 'var(--stone-border)'}`,
                background: done ? 'var(--sage)' : 'transparent',
                minWidth: 22,
              }}
            >
              {done && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
            </div>
            <div>
              <p
                className="text-sm font-medium"
                style={{
                  color: 'var(--navy)',
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.5 : 1,
                }}
              >
                {a.title}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--amber)' }}>
                {a.due}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ week }: { week: Week }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-3" style={{ color: 'var(--stone-muted)' }}>
        Week summary
      </p>
      <div
        className="rounded-xl p-5 mb-3"
        style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
      >
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--stone-muted)' }}>
          About this week
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#2c3340' }}>
          {week.summary}
        </p>
      </div>
      <div
        className="rounded-xl p-5"
        style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
      >
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--stone-muted)' }}>
          Learning objectives
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#2c3340' }}>
          By the end of Week {week.week}, you should be able to identify key movements, explain
          contextual factors that shaped them, and apply relevant visual vocabulary to your own
          analysis.
        </p>
      </div>
    </div>
  )
}

// ─── Maestro chat ─────────────────────────────────────────────────────────────

function MaestroChat({ course }: { course: Course }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Maestro. Ask me anything about this course — lectures, concepts, assignments. I'll always tell you if I'm going beyond the course materials.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input.trim() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await maestroFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          systemPrompt: buildTutorSystemPrompt(course),
          messages: [...messages, userMsg],
        }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.text ?? 'Sorry, I had trouble responding.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Connection issue — please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-4 py-3.5"
        style={{ background: 'var(--navy)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="font-serif text-sm" style={{ color: '#f0e8d0' }}>Ask Maestro</p>
        <p className="text-xs mt-0.5" style={{ color: '#7a9ab0' }}>Grounded in course materials</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5">
        {messages.map((m, i) => (
          <div
            key={i}
            className="max-w-xs rounded-xl px-3 py-2.5 text-xs leading-relaxed"
            style={{
              background: m.role === 'user' ? 'var(--navy)' : 'var(--cream)',
              color: m.role === 'user' ? '#f0e8d0' : 'var(--navy)',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              borderBottomRightRadius: m.role === 'user' ? 4 : 12,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 12,
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div
            className="max-w-xs rounded-xl px-3 py-2.5 text-xs self-start"
            style={{ background: 'var(--cream)', color: 'var(--stone-muted)', fontStyle: 'italic', borderBottomLeftRadius: 4 }}
          >
            Maestro is thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div
        className="p-3"
        style={{ borderTop: '1px solid var(--stone-border)', background: '#faf8f5' }}
      >
        <div className="flex gap-2">
          <textarea
            className="flex-1 rounded-xl px-3 py-2 text-xs resize-none outline-none"
            style={{
              border: '1px solid var(--stone-border)',
              background: '#fff',
              color: 'var(--navy)',
              minHeight: 36,
              maxHeight: 90,
              fontFamily: 'DM Sans, sans-serif',
            }}
            placeholder="Ask about lectures, concepts, readings…"
            value={input}
            rows={1}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
          />
          <button
            onClick={send}
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{ background: 'var(--navy)', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ color: '#f0e8d0', fontSize: 14 }}>↑</span>
          </button>
        </div>
        <p className="text-center mt-1.5 text-xs" style={{ color: 'var(--stone-muted)' }}>
          Uses course content · cites outside sources
        </p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CourseDashboardPage({ params }: { params: { slug: string } }) {
  const course = MOCK_COURSES.find(c => c.slug === params.slug) ?? MOCK_COURSES[0]
  const { completed, toggle, isLoading } = useProgress(course.slug)

  const [activeWeek, setActiveWeek] = useState(0)
  const [tab, setTab] = useState<'lectures' | 'readings' | 'assignments' | 'overview'>('lectures')

  const wk = course.weeks[activeWeek]

  // Count done items for progress display
  const totalItems = course.weeks.reduce(
    (s, w) => s + w.lectures.length + w.readings.length + w.assignments.length, 0
  )
  const doneItems = completed.size
  const overallPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  const weekTotal = wk.lectures.length + wk.readings.length + wk.assignments.length
  const weekDone = [
    ...wk.lectures.map(l => l.id),
    ...wk.readings.map(r => r.id),
    ...wk.assignments.map(a => a.id),
  ].filter(id => completed.has(id)).length

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className="flex flex-col overflow-hidden shrink-0"
        style={{ width: 230, background: 'var(--navy)', color: '#e8dfc8' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-serif text-xl" style={{ color: '#f0e8d0', letterSpacing: '-0.3px' }}>
            Maestro
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#5a7a90', letterSpacing: '1.5px' }}>
            MIT OCW
          </p>
        </div>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--amber)', letterSpacing: 1, textTransform: 'uppercase' }}>
            {course.dept}
          </p>
          <p className="font-serif text-sm leading-snug" style={{ color: '#f0e8d0' }}>
            {course.title}
          </p>
        </div>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#7a9ab0' }}>
            <span>Overall progress</span>
            <span>{overallPct}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${overallPct}%`, background: 'var(--amber)' }}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {course.weeks.map((w, i) => {
            const allIds = [
              ...w.lectures.map(l => l.id),
              ...w.readings.map(r => r.id),
              ...w.assignments.map(a => a.id),
            ]
            const total = allIds.length
            const done = allIds.filter(id => completed.has(id)).length
            return (
              <div
                key={i}
                className="px-5 py-2.5 cursor-pointer transition-all"
                style={{
                  borderLeft: `3px solid ${activeWeek === i ? 'var(--amber)' : 'transparent'}`,
                  background: activeWeek === i ? 'rgba(201,138,26,0.12)' : 'transparent',
                }}
                onClick={() => setActiveWeek(i)}
              >
                <p className="text-xs mb-0.5" style={{ color: '#7a9ab0', letterSpacing: '0.5px' }}>
                  WEEK {w.week}
                </p>
                <p className="text-xs leading-snug" style={{ color: activeWeek === i ? '#f0e8d0' : '#d8cfb8' }}>
                  {w.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: total }, (_, j) => (
                    <div
                      key={j}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: j < done ? 'var(--sage)' : 'rgba(255,255,255,0.2)' }}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="px-6 pt-4" style={{ background: 'var(--cream)' }}>
          <p className="text-xs mb-2.5" style={{ color: 'var(--stone-muted)' }}>
            {course.title} → Week {wk.week}
          </p>
          <div className="flex items-start justify-between mb-3.5">
            <div>
              <h1 className="font-serif text-xl" style={{ fontWeight: 500 }}>
                {wk.title}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: '#7a8a94' }}>
                MIT OpenCourseWare · {course.dept}
              </p>
              <div className="flex gap-3 mt-2">
                {[
                  { color: 'var(--amber)', label: `${wk.lectures.length} Lectures` },
                  { color: 'var(--sage)', label: `${wk.readings.length} Readings` },
                  { color: 'var(--navy)', label: `${wk.assignments.length} Assignments` },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                    style={{ background: '#fff', border: '1px solid var(--stone-border)', color: '#5c6475' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ProgressCircle pct={Math.round((weekDone / weekTotal) * 100)} />
              <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>
                {weekDone}/{weekTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex px-6"
          style={{ background: 'var(--cream)', borderBottom: '1px solid var(--stone-border)' }}
        >
          {(['lectures', 'readings', 'assignments', 'overview'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-2.5 px-4 text-sm transition-all cursor-pointer"
              style={{
                color: tab === t ? 'var(--navy)' : 'var(--stone-muted)',
                borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
                fontWeight: tab === t ? 500 : 400,
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid var(--amber)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'lectures' && (
            <LecturesTab week={wk} completed={completed} onToggle={toggle} />
          )}
          {tab === 'readings' && (
            <ReadingsTab week={wk} completed={completed} onToggle={toggle} />
          )}
          {tab === 'assignments' && (
            <AssignmentsTab week={wk} completed={completed} onToggle={toggle} />
          )}
          {tab === 'overview' && <OverviewTab week={wk} />}
        </div>
      </div>

      {/* Maestro chat */}
      <div
        className="flex flex-col overflow-hidden shrink-0"
        style={{ width: 300, background: '#fff', borderLeft: '1px solid var(--stone-border)' }}
      >
        <MaestroChat course={{ ...course, weeks }} />
      </div>
    </div>
  )
}
