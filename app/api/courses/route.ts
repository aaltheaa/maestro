import { NextRequest, NextResponse } from 'next/server'
import { getEnrolledCourses, enrollCourse } from '@/lib/db'

// GET /api/courses?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const courses = await getEnrolledCourses(userId)
    return NextResponse.json({ courses })
  } catch (err) {
    console.error('[GET /api/courses]', err)
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 })
  }
}

// POST /api/courses  { userId, slug, title, dept, prof, ocwUrl, totalWeeks }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, slug, title, dept, prof, ocwUrl, totalWeeks } = body

    if (!userId || !slug || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await enrollCourse(userId, { slug, title, dept, prof, ocwUrl, totalWeeks })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/courses]', err)
    return NextResponse.json({ error: 'Failed to enroll course' }, { status: 500 })
  }
}
