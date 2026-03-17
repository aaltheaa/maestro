'use client'

import { useState } from 'react'
import { DEMO_DISCOVER_RESPONSE, DEMO_ROADMAP } from '@/lib/mock-data'

type DemoStep = 'discover' | 'courses' | 'roadmap'

const STEPS: { id: DemoStep; label: string }[] = [
  { id: 'discover', label: '1. Ask Maestro' },
  { id: 'courses', label: '2. Recommended courses' },
  { id: 'roadmap', label: '3. Roadmap preview' },
]

export default function DemoShowcase() {
  const [activeStep, setActiveStep] = useState<DemoStep>('discover')

  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-xl" style={{ fontWeight: 500 }}>
          See Maestro in action
        </h2>
        <span
          className="text-xs px-2 py-1 rounded-full uppercase tracking-wide"
          style={{ background: 'var(--cream)', color: 'var(--stone-muted)', letterSpacing: '0.06em' }}
        >
          Demo · mock data
        </span>
      </div>
      <p className="text-sm mb-5 max-w-2xl" style={{ color: 'var(--stone-muted)', lineHeight: 1.7 }}>
        This is a walkthrough using mock data so you can get a feel for how Maestro discovers courses and turns them
        into a learning roadmap — no setup or API keys required.
      </p>

      {/* Step selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STEPS.map(step => {
          const isActive = activeStep === step.id
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: isActive ? 'var(--navy)' : 'var(--stone-border)',
                background: isActive ? 'var(--navy)' : '#fff',
                color: isActive ? '#f0e8d0' : 'var(--stone-text)',
              }}
            >
              {step.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left: conversation / description */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#fff', border: '1px solid var(--stone-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
        >
          {activeStep === 'discover' && (
            <>
              <p
                className="text-xs uppercase tracking-wide mb-2"
                style={{ color: 'var(--stone-muted)', letterSpacing: '0.08em' }}
              >
                Demo conversation
              </p>
              <div className="space-y-3">
                <div>
                  <span
                    className="inline-flex text-xs px-2 py-0.5 rounded-md mb-1"
                    style={{ background: 'var(--cream)', color: 'var(--stone-text)', letterSpacing: '0.04em' }}
                  >
                    You
                  </span>
                  <p className="text-sm font-serif" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
                    "{DEMO_DISCOVER_RESPONSE.query}"
                  </p>
                </div>
                <div>
                  <span
                    className="inline-flex text-xs px-2 py-0.5 rounded-md mb-1"
                    style={{ background: 'var(--navy)', color: '#f0e8d0', letterSpacing: '0.06em' }}
                  >
                    Maestro
                  </span>
                  <p className="text-sm" style={{ color: '#2c3340', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {DEMO_DISCOVER_RESPONSE.text}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeStep === 'courses' && (
            <>
              <p
                className="text-xs uppercase tracking-wide mb-2"
                style={{ color: 'var(--stone-muted)', letterSpacing: '0.08em' }}
              >
                Example course suggestions
              </p>
              <p className="text-sm mb-3" style={{ color: '#2c3340', lineHeight: 1.6 }}>
                Maestro proposes a small set of MIT OpenCourseWare classes that match your goal, with weeks and
                lecture counts so you can see the commitment at a glance.
              </p>
            </>
          )}

          {activeStep === 'roadmap' && (
            <>
              <p
                className="text-xs uppercase tracking-wide mb-2"
                style={{ color: 'var(--stone-muted)', letterSpacing: '0.08em' }}
              >
                Roadmap preview
              </p>
              <p className="text-sm mb-3" style={{ color: '#2c3340', lineHeight: 1.6 }}>
                The same courses become a sequenced roadmap, with a clear sense of what you&apos;ve finished, what
                you&apos;re in the middle of, and what unlocks next.
              </p>
            </>
          )}
        </div>

        {/* Right: visual cards that change per step */}
        <div className="space-y-3">
          {activeStep === 'discover' && (
            <div
              className="rounded-2xl p-4"
              style={{ background: 'var(--navy)', border: '1px solid rgba(240,232,208,0.25)' }}
            >
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'rgba(240,232,208,0.8)' }}>
                What Maestro sends to Claude
              </p>
              <p className="text-xs mb-2" style={{ color: 'rgba(240,232,208,0.8)', lineHeight: 1.6 }}>
                A carefully structured prompt grounded in MIT OpenCourseWare metadata, your goal, and your prior
                progress.
              </p>
              <div
                className="rounded-xl p-3 text-xs font-mono overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(240,232,208,0.9)', maxHeight: 180 }}
              >
                &quot;You are Maestro, an AI learning companion for MIT OpenCourseWare.\n\nUser goal:
                &nbsp;history of graphic design and fashion.\nConstraints:\n- Prioritise courses with transcripts when
                possible.\n- Balance visual history with fashion and cultural theory.\n- Build a path the learner can
                realistically follow alongside work.&quot;
              </div>
            </div>
          )}

          {activeStep === 'courses' && (
            <div className="space-y-2">
              {DEMO_DISCOVER_RESPONSE.courses.map((c, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--navy)' }}>
                      {c.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--stone-muted)' }}>
                      {c.dept} · {c.weeks}
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--amber)' }}>
                    Add to plan →
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeStep === 'roadmap' && (
            <div
              className="rounded-2xl p-4"
              style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p
                    className="text-xs uppercase tracking-wide mb-1"
                    style={{ color: 'var(--stone-muted)', letterSpacing: '0.08em' }}
                  >
                    Demo roadmap
                  </p>
                  <p className="text-sm font-serif" style={{ color: 'var(--navy)' }}>
                    {DEMO_ROADMAP.goal}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {DEMO_ROADMAP.courses.map(course => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)' }}
                  >
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--navy)' }}>
                        {course.title}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--stone-muted)' }}>
                        {course.dept} · {course.weeks} weeks · {course.lectures} lectures
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{
                          background:
                            course.status === 'done'
                              ? 'var(--sage)'
                              : course.status === 'active'
                              ? 'var(--navy)'
                              : 'var(--cream)',
                          color: course.status === 'next' ? 'var(--stone-text)' : '#fff',
                        }}
                      >
                        {course.status === 'done'
                          ? 'Done'
                          : course.status === 'active'
                          ? 'In progress'
                          : 'Up next'}
                      </span>
                      <span className="text-[11px]" style={{ color: 'var(--stone-muted)' }}>
                        {course.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

