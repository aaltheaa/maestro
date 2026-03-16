/**
 * maestroFetch
 *
 * Wraps fetch() for all Maestro API calls.
 * Reads the user's Anthropic API key from localStorage and attaches it
 * as the x-api-key header so the server-side routes can use it.
 *
 * Usage (identical to fetch):
 *   const res = await maestroFetch('/api/chat', { method: 'POST', body: ... })
 */
export async function maestroFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
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
