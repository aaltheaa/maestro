import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import {
  MODEL,
  DISCOVER_SYSTEM_PROMPT,
  COURSE_PREVIEW_SYSTEM_PROMPT,
} from '@/lib/anthropic'
import { classifyAnthropicError } from '@/lib/api-errors'

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
    }

    const { query, mode } = (await req.json()) as {
      query: string
      mode?: 'preview' | 'discover'
    }

    if (!query?.trim()) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const system =
      mode === 'preview' ? COURSE_PREVIEW_SYSTEM_PROMPT : DISCOVER_SYSTEM_PROMPT

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      system,
      messages: [{ role: 'user', content: query }],
    })
    const block = response.content.find(b => b.type === 'text')
    const full = block?.type === 'text' ? block.text : ''

    // Extract courses JSON block from end of response
    const match = full.match(/COURSES_JSON:(\[.*?\])/s)
    let courses: { name: string; dept: string; weeks: string; url?: string }[] = []
    let text = full

    if (match) {
      try {
        courses = JSON.parse(match[1])
      } catch {
        courses = []
      }
      text = full.replace(/COURSES_JSON:\[.*?\]/s, '').trim()
    }

    return NextResponse.json({ text, courses })
  } catch (err) {
    console.error('[/api/discover]', err)
    const { status, body } = classifyAnthropicError(err)
    return NextResponse.json(body, { status })
  }
}
