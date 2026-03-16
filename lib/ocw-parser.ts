/**
 * OCW Parser
 *
 * Scrapes an MIT OpenCourseWare course URL and structures it into
 * the Maestro data model. Uses Playwright for JS-rendered pages
 * and Cheerio for HTML parsing.
 *
 * In production, run Playwright in a background job queue (e.g. Inngest)
 * and cache results in Supabase / PostgreSQL.
 */

import * as cheerio from 'cheerio'
import type { ParsedOCWCourse } from './types'

const OCW_BASE = 'https://ocw.mit.edu'

// ─── Main entry point ────────────────────────────────────────────────────────

export async function parseOCWCourse(url: string): Promise<ParsedOCWCourse> {
  // Normalise URL
  const courseUrl = url.startsWith('http') ? url : `${OCW_BASE}${url}`

  // Fetch the course index page
  const html = await fetchPage(courseUrl)
  const $ = cheerio.load(html)

  const title = parseTitle($)
  const dept = parseDept($)
  const prof = parseProf($)

  // Try to fetch syllabus sub-page for week/reading breakdown
  const syllabusUrl = courseUrl.replace(/\/?$/, '/pages/syllabus/')
  let syllabusHtml: string | null = null
  try {
    syllabusHtml = await fetchPage(syllabusUrl)
  } catch {
    // Syllabus page may not exist — fall back to course index
  }

  const weekOutline = syllabusHtml
    ? parseWeeksFromSyllabus(cheerio.load(syllabusHtml))
    : estimateWeeks($)

  const lectureData = await parseLectures(courseUrl)

  const transcriptsMissing = lectureData.filter(l => !l.hasTranscript).length

  return {
    title,
    dept,
    prof,
    ocwUrl: courseUrl,
    weekOutline,
    totalWeeks: weekOutline.length,
    totalLectures: lectureData.length || weekOutline.reduce((s, w) => s + w.lectures, 0),
    totalReadings: weekOutline.reduce((s, w) => s + w.readings, 0),
    totalAssignments: Math.round(weekOutline.length * 0.8),
    transcriptsMissing,
  }
}

// ─── Page fetcher ─────────────────────────────────────────────────────────────

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; MaestroBot/1.0; +https://maestro.app)',
      Accept: 'text/html',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour in Next.js
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.text()
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function parseTitle($: cheerio.CheerioAPI): string {
  return (
    $('h1.course-title').first().text().trim() ||
    $('h1').first().text().trim() ||
    $('title').text().split('|')[0].trim() ||
    'Untitled Course'
  )
}

function parseDept($: cheerio.CheerioAPI): string {
  return (
    $('[class*="department"]').first().text().trim() ||
    $('a[href*="/departments/"]').first().text().trim() ||
    'MIT OpenCourseWare'
  )
}

function parseProf($: cheerio.CheerioAPI): string {
  const instructorEl =
    $('[class*="instructor"]').first().text().trim() ||
    $('[class*="faculty"]').first().text().trim() ||
    $('dd').filter((_, el) => $(el).prev('dt').text().toLowerCase().includes('instructor')).text().trim()

  if (!instructorEl) return 'MIT Faculty'
  // Clean up "Instructors:" prefix if present
  return instructorEl.replace(/^instructors?:?\s*/i, '').trim()
}

function parseWeeksFromSyllabus(
  $: cheerio.CheerioAPI
): ParsedOCWCourse['weekOutline'] {
  const weeks: ParsedOCWCourse['weekOutline'] = []

  // OCW syllabi often use table rows or h3/h4 headings per week
  $('table tr, h3, h4').each((_, el) => {
    const text = $(el).text().trim()
    const weekMatch = text.match(/week\s+(\d+)[:\s–-]+(.+)/i)
    if (weekMatch) {
      weeks.push({
        week: parseInt(weekMatch[1]),
        title: weekMatch[2].trim().slice(0, 80),
        lectures: 2,
        readings: 3,
      })
    }
  })

  return weeks.length > 0 ? weeks : estimateWeeks($)
}

function estimateWeeks($: cheerio.CheerioAPI): ParsedOCWCourse['weekOutline'] {
  // Fallback: generate placeholder weeks from course description
  const text = $('body').text()
  const weeksMatch = text.match(/(\d+)[- ]week/i)
  const totalWeeks = weeksMatch ? parseInt(weeksMatch[1]) : 12

  return Array.from({ length: totalWeeks }, (_, i) => ({
    week: i + 1,
    title: `Week ${i + 1}`,
    lectures: 2,
    readings: 3,
  }))
}

async function parseLectures(
  courseUrl: string
): Promise<{ hasTranscript: boolean }[]> {
  const lecturesUrl = courseUrl.replace(/\/?$/, '/video_galleries/lecture-videos/')
  try {
    const html = await fetchPage(lecturesUrl)
    const $ = cheerio.load(html)

    const lectures: { hasTranscript: boolean }[] = []
    $('[class*="video"], [class*="lecture"]').each((_, el) => {
      // Check for transcript link nearby
      const hasTranscript =
        $(el).find('a[href*="transcript"]').length > 0 ||
        $(el).find('[class*="transcript"]').length > 0

      lectures.push({ hasTranscript })
    })

    return lectures
  } catch {
    return []
  }
}

// ─── Mock for development (no live network needed) ───────────────────────────

export function getMockParsedCourse(url: string): ParsedOCWCourse {
  return {
    title: 'History of Graphic Design: Typography & Visual Culture',
    dept: 'Architecture & Planning',
    prof: 'Prof. David Reinfurt',
    ocwUrl: url,
    weekOutline: [
      { week: 1, title: 'Origins of Graphic Communication', lectures: 2, readings: 3 },
      { week: 2, title: 'The Age of Typography', lectures: 2, readings: 2 },
      { week: 3, title: 'Modernism & the Bauhaus', lectures: 2, readings: 3 },
      { week: 4, title: 'Post-War American Design', lectures: 2, readings: 2 },
      { week: 5, title: 'Swiss Style & the Grid', lectures: 2, readings: 3 },
      { week: 6, title: 'Psychedelic & Counter-Culture Design', lectures: 1, readings: 2 },
      { week: 7, title: 'Postmodernism & Deconstruction', lectures: 2, readings: 3 },
      { week: 8, title: 'Digital Revolution', lectures: 2, readings: 2 },
    ],
    totalWeeks: 14,
    totalLectures: 24,
    totalReadings: 38,
    totalAssignments: 12,
    transcriptsMissing: 7,
  }
}
