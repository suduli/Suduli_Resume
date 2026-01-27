/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00f5ff', // Cyan
          hover: '#00c2cc',
        },
        secondary: {
          DEFAULT: '#ff6b6b', // Pink/Red
          hover: '#ff4f4f',
        },
        accent: {
          DEFAULT: '#00ff88', // Green
        },
        dark: {
          bg: '#0a0a0a',
          card: '#121212',
          text: '#e0e0e0',
          muted: '#a0a0a0'
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
