import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          deep:  '#0a0f1e',
          panel: '#1a2332',
          muted: '#1f2d40',
          hover: '#243245',
        },
        accent: {
          orange: '#e8611a',
          teal:   '#00b4a6',
        },
        border: {
          dim:    'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.14)',
        },
        text: {
          primary:   '#e8edf5',
          secondary: '#8fa3bc',
          muted:     '#546a80',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'grid-overlay': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
    },
  },
  plugins: [],
} satisfies Config
