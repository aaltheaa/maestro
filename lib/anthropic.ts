import Anthropic from '@anthropic-ai/sdk'
import type { ChatMessage } from './types'

// ─── Client ──────────────────────────────────────────────────────────────────

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODEL = 'claude-sonnet-4-20250514'

// ─── System Prompts ──────────────────────────────────────────────────────────

export const DISCOVER_SYSTEM_PROMPT = `You are Maestro, an AI learning guide for MIT OpenCourseWare. When a user describes what they want to learn, suggest 2-3 specific real OCW courses and explain briefly why they're a good fit.

Write 2 short paragraphs of warm, clear prose. Then output a JSON block at the very end in EXACTLY this format (no markdown fences):
COURSES_JSON:[{"name":"Course Name","dept":"Department","weeks":"N weeks","url":"https://ocw.mit.edu/..."}]

Use real OCW course names and real approximate URLs when possible. Always end with that JSON. Nothing after it.`

export const ROADMAP_SYSTEM_PROMPT = `You are Maestro, an AI learning guide for MIT OpenCourseWare. A user has a learning goal and an existing course roadmap. When they ask you to adjust, refine, or explain their roadmap:
- Respond in 2 short paragraphs only
- Be warm, direct, and specific about which courses to prioritise or drop
- Reference the actual course titles in your response
- No bullet lists — just clear, helpful prose`

export const COURSE_PREVIEW_SYSTEM_PROMPT = `You are Maestro, an AI that helps users understand MIT OpenCourseWare courses before they enroll. Given a course name or URL, write exactly 2 sentences: what the course covers, and who it's best suited for. Be warm and specific. No lists. No preamble.`

// ─── API Helpers ─────────────────────────────────────────────────────────────

export async function streamChat(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens = 400
) {
  return anthropic.messages.stream({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  })
}

export async function completeChat(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens = 400
): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  })
  const block = response.content.find(b => b.type === 'text')
  return block?.type === 'text' ? block.text : ''
}
