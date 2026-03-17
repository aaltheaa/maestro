import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from '@/lib/types'
import { MODEL } from '@/lib/anthropic'
import { classifyAnthropicError } from '@/lib/api-errors'

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
    }

    const { systemPrompt, messages } = (await req.json()) as {
      systemPrompt: string
      messages: ChatMessage[]
    }

    if (!systemPrompt || !messages?.length) {
      return NextResponse.json({ error: 'Missing systemPrompt or messages' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: systemPrompt,
      messages,
    })

    const block = response.content.find(b => b.type === 'text')
    const text = block?.type === 'text' ? block.text : ''
    return NextResponse.json({ text })
  } catch (err) {
    console.error('[/api/chat]', err)
    const { status, body } = classifyAnthropicError(err)
    return NextResponse.json(body, { status })
  }
}
