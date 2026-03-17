import type { Course, Roadmap } from './types'

export const MOCK_COURSES: Course[] = [
  {
    id: 'graphic-design-history',
    slug: 'graphic-design-history',
    title: 'History of Graphic Design',
    dept: 'Architecture & Planning',
    prof: 'Prof. David Reinfurt',
    ocwUrl: 'https://ocw.mit.edu/courses/4-340-transforming-the-city/',
    totalWeeks: 14,
    totalLectures: 24,
    totalReadings: 38,
    totalAssignments: 12,
    transcriptsMissing: 7,
    addedAt: '2025-01-10T10:00:00Z',
    weeks: [
      {
        week: 1,
        title: 'Origins of Graphic Communication',
        summary:
          'Establishes the foundations of visual communication, tracing the arc from prehistoric mark-making through the invention of movable type. Particular attention is given to how technological shifts enabled new forms of mass communication.',
        lectures: [
          {
            id: 'l1', title: 'From Cave Paintings to Movable Type',
            duration: '52 min', videoUrl: 'https://www.youtube.com/watch?v=example1',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
          {
            id: 'l2', title: 'Gutenberg & the Print Revolution',
            duration: '48 min', videoUrl: 'https://www.youtube.com/watch?v=example2',
            hasTranscript: false, transcriptUrl: null, watched: false,
          },
        ],
        readings: [
          { id: 'r1', title: "Meggs' History of Graphic Design, Ch. 1–3", type: 'Textbook', url: '#', completed: false },
          { id: 'r2', title: 'The Anatomy of Type — Garfield', type: 'Article', url: 'https://ocw.mit.edu', completed: false },
        ],
        assignments: [
          { id: 'a1', title: 'Visual timeline: Pre-Gutenberg communication systems', due: 'Due Week 2', completed: false },
        ],
      },
      {
        week: 2,
        title: 'The Age of Typography',
        summary:
          "We examine how typography evolved from functional craft to expressive medium. The Industrial Revolution's demand for attention-grabbing display type introduced a dramatic rupture with classical forms.",
        lectures: [
          {
            id: 'l3', title: 'Caslon, Bodoni & the Roman Tradition',
            duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=example3',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
          {
            id: 'l4', title: 'Display Type and the Industrial Era',
            duration: '44 min', videoUrl: 'https://www.youtube.com/watch?v=example4',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
        ],
        readings: [
          { id: 'r3', title: 'Thinking With Type — Ellen Lupton, Part I', type: 'Textbook', url: '#', completed: false },
          { id: 'r4', title: '"The Secret Life of Fonts" — The Guardian', type: 'Article', url: 'https://theguardian.com', completed: false },
        ],
        assignments: [
          { id: 'a2', title: 'Typeface analysis: Compare two historical typefaces across three criteria', due: 'Due Week 3', completed: false },
        ],
      },
      {
        week: 3,
        title: 'Modernism & the Bauhaus',
        summary:
          "The Modernist project attempted to dissolve the boundary between art and everyday life. This week maps the major European movements — Constructivism, De Stijl, the Bauhaus — and traces how their formal principles became the grammar of 20th-century design.",
        lectures: [
          {
            id: 'l5', title: 'De Stijl, Constructivism & New Vision',
            duration: '58 min', videoUrl: 'https://www.youtube.com/watch?v=example5',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
          {
            id: 'l6', title: 'Bauhaus: Art as Life as Design',
            duration: '61 min', videoUrl: 'https://www.youtube.com/watch?v=example6',
            hasTranscript: false, transcriptUrl: null, watched: false,
          },
        ],
        readings: [
          { id: 'r5', title: 'The Elements of Typographic Style — Bringhurst, Ch. 4', type: 'Textbook', url: '#', completed: false },
          { id: 'r6', title: '"What Was the Bauhaus?" — Smithsonian', type: 'Article', url: 'https://smithsonianmag.com', completed: false },
        ],
        assignments: [
          { id: 'a3', title: 'Grid composition: Design a one-page layout in the Modernist tradition', due: 'Due Week 4', completed: false },
          { id: 'a4', title: 'Short essay (600 words): Bauhaus principles in contemporary design', due: 'Due Week 4', completed: false },
        ],
      },
      {
        week: 4,
        title: 'Post-War American Design',
        summary:
          "America's post-war economic expansion created demand for a new design profession: the corporate identity consultant. We examine how designers like Paul Rand, Saul Bass, and Ivan Chermayeff systematised visual identity.",
        lectures: [
          {
            id: 'l7', title: 'The New York School & Corporate Identity',
            duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=example7',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
          {
            id: 'l8', title: 'Paul Rand & the Visual Identity Revolution',
            duration: '47 min', videoUrl: 'https://www.youtube.com/watch?v=example8',
            hasTranscript: true, transcriptUrl: '#', watched: false,
          },
        ],
        readings: [
          { id: 'r7', title: "A Designer's Art — Paul Rand", type: 'Textbook', url: '#', completed: false },
          { id: 'r8', title: '"How Corporations Got Their Look" — AIGA Eye on Design', type: 'Article', url: 'https://eyeondesign.aiga.org', completed: false },
        ],
        assignments: [
          { id: 'a5', title: 'Brand audit: Analyse the visual identity system of a 1950s–70s American company', due: 'Due Week 5', completed: false },
        ],
      },
    ],
  },
]

export const MOCK_ROADMAP: Roadmap = {
  id: 'roadmap-1',
  goal: 'history of graphic design and fashion',
  createdAt: '2025-01-10T10:00:00Z',
  courses: [
    {
      id: 1, status: 'done', progress: 100,
      title: 'Visual Foundations: Drawing & Composition',
      dept: 'Art & Design', weeks: 8, lectures: 16,
      prof: 'Prof. Muriel Cooper',
      skills: ['Visual thinking', 'Composition', 'Form & space'],
      why: "Builds essential visual literacy before engaging with design history. You'll learn to see before you learn to read history.",
    },
    {
      id: 2, status: 'active', progress: 28,
      title: 'History of Graphic Design: Typography & Visual Culture',
      dept: 'Architecture & Planning', weeks: 14, lectures: 24,
      prof: 'Prof. David Reinfurt',
      skills: ['Typography', 'Print culture', 'Design movements'],
      highlightSkill: 'Typography',
      why: 'Your primary course. Traces graphic design from Gutenberg to the digital era with deep focus on typography as cultural force.',
    },
    {
      id: 3, status: 'next', progress: 0,
      title: 'Fashion, Culture & Identity',
      dept: 'Comparative Media Studies', weeks: 10, lectures: 18,
      prof: 'Prof. Anne Hollander',
      skills: ['Fashion theory', 'Cultural semiotics', 'Visual identity'],
      highlightSkill: 'Fashion theory',
      why: 'Pairs directly with your design history work — examines how dress functions as a form of visual communication.',
    },
    {
      id: 4, status: 'locked', progress: 0,
      title: 'Semiotics & Visual Language',
      dept: 'Linguistics & Philosophy', weeks: 12, lectures: 22,
      prof: 'Prof. Roland Hayward',
      skills: ['Semiotics', 'Sign systems', 'Cultural theory'],
      why: 'Unlocks after Fashion, Culture & Identity. Provides the theoretical framework to synthesise everything from courses 1–3.',
    },
    {
      id: 5, status: 'locked', progress: 0,
      title: 'Contemporary Design Practice',
      dept: 'Art, Culture & Technology', weeks: 10, lectures: 20,
      prof: 'Prof. Neri Oxman',
      skills: ['Design systems', 'Digital tools', 'Critical practice'],
      why: 'The capstone. Applies historical and theoretical knowledge to contemporary design challenges.',
    },
  ],
}

export const BROWSE_COURSES = [
  { title: 'Modern Architecture', dept: 'Architecture', meta: '12 weeks · 24 lectures' },
  { title: 'Introduction to Film Studies', dept: 'Comparative Media', meta: '14 weeks · 28 lectures' },
  { title: 'Visual Culture & Design', dept: 'Art, Culture & Tech', meta: '10 weeks · 20 lectures' },
  { title: 'Photography and Truth', dept: 'Architecture', meta: '8 weeks · 16 lectures' },
  { title: 'Drawing & Composition', dept: 'Art & Design', meta: '10 weeks · 22 lectures' },
  { title: 'History of Western Art', dept: 'Art & Archaeology', meta: '16 weeks · 32 lectures' },
]

// Demo data for the landing-page mock experience
export const DEMO_DISCOVER_RESPONSE = {
  query: "I want to learn the history of fashion and graphic design, but I'm starting from scratch.",
  text:
    "Great goal. To understand how fashion and graphic design talk to each other, we'll start by giving you a visual foundation, then layer in design history and fashion theory.\n\nHere's a three-course path that moves from drawing and visual thinking, into typography and graphic design, and finally into fashion as a cultural language.",
  courses: [
    {
      name: 'Visual Foundations: Drawing & Composition',
      dept: 'Art & Design',
      weeks: '8 weeks · 16 lectures',
      url: 'https://ocw.mit.edu',
    },
    {
      name: 'History of Graphic Design: Typography & Visual Culture',
      dept: 'Architecture & Planning',
      weeks: '14 weeks · 24 lectures',
      url: 'https://ocw.mit.edu',
    },
    {
      name: 'Fashion, Culture & Identity',
      dept: 'Comparative Media Studies',
      weeks: '10 weeks · 18 lectures',
      url: 'https://ocw.mit.edu',
    },
  ],
}

export const DEMO_ROADMAP: Roadmap = {
  id: 'demo-roadmap',
  goal: 'history of graphic design and fashion',
  createdAt: '2025-01-10T10:00:00Z',
  courses: [
    {
      id: 1,
      status: 'done',
      progress: 100,
      title: 'Visual Foundations: Drawing & Composition',
      dept: 'Art & Design',
      weeks: 8,
      lectures: 16,
      prof: 'Prof. Muriel Cooper',
      skills: ['Visual thinking', 'Composition', 'Form & space'],
      why:
        "Builds essential visual literacy before engaging with design history. You'll learn to see before you learn to read history.",
    },
    {
      id: 2,
      status: 'active',
      progress: 35,
      title: 'History of Graphic Design: Typography & Visual Culture',
      dept: 'Architecture & Planning',
      weeks: 14,
      lectures: 24,
      prof: 'Prof. David Reinfurt',
      skills: ['Typography', 'Print culture', 'Design movements'],
      highlightSkill: 'Typography',
      why:
        'Your primary course. Traces graphic design from Gutenberg to the digital era with deep focus on typography as cultural force.',
    },
    {
      id: 3,
      status: 'next',
      progress: 0,
      title: 'Fashion, Culture & Identity',
      dept: 'Comparative Media Studies',
      weeks: 10,
      lectures: 18,
      prof: 'Prof. Anne Hollander',
      skills: ['Fashion theory', 'Cultural semiotics', 'Visual identity'],
      highlightSkill: 'Fashion theory',
      why:
        'Pairs directly with your design history work — examines how dress functions as a form of visual communication.',
    },
  ],
}
