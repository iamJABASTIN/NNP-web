/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f2ca50',
          container: '#d4af37',
        },
        secondary: {
          DEFAULT: '#bdc7d9',
          container: '#404a59',
        },
        background: '#0c1322',
        surface: {
          DEFAULT: '#191f2f',
          lowest: '#070e1d',
          low: '#141b2b',
          high: '#232a3a',
          highest: '#2e3545',
          bright: '#323949',
        },
        outline: {
          DEFAULT: '#99907c',
          variant: '#4d4635',
        },
        accent: '#f2ca50', // Mapping accent to primary for convenience
        muted: '#f8f9fa',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Noto Serif', 'serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'default': '0.25rem', // ROUND_FOUR (4px)
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'bounce': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}