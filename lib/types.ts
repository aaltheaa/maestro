// ─── Course & OCW ───────────────────────────────────────────────────────────

export interface Lecture {
  id: string
  title: string
  duration: string
  videoUrl: string | null
  hasTranscript: boolean
  transcriptUrl: string | null
  watched: boolean
}

export interface Reading {
  id: string
  title: string
  type: 'Textbook' | 'Article' | 'PDF' | 'External'
  url: string | null
  completed: boolean
}

export interface Assignment {
  id: string
  title: string
  due: string
  completed: boolean
}

export interface Week {
  week: number
  title: string
  summary: string
  lectures: Lecture[]
  readings: Reading[]
  assignments: Assignment[]
}

export interface Course {
  id: string
  slug: string
  title: string
  dept: string
  prof: string
  ocwUrl: string
  weeks: Week[]
  totalWeeks: number
  totalLectures: number
  totalReadings: number
  totalAssignments: number
  transcriptsMissing: number
  addedAt: string
}

// ─── Roadmap ────────────────────────────────────────────────────────────────

export type CourseStatus = 'done' | 'active' | 'next' | 'locked'

export interface RoadmapCourse {
  id: number
  status: CourseStatus
  progress: number
  title: string
  dept: string
  weeks: number
  lectures: number
  prof: string
  skills: string[]
  highlightSkill?: string
  why: string
  ocwUrl?: string
}

export interface Roadmap {
  id: string
  goal: string
  courses: RoadmapCourse[]
  createdAt: string
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ─── OCW Parser ──────────────────────────────────────────────────────────────

export interface ParsedOCWCourse {
  title: string
  dept: string
  prof: string
  ocwUrl: string
  weekOutline: {
    week: number
    title: string
    lectures: number
    readings: number
  }[]
  totalWeeks: number
  totalLectures: number
  totalReadings: number
  totalAssignments: number
  transcriptsMissing: number
}
