import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e40af',
        dark: '#0f172a',
        light: '#f8fafc',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
        'gradient-blue': 'linear-gradient(135deg, rgba(30, 58, 138, 0.5) 0%, rgba(59, 130, 246, 0.3) 100%)',
      },
    },
  },
  plugins: [],
}
export default config
