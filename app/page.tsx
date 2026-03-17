'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import DemoShowcase from '@/components/DemoShowcase'
import { BROWSE_COURSES } from '@/lib/mock-data'
import { maestroFetch } from '@/lib/maestro-fetch'
import { useEnrolledCourses } from '@/lib/use-enrolled-courses'

const EXAMPLES = [
  'I want to learn the history of fashion and graphic design',
  'What courses teach visual storytelling?',
  "I'm a beginner — where do I start with design?",
]

interface RecommendedCourse {
  name: string
  dept: string
  weeks: string
  url?: string
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [recCourses, setRecCourses] = useState<RecommendedCourse[]>([])
  const [loading, setLoading] = useState(false)
  const { courses: enrolledCourses, isLoading: coursesLoading } = useEnrolledCourses()

  const askMaestro = async (overrideQuery?: string) => {
    const text = overrideQuery ?? query
    if (!text.trim() || loading) return
    setLoading(true)
    setResponse('')
    setRecCourses([])
    try {
      const res = await maestroFetch('/api/discover', {
        method: 'POST',
        body: JSON.stringify({ query: text }),
      })
      const data = await res.json()
      setResponse(data.text ?? '')
      setRecCourses(data.courses ?? [])
    } catch {
      setResponse('Having trouble connecting — please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      <Nav />

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
        <p
          className="text-xs uppercase tracking-widest mb-3 font-medium"
          style={{ color: 'var(--amber)' }}
        >
          Your MIT learning companion
        </p>
        <h1
          className="font-serif text-4xl mb-3 leading-tight"
          style={{ color: 'var(--navy)', fontWeight: 400 }}
        >
          What do you want to{' '}
          <em style={{ color: 'var(--amber)' }}>learn</em> today?
        </h1>
        <p className="text-sm max-w-md mx-auto mb-8" style={{ color: '#6a7a84', lineHeight: 1.7 }}>
          Tell Maestro what you&apos;re curious about. It&apos;ll find the right MIT
          OpenCourseWare courses and build you a personalised learning path.
        </p>

        {/* Ask box */}
        <div
          className="rounded-2xl p-5 text-left transition-all max-w-2xl mx-auto"
          style={{
            background: '#fff',
            border: '1.5px solid var(--stone-border)',
            boxShadow: '0 2px 12px rgba(27,45,62,0.06)',
          }}
        >
          <p
            className="text-xs uppercase tracking-wide mb-2.5"
            style={{ color: 'var(--stone-muted)' }}
          >
            Ask Maestro
          </p>
          <textarea
            className="w-full border-none outline-none text-base resize-none bg-transparent font-serif"
            style={{ color: 'var(--navy)', minHeight: 52, lineHeight: 1.5 }}
            placeholder="I want to understand the history of graphic design and how it connects to fashion…"
            value={query}
            rows={2}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                askMaestro()
              }
            }}
          />
          <div
            className="flex items-center justify-between mt-3.5 pt-3"
            style={{ borderTop: '1px solid #f0ece6' }}
          >
            <div className="flex gap-1.5 flex-wrap">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(ex); askMaestro(ex) }}
                  className="text-xs px-3 py-1 rounded-full transition-all cursor-pointer"
                  style={{
                    background: 'var(--cream)',
                    border: '1px solid var(--stone-border)',
                    color: 'var(--stone-text)',
                  }}
                >
                  ↗ {ex}
                </button>
              ))}
            </div>
            <button
              onClick={() => askMaestro()}
              disabled={loading}
              className="text-sm px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ml-3"
              style={{ background: 'var(--navy)', color: '#f0e8d0' }}
            >
              {loading ? 'Thinking…' : 'Ask Maestro →'}
            </button>
          </div>
        </div>

        {/* Response */}
        {(response || loading) && (
          <div
            className="max-w-2xl mx-auto mt-4 rounded-xl p-4 text-left"
            style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-xs px-2.5 py-0.5 rounded-md"
                style={{ background: 'var(--navy)', color: '#f0e8d0', letterSpacing: '0.5px' }}
              >
                Maestro
              </span>
              {loading && (
                <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>
                  thinking…
                </span>
              )}
            </div>
            {response && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#2c3340' }}>
                {response}
              </p>
            )}
            {recCourses.length > 0 && (
              <div className="flex flex-col gap-2">
                {recCourses.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all"
                    style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)' }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
                        {c.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--stone-muted)' }}>
                        {c.dept} · {c.weeks}
                      </div>
                    </div>
                    <Link href="/add-course">
                      <span
                        className="text-xs font-medium whitespace-nowrap"
                        style={{ color: 'var(--amber)' }}
                      >
                        Add to plan →
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* My Courses */}
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl" style={{ fontWeight: 500 }}>Continue learning</h2>
          <span className="text-sm cursor-pointer" style={{ color: 'var(--amber)' }}>
            View all
          </span>
        </div>

        {coursesLoading && (
          <div className="text-sm py-8 text-center" style={{ color: 'var(--stone-muted)' }}>
            Loading your courses…
          </div>
        )}

        {!coursesLoading && enrolledCourses.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#fff', border: '1px dashed var(--stone-border)' }}
          >
            <p className="text-sm mb-3" style={{ color: 'var(--stone-muted)' }}>
              No courses yet — ask Maestro above or browse OCW below.
            </p>
            <Link href="/add-course">
              <button
                className="text-sm px-5 py-2 rounded-xl font-medium"
                style={{ background: 'var(--navy)', color: '#f0e8d0' }}
              >
                + Add your first course
              </button>
            </Link>
          </div>
        )}

        {!coursesLoading && enrolledCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {enrolledCourses.map((course) => (
              <Link key={course.id} href={`/course/${course.slug}`}>
                <div
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
                >
                  <div
                    className="h-20 flex items-center justify-center relative"
                    style={{ background: 'var(--navy)' }}
                  >
                    <span
                      className="font-serif text-3xl absolute"
                      style={{ color: 'rgba(240,232,208,0.15)' }}
                    >
                      {course.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span
                      className="absolute top-2.5 left-3 text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                    >
                      {course.dept.split(' ')[0]}
                    </span>
                    <span
                      className="absolute top-2.5 right-3 text-xs px-2 py-0.5 rounded-lg"
                      style={{ background: 'var(--sage)', color: '#fff' }}
                    >
                      Enrolled
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-sm font-medium mb-1.5" style={{ color: 'var(--navy)' }}>
                      {course.title}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>
                        {course.prof}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-16 h-1 rounded-full overflow-hidden"
                          style={{ background: 'var(--stone-border)' }}
                        >
                          <div className="h-full rounded-full w-0" style={{ background: 'var(--amber)' }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--stone-muted)' }}>0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-8 mb-9" style={{ height: 1, background: 'var(--stone-border)' }} />

      {/* Browse OCW */}
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl" style={{ fontWeight: 500 }}>
            Browse MIT OpenCourseWare
          </h2>
          <span className="text-sm cursor-pointer" style={{ color: 'var(--amber)' }}>
            All departments →
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BROWSE_COURSES.map((c, i) => (
            <Link key={i} href="/add-course">
              <div
                className="rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
              >
                <div
                  className="text-xs uppercase tracking-wide mb-1.5"
                  style={{ color: 'var(--amber)', letterSpacing: '0.5px' }}
                >
                  {c.dept.split(' ')[0]}
                </div>
                <div className="text-sm font-medium mb-1.5 leading-snug" style={{ color: 'var(--navy)' }}>
                  {c.title}
                </div>
                <div className="text-xs" style={{ color: 'var(--stone-muted)' }}>
                  {c.meta}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Demo section (mock data only) */}
      <div className="mx-8 mb-6" style={{ height: 1, background: 'var(--stone-border)' }} />
      <DemoShowcase />
    </div>
  )
}
