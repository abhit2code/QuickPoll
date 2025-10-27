/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'glass': {
          'bg': 'rgba(255, 255, 255, 0.05)',
          'border': 'rgba(255, 255, 255, 0.1)',
          'panel': 'rgba(255, 255, 255, 0.06)',
          'button': 'rgba(255, 255, 255, 0.1)',
          'button-hover': 'rgba(255, 255, 255, 0.2)',
          'progress': 'rgba(255, 255, 255, 0.4)',
          'accent': 'rgba(173, 216, 230, 0.3)',
        },
        'text': {
          'primary': '#ffffff',
          'secondary': '#e2e8f0',
          'muted': 'rgba(255, 255, 255, 0.6)',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'glass': '0.5px',
      },
      backdropBlur: {
        'glass': '10px',
      },
      backdropSaturate: {
        'glass': '180%',
      }
    },
  },
  plugins: [],
}
