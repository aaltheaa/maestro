'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import type { ParsedOCWCourse } from '@/lib/types'
import { maestroFetch, getErrorMessage } from '@/lib/maestro-fetch'
import { getUserId } from '@/lib/user-id'

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEP_LABELS = ['Add course', 'Preview', 'Start learning']

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
              style={{
                background: i < step ? 'var(--sage)' : i === step ? 'var(--navy)' : '#e5dfd6',
                color: i < step ? '#fff' : i === step ? '#f0e8d0' : 'var(--stone-muted)',
                boxShadow: i === step ? '0 0 0 4px rgba(27,45,62,0.12)' : 'none',
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className="text-xs"
              style={{ color: i === step ? 'var(--navy)' : 'var(--stone-muted)', fontWeight: i === step ? 500 : 400 }}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className="w-9 h-px mx-1.5"
              style={{ background: i < step ? 'var(--sage)' : 'var(--stone-border)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Example courses ──────────────────────────────────────────────────────────

const EXAMPLE_COURSES = [
  {
    title: 'History of Graphic Design',
    dept: 'Architecture',
    url: 'https://ocw.mit.edu/courses/4-340-transforming-the-city/',
  },
  {
    title: 'Introduction to Fashion Theory',
    dept: 'Comparative Media Studies',
    url: 'https://ocw.mit.edu/courses/cms-800j-fashion-culture-spring-2009/',
  },
  {
    title: 'Visual Culture & Communication',
    dept: 'Art, Culture & Technology',
    url: 'https://ocw.mit.edu/courses/4-341-introduction-to-photography/',
  },
]

// ─── Parse steps animation ────────────────────────────────────────────────────

const PARSE_STEPS = [
  'Fetching OCW course page',
  'Reading syllabus structure',
  'Gathering lecture videos',
  'Collecting readings & PDFs',
  'Checking transcript availability',
  'Building your course dashboard',
]

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AddCoursePage() {
  const router = useRouter()
  const [stage, setStage] = useState<'input' | 'parsing' | 'preview' | 'done'>('input')
  const [stepNum, setStepNum] = useState(0)
  const [url, setUrl] = useState('')
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(false)
  const [parseStep, setParseStep] = useState(0)
  const [parsed, setParsed] = useState<ParsedOCWCourse | null>(null)

  const isOCW = url.includes('ocw.mit.edu')

  // Fetch a Maestro insight blurb when a chip is selected
  const fetchInsight = async (title: string) => {
    setInsightLoading(true)
    try {
      const res = await maestroFetch('/api/discover', {
        method: 'POST',
        body: JSON.stringify({ query: title, mode: 'preview' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInsight(getErrorMessage(data.code))
      } else {
        setInsight(data.text ?? '')
      }
    } catch (err) {
      const msg = err instanceof Error && err.message === 'rate_limit_client'
        ? 'You\'re sending requests too quickly — please wait a moment.'
        : ''
      setInsight(msg)
    }
    setInsightLoading(false)
  }

  // Kick off parsing animation then call the API
  const startParsing = async () => {
    if (!url.trim()) return
    setStage('parsing')
    setParseStep(0)

    // Animate steps
    let step = 0
    const interval = setInterval(() => {
      step++
      setParseStep(step)
      if (step >= PARSE_STEPS.length - 1) clearInterval(interval)
    }, 600)

    try {
      const res = await maestroFetch('/api/parse-course', {
        method: 'POST',
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      // Wait for animation to finish
      setTimeout(() => {
        clearInterval(interval)
        setParseStep(PARSE_STEPS.length)
        setParsed(data.course)
        setStage('preview')
        setStepNum(1)
      }, PARSE_STEPS.length * 600 + 200)
    } catch {
      clearInterval(interval)
      setStage('input')
    }
  }

  const confirmCourse = async () => {
    if (!parsed) return
    try {
      const userId = getUserId()
      // Build a URL-safe slug from the title
      const slug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          slug,
          title: parsed.title,
          dept: parsed.dept,
          prof: parsed.prof,
          ocwUrl: parsed.ocwUrl,
          totalWeeks: parsed.totalWeeks,
        }),
      })
    } catch (err) {
      console.error('[add-course] Failed to persist course:', err)
      // Non-fatal — still proceed to done screen
    }
    setStage('done')
    setStepNum(2)
  }

  return (
    <div>
      <Nav backLabel="Homepage" backHref="/" />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <StepIndicator step={stepNum} />

        {/* ── Step 1: Input ── */}
        {stage === 'input' && (
          <div
            className="rounded-2xl p-8"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <h1 className="font-serif text-2xl mb-1.5" style={{ fontWeight: 400 }}>
              Add an OCW course
            </h1>
            <p className="text-sm mb-6" style={{ color: '#7a8a94', lineHeight: 1.6 }}>
              Paste any MIT OpenCourseWare course URL and Maestro will structure it into a
              full learning dashboard.
            </p>

            <div className="relative mb-3">
              <input
                type="text"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  border: `1.5px solid ${isOCW ? 'var(--sage)' : 'var(--stone-border)'}`,
                  background: 'var(--cream)',
                  color: 'var(--navy)',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                placeholder="https://ocw.mit.edu/courses/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm">
                {isOCW ? '✓' : '🔗'}
              </span>
            </div>

            <p className="text-xs mb-5" style={{ color: 'var(--stone-muted)' }}>
              Find courses at{' '}
              <a
                href="https://ocw.mit.edu"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--amber)' }}
              >
                ocw.mit.edu
              </a>{' '}
              — copy any course URL and paste it above.
            </p>

            <p
              className="text-xs uppercase tracking-wide mb-3"
              style={{ color: 'var(--stone-muted)' }}
            >
              Or pick one to try
            </p>
            <div className="flex flex-col gap-2 mb-6">
              {EXAMPLE_COURSES.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-all"
                  style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)' }}
                  onClick={() => {
                    setUrl(c.url)
                    setInsight('')
                    fetchInsight(c.title)
                  }}
                >
                  <span
                    className="text-xs px-2 py-0.5 rounded-md mt-0.5 shrink-0"
                    style={{ background: 'var(--navy)', color: '#f0e8d0', letterSpacing: '0.5px' }}
                  >
                    {c.dept.split(' ')[0].toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
                      {c.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--stone-muted)' }}>
                      {c.url}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Insight blurb */}
            {(insight || insightLoading) && (
              <div
                className="rounded-xl p-4 mb-5 text-sm leading-relaxed"
                style={{
                  background: 'var(--cream)',
                  borderLeft: '3px solid var(--amber)',
                  color: '#2c3340',
                }}
              >
                <p
                  className="text-xs uppercase tracking-wide mb-1.5"
                  style={{ color: 'var(--amber)' }}
                >
                  Maestro says
                </p>
                {insightLoading ? (
                  <span style={{ color: 'var(--stone-muted)', fontStyle: 'italic' }}>
                    Reading this course…
                  </span>
                ) : (
                  insight
                )}
              </div>
            )}

            <button
              onClick={startParsing}
              disabled={!url.trim()}
              className="w-full py-3 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: url.trim() ? 'var(--navy)' : '#e5dfd6',
                color: url.trim() ? '#f0e8d0' : 'var(--stone-muted)',
                cursor: url.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Parse this course →
            </button>
          </div>
        )}

        {/* ── Step 2a: Parsing animation ── */}
        {stage === 'parsing' && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div
              className="w-11 h-11 rounded-full mx-auto mb-5"
              style={{
                border: '3px solid var(--stone-border)',
                borderTopColor: 'var(--amber)',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 className="font-serif text-lg mb-2">Reading your course…</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--stone-muted)' }}>
              Maestro is structuring everything into your dashboard.
            </p>
            <div className="flex flex-col gap-2 max-w-xs mx-auto text-left">
              {PARSE_STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <div
                    className="w-2 h-2 rounded-full shrink-0 transition-all"
                    style={{
                      background:
                        i < parseStep
                          ? 'var(--sage)'
                          : i === parseStep
                          ? 'var(--amber)'
                          : '#e5dfd6',
                    }}
                  />
                  <span
                    style={{
                      color:
                        i < parseStep
                          ? 'var(--sage)'
                          : i === parseStep
                          ? 'var(--navy)'
                          : 'var(--stone-muted)',
                      fontWeight: i === parseStep ? 500 : 400,
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2b: Preview ── */}
        {stage === 'preview' && parsed && (
          <div
            className="rounded-2xl p-8"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <h1 className="font-serif text-2xl mb-1.5" style={{ fontWeight: 400 }}>
              Here&apos;s what Maestro found
            </h1>
            <p className="text-sm mb-6" style={{ color: '#7a8a94' }}>
              Review the course structure before adding it to your library.
            </p>

            {/* Course header */}
            <div
              className="flex items-start gap-4 pb-5 mb-5"
              style={{ borderBottom: '1px solid #f0ece6' }}
            >
              <div
                className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                style={{ background: 'var(--navy)' }}
              >
                <span className="font-serif text-2xl" style={{ color: 'rgba(240,232,208,0.2)' }}>
                  GD
                </span>
              </div>
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: 'var(--amber)' }}
                >
                  {parsed.dept}
                </p>
                <h2 className="font-serif text-xl leading-snug" style={{ fontWeight: 400 }}>
                  {parsed.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--stone-muted)' }}>
                  {parsed.prof} · {parsed.totalWeeks} weeks
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {[
                { n: parsed.totalWeeks, l: 'Weeks' },
                { n: parsed.totalLectures, l: 'Lectures' },
                { n: parsed.totalReadings, l: 'Readings' },
                { n: parsed.totalAssignments, l: 'Assignments' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 text-center"
                  style={{ background: 'var(--cream)' }}
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

            {/* Transcript warning */}
            {parsed.transcriptsMissing > 0 && (
              <div
                className="flex gap-2.5 rounded-xl p-3.5 mb-5 text-sm leading-relaxed"
                style={{
                  background: 'var(--amber-light)',
                  border: '1px solid var(--amber-border)',
                }}
              >
                <span className="text-sm shrink-0 mt-0.5">⚠</span>
                <span style={{ color: '#7a5010' }}>
                  <strong>
                    {parsed.transcriptsMissing} of {parsed.totalLectures} lectures
                  </strong>{' '}
                  don&apos;t have transcripts available on OCW. These will be labeled in your
                  dashboard so you always know what to expect.
                </span>
              </div>
            )}

            {/* Week outline */}
            <div className="mb-6">
              <div
                className="flex items-center justify-between mb-2.5 text-xs uppercase tracking-wide"
                style={{ color: 'var(--stone-muted)' }}
              >
                <span>Week outline</span>
                <span style={{ color: 'var(--amber)', textTransform: 'none', letterSpacing: 0 }}>
                  All {parsed.totalWeeks} weeks →
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {parsed.weekOutline.slice(0, 6).map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-sm rounded-lg px-3 py-2"
                    style={{ background: 'var(--cream)' }}
                  >
                    <span
                      className="text-xs shrink-0"
                      style={{ color: 'var(--stone-muted)', minWidth: 44 }}
                    >
                      Week {w.week}
                    </span>
                    <span className="flex-1" style={{ color: 'var(--navy)' }}>
                      {w.title}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: 'var(--stone-muted)' }}>
                      {w.lectures}L · {w.readings}R
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => { setStage('input'); setStepNum(0) }}
                className="px-5 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--stone-border)',
                  color: 'var(--navy)',
                }}
              >
                ← Back
              </button>
              <button
                onClick={confirmCourse}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'var(--navy)', color: '#f0e8d0' }}
              >
                Add to my courses →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {stage === 'done' && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-xl"
              style={{ background: 'var(--sage)', color: '#fff' }}
            >
              ✓
            </div>
            <h2 className="font-serif text-2xl mb-2" style={{ fontWeight: 400 }}>
              Course added to Maestro
            </h2>
            <p
              className="text-sm leading-relaxed mb-7 max-w-sm mx-auto"
              style={{ color: '#7a8a94' }}
            >
              {parsed?.title ?? 'Your course'} is ready. Your dashboard is set up, your weeks are
              laid out, and Maestro is here whenever you have a question.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  const slug = parsed?.title
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '') ?? ''
                  router.push(slug ? `/course/${slug}` : '/signup')
                }}
                className="w-full py-3 rounded-xl text-sm font-medium"
                style={{ background: 'var(--navy)', color: '#f0e8d0' }}
              >
                Open course dashboard →
              </button>
              <button
                onClick={() => { setStage('input'); setStepNum(0); setUrl(''); setInsight('') }}
                className="w-full py-3 rounded-xl text-sm"
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--stone-border)',
                  color: 'var(--navy)',
                }}
              >
                Add another course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
