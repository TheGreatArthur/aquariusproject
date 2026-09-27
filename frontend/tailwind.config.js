/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        background: '#050B12',
        surface: '#0A141F',
        'surface-elevated': '#101E2C',
        border: '#1A2A3A',
        foreground: '#E8F1F7',
        muted: '#89A0B3',
        accent: '#2DD4BF',
        'accent-glow': '#5EEAD4',
        danger: '#FB7185',
        warning: '#FBBF24',
        success: '#34D399',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(94, 234, 212, 0.55), 0 0 80px -24px rgba(45, 212, 191, 0.45)',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
