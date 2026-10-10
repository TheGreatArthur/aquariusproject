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
      // Theme tokens (app/theme.css), as RGB channels so opacity modifiers like bg-accent/30 keep working
      colors: Object.fromEntries([
        'background',
        'surface',
        'surface-elevated',
        'border',
        'foreground',
        'muted',
        'accent',
        'accent-glow',
        'danger',
        'warning',
        'success',
      ].map((name) => [name, `rgb(var(--color-${name}) / <alpha-value>)`])),
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem, 6vw, 4.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
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
