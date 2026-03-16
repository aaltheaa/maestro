import { NextRequest, NextResponse } from 'next/server'
import { getRoadmap, saveRoadmap } from '@/lib/db'

// GET /api/roadmap?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const roadmap = await getRoadmap(userId)
    return NextResponse.json({ roadmap })
  } catch (err) {
    console.error('[GET /api/roadmap]', err)
    return NextResponse.json({ error: 'Failed to load roadmap' }, { status: 500 })
  }
}

// POST /api/roadmap  { userId, goal, courses }
export async function POST(req: NextRequest) {
  try {
    const { userId, goal, courses } = await req.json()

    if (!userId || !goal || !courses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await saveRoadmap(userId, goal, courses)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/roadmap]', err)
    return NextResponse.json({ error: 'Failed to save roadmap' }, { status: 500 })
  }
}
