import { NextRequest, NextResponse } from 'next/server'
import { parseOCWCourse, getMockParsedCourse } from '@/lib/ocw-parser'

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json()) as { url: string }

    if (!url?.trim()) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    }

    if (!url.includes('ocw.mit.edu')) {
      return NextResponse.json({ error: 'Only MIT OCW URLs are supported' }, { status: 400 })
    }

    // In development or if the live parser fails, fall back to mock data.
    // In production, use the real parser: await parseOCWCourse(url)
    let course
    try {
      if (process.env.NODE_ENV === 'production') {
        course = await parseOCWCourse(url)
      } else {
        course = getMockParsedCourse(url)
      }
    } catch (parseErr) {
      console.warn('[/api/parse-course] Live parse failed, using mock:', parseErr)
      course = getMockParsedCourse(url)
    }

    return NextResponse.json({ course })
  } catch (err) {
    console.error('[/api/parse-course]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
