import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = (await req.json()) as { apiKey: string }

    if (!apiKey?.startsWith('sk-ant-')) {
      return NextResponse.json({ valid: false, error: 'Invalid key format' })
    }

    // Make the smallest possible API call to verify the key
    const client = new Anthropic({ apiKey })
    await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'hi' }],
    })

    return NextResponse.json({ valid: true })
  } catch (err: unknown) {
    // Anthropic throws an AuthenticationError for invalid keys
    const isAuthError =
      err instanceof Error &&
      (err.message.includes('authentication') ||
        err.message.includes('API key') ||
        err.message.includes('401'))

    return NextResponse.json({
      valid: false,
      error: isAuthError ? 'Invalid API key' : 'Validation failed',
    })
  }
}
