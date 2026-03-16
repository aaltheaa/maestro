'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApiKey } from '@/lib/api-key-context'

interface NavProps {
  backLabel?: string
  backHref?: string
}

export default function Nav({ backLabel, backHref }: NavProps) {
  const { apiKey, clearApiKey } = useApiKey()
  const [showKeyMenu, setShowKeyMenu] = useState(false)

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`
    : null

  return (
    <nav
      style={{ background: 'var(--navy)' }}
      className="sticky top-0 z-50 flex items-center justify-between px-7 py-3.5"
    >
      <Link href="/">
        <span
          className="font-serif text-xl cursor-pointer"
          style={{ color: '#f0e8d0', letterSpacing: '-0.3px' }}
        >
          Maestro
        </span>
      </Link>

      <div className="flex items-center gap-3 relative">
        {backLabel && backHref ? (
          <Link
            href={backHref}
            className="text-sm transition-colors"
            style={{ color: '#7a9ab0' }}
          >
            ← {backLabel}
          </Link>
        ) : (
          <>
            <Link
              href="/roadmap"
              className="text-sm px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ color: '#7a9ab0' }}
            >
              My roadmap
            </Link>
            <Link
              href="/add-course"
              className="text-sm px-4 py-1.5 rounded-lg font-medium transition-colors"
              style={{ background: 'var(--amber)', color: '#fff' }}
            >
              + Add course
            </Link>
          </>
        )}

        {/* API key indicator */}
        <div className="relative">
          <button
            onClick={() => setShowKeyMenu(v => !v)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#7a9ab0',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: apiKey ? 'var(--sage)' : '#e24b4a', display: 'inline-block' }}
            />
            API key
          </button>

          {showKeyMenu && (
            <div
              className="absolute right-0 top-full mt-2 rounded-xl p-3 z-50 min-w-52"
              style={{
                background: '#fff',
                border: '1px solid var(--stone-border)',
                boxShadow: '0 4px 16px rgba(27,45,62,0.12)',
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--navy)' }}>
                Your API key
              </p>
              <p
                className="text-xs font-mono mb-3 truncate"
                style={{ color: 'var(--stone-muted)' }}
              >
                {maskedKey ?? 'No key set'}
              </p>
              <button
                onClick={() => { clearApiKey(); setShowKeyMenu(false) }}
                className="w-full text-xs py-1.5 rounded-lg text-left px-2 transition-colors"
                style={{
                  color: '#a32d2d',
                  background: '#fcebeb',
                  border: '1px solid #f7c1c1',
                }}
              >
                Remove key → sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
