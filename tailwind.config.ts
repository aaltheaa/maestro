import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#1b2d3e',
          light: '#2e4558',
          dark: '#111e28',
        },
        cream: {
          DEFAULT: '#f6f3ed',
          dark: '#ede9e1',
        },
        amber: {
          maestro: '#c98a1a',
          light: '#fef3e2',
          border: '#f0d090',
        },
        sage: {
          DEFAULT: '#2e7d5a',
          light: '#e8f5ef',
          border: '#b8ddc8',
        },
        stone: {
          border: '#e5dfd6',
          muted: '#9a8f7e',
          text: '#5c6475',
        },
      },
      borderRadius: {
        card: '14px',
        panel: '16px',
      },
    },
  },
  plugins: [],
}

export default config
