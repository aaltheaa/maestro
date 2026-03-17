/**
 * maestroFetch
 *
 * Wraps fetch() for all Maestro API calls.
 * Reads the user's Anthropic API key from localStorage and attaches it
 * as the x-api-key header so the server-side routes can use it.
 *
 * Includes client-side sliding-window rate limiting (max 20 requests / 60s).
 *
 * Usage (identical to fetch):
 *   const res = await maestroFetch('/api/chat', { method: 'POST', body: ... })
 */

const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60_000
const requestTimestamps: number[] = []

export async function maestroFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  // Sliding-window rate limit
  const now = Date.now()
  // Remove timestamps outside the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift()
  }
  if (requestTimestamps.length >= RATE_LIMIT_MAX) {
    throw new Error('rate_limit_client')
  }
  requestTimestamps.push(now)

  const apiKey =
    typeof window !== 'undefined'
      ? localStorage.getItem('maestro_anthropic_key') ?? ''
      : ''

  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
      'x-api-key': apiKey,
    },
  })
}

const ERROR_MESSAGES: Record<string, string> = {
  auth_error: 'Your API key is invalid or has been revoked. Please update it in settings.',
  rate_limit: 'Too many requests — please wait a moment and try again.',
  no_credits: 'Your API key has run out of credits. Add credits at console.anthropic.com.',
  internal: 'Something went wrong — please try again.',
}

export function getErrorMessage(code?: string): string {
  if (!code) return ERROR_MESSAGES.internal
  return ERROR_MESSAGES[code] ?? ERROR_MESSAGES.internal
}
