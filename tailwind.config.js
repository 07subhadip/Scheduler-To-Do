/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'music-bar': {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        }
      },
      colors: {
        skin: {
          main: 'var(--bg-main)',
          card: 'var(--bg-card)',
          text: 'var(--text-main)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent)',
          border: 'var(--border-color)',
        }
      }
    },
  },
  plugins: [],
}

