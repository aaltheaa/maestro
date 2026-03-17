import { AuthenticationError, RateLimitError, APIError } from '@anthropic-ai/sdk'

export type ErrorCode = 'auth_error' | 'rate_limit' | 'no_credits' | 'internal'

interface ClassifiedError {
  status: number
  body: { error: string; code: ErrorCode }
}

export function classifyAnthropicError(err: unknown): ClassifiedError {
  if (err instanceof AuthenticationError) {
    return {
      status: 401,
      body: { error: 'Your API key is invalid or has been revoked.', code: 'auth_error' },
    }
  }

  if (err instanceof RateLimitError) {
    return {
      status: 429,
      body: { error: 'Rate limit reached — please wait a moment and try again.', code: 'rate_limit' },
    }
  }

  if (
    err instanceof APIError &&
    (err.status === 400 || err.status === 402) &&
    /credit|billing|payment|insufficient/i.test(err.message)
  ) {
    return {
      status: 402,
      body: { error: 'Your API key has run out of credits. Add credits at console.anthropic.com.', code: 'no_credits' },
    }
  }

  return {
    status: 500,
    body: { error: 'Something went wrong — please try again.', code: 'internal' },
  }
}
