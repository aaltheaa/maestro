'use client'

import { useState, useEffect } from 'react'
import { useApiKey } from '@/lib/api-key-context'

export default function ApiKeyGate({ children }: { children: React.ReactNode }) {
  const { apiKey, setApiKey, isReady } = useApiKey()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [validating, setValidating] = useState(false)

  // Don't render anything until localStorage is hydrated
  if (!isReady) return null

  // If a key is already set, gently send people back home
  useEffect(() => {
    if (apiKey && typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }, [apiKey])

  const validate = async () => {
    const trimmed = input.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\'t look like an Anthropic API key. It should start with sk-ant-')
      return
    }
    setValidating(true)
    setError('')
    try {
      // Ping the validation endpoint with the key
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmed }),
      })
      const data = await res.json()
      if (data.valid) {
        setApiKey(trimmed)
      } else {
        setError('Key is invalid or has no credits. Double-check it at console.anthropic.com.')
      }
    } catch {
      setError('Could not validate key — check your connection and try again.')
    }
    setValidating(false)
  }

  return (
    <div
      style={{ background: 'var(--cream)', minHeight: '100vh' }}
      className="flex flex-col"
    >
      {/* Nav */}
      <nav
        style={{ background: 'var(--navy)' }}
        className="flex items-center justify-between px-7 py-3.5"
      >
        <span className="font-serif text-xl" style={{ color: '#f0e8d0', letterSpacing: '-0.3px' }}>
          Maestro
        </span>

        <a
          href="/"
          className="text-sm px-4 py-1.5 rounded-lg transition-colors"
          style={{ color: '#7a9ab0', textDecoration: 'none' }}
        >
          ← Go back to demo
        </a>
      </nav>

      {/* Setup card at the top of the page */}
      <div className="px-6 pt-10 pb-8 flex justify-center">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{ background: '#fff', border: '1px solid var(--stone-border)' }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
            style={{ background: 'var(--navy)' }}
          >
            <span className="font-serif text-xl" style={{ color: '#f0e8d0' }}>M</span>
          </div>

          <h1
            className="font-serif text-2xl mb-2"
            style={{ fontWeight: 400, color: 'var(--navy)' }}
          >
            Welcome to Maestro
          </h1>
          <p className="text-sm mb-6" style={{ color: '#7a8a94', lineHeight: 1.7 }}>
            Maestro uses Claude to power course discovery, your AI tutor, and learning
            roadmaps. To get started, paste your Anthropic API key below — it&apos;s stored
            only in your browser and never sent to anyone but Anthropic.
          </p>

          {/* Input */}
          <label
            className="text-xs uppercase tracking-wide block mb-2"
            style={{ color: 'var(--stone-muted)' }}
          >
            Anthropic API key
          </label>
          <input
            type="password"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-2 font-mono"
            style={{
              border: `1.5px solid ${error ? '#e24b4a' : 'var(--stone-border)'}`,
              background: 'var(--cream)',
              color: 'var(--navy)',
              letterSpacing: '0.05em',
            }}
            placeholder="sk-ant-api03-..."
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter') validate() }}
            autoComplete="off"
            spellCheck={false}
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: '#a32d2d' }}>
              {error}
            </p>
          )}

          <button
            onClick={validate}
            disabled={!input.trim() || validating}
            className="w-full py-3 rounded-xl text-sm font-medium transition-colors mt-2"
            style={{
              background: input.trim() && !validating ? 'var(--navy)' : '#e5dfd6',
              color: input.trim() && !validating ? '#f0e8d0' : 'var(--stone-muted)',
              cursor: input.trim() && !validating ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
          >
            {validating ? 'Checking key…' : 'Get started →'}
          </button>

          {/* How to get a key */}
          <div
            className="mt-6 rounded-xl p-4 text-sm"
            style={{ background: 'var(--cream)', border: '1px solid var(--stone-border)' }}
          >
            <p className="font-medium mb-2" style={{ color: 'var(--navy)' }}>
              Don&apos;t have a key yet?
            </p>
            <ol className="text-xs space-y-1.5" style={{ color: '#5c6475' }}>
              <li>1. Go to{' '}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--amber)' }}
                >
                  console.anthropic.com
                </a>
              </li>
              <li>2. Sign up or log in</li>
              <li>3. Click <strong style={{ color: 'var(--navy)' }}>API Keys</strong> → <strong style={{ color: 'var(--navy)' }}>Create Key</strong></li>
              <li>4. Copy and paste it above</li>
            </ol>
            <p className="text-xs mt-3" style={{ color: 'var(--stone-muted)' }}>
              New accounts include free credits. Personal use of Maestro costs a few dollars
              a month at most.
            </p>
          </div>

          <p
            className="text-xs text-center mt-4"
            style={{ color: 'var(--stone-muted)', lineHeight: 1.6 }}
          >
            Your key is stored only in your browser&apos;s localStorage.
            It is never stored on any server.
          </p>
        </div>
      </div>

      {/* No children here — this page is just for API key setup */}
    </div>
  )
}
