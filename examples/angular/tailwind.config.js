/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        neon: {
          blue: '#00d4ff',
          purple: '#b347d9',
          green: '#39ff14',
          pink: '#ff0080',
        },
        dark: {
          50: '#1e293b',
          100: '#0f172a',
          200: '#020617',
          300: '#000000',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 10px #00d4ff, 0 0 20px #00d4ff',
        'neon-purple': '0 0 10px #b347d9, 0 0 20px #b347d9',
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff14',
        'cyber': '0 4px 14px 0 rgba(0, 212, 255, 0.39)',
        'cyber-lg': '0 10px 25px rgba(0, 212, 255, 0.2)',
      },
      fontFamily: {
        'cyber': ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

