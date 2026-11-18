/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand theme palette (PulseWave Obsidian + Electric Mint-Teal)
        spotify: {
          green: '#10D9A0',
          'green-light': '#2EF2B8',
          'green-dark': '#0BA97D',
          black: '#070A0F',
          dark: '#0F131C',
          card: '#161B26',
          'card-hover': '#1F2736',
          elevated: '#1C2230',
          subtext: '#9BA6B8',
          border: 'rgba(255, 255, 255, 0.08)',
          divider: '#232B3A'
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ]
      },
      animation: {
        'equalizer': 'equalizer 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        equalizer: {
          '0%': { height: '3px' },
          '50%': { height: '14px' },
          '100%': { height: '7px' }
        }
      }
    },
  },
  plugins: [],
}
