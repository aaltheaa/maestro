'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const KEY = 'maestro_anthropic_key'

interface ApiKeyContextValue {
  apiKey: string | null
  setApiKey: (key: string) => void
  clearApiKey: () => void
  isReady: boolean
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: null,
  setApiKey: () => {},
  clearApiKey: () => {},
  isReady: false,
})

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (stored) setApiKeyState(stored)
    setIsReady(true)
  }, [])

  const setApiKey = (key: string) => {
    const trimmed = key.trim()
    localStorage.setItem(KEY, trimmed)
    setApiKeyState(trimmed)
  }

  const clearApiKey = () => {
    localStorage.removeItem(KEY)
    setApiKeyState(null)
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isReady }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey() {
  return useContext(ApiKeyContext)
}
