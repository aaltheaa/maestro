import { NextRequest, NextResponse } from 'next/server'
import { getCourseProgress, setItemProgress } from '@/lib/db'

// GET /api/progress?userId=xxx&courseSlug=yyy
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    const courseSlug = req.nextUrl.searchParams.get('courseSlug')

    if (!userId || !courseSlug) {
      return NextResponse.json({ error: 'Missing userId or courseSlug' }, { status: 400 })
    }

    const completedSet = await getCourseProgress(userId, courseSlug)
    // Return as array for JSON serialisation
    return NextResponse.json({ completed: Array.from(completedSet) })
  } catch (err) {
    console.error('[GET /api/progress]', err)
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 })
  }
}

// POST /api/progress  { userId, courseSlug, itemId, itemType, completed }
export async function POST(req: NextRequest) {
  try {
    const { userId, courseSlug, itemId, itemType, completed } = await req.json()

    if (!userId || !courseSlug || !itemId || !itemType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await setItemProgress(userId, courseSlug, itemId, itemType, completed ?? true)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/progress]', err)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
