import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { classifyAnthropicError } from '@/lib/api-errors'

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
    const { body } = classifyAnthropicError(err)
    return NextResponse.json({
      valid: false,
      error: body.error,
      code: body.code,
    })
  }
}
