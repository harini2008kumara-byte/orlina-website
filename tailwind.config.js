/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        panel: token('panel'),
        input: token('input'),
        line: token('line'),
        accent: token('accent'),
        mint: token('mint'),
        mist: token('mist'),
        ink: token('ink'),
        muted: token('muted'),
        'on-accent': token('on-accent'),
        warning: token('warning'),
        danger: token('danger'),
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0, 0, 0, 0.2), 0 18px 40px -22px rgba(0, 0, 0, 0.6)',
        lift: '0 2px 4px rgba(0, 0, 0, 0.25), 0 24px 48px -20px rgba(0, 0, 0, 0.7)',
        clay: 'inset 0 1px 0 rgba(255, 255, 255, 0.07), inset 0 -2px 4px rgba(0, 0, 0, 0.22), 0 1px 2px rgba(0, 0, 0, 0.35), 0 10px 22px -12px rgba(0, 0, 0, 0.65)',
        'clay-primary': 'inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -3px 6px rgba(10, 6, 24, 0.32), 0 2px 4px rgba(0, 0, 0, 0.3), 0 12px 24px -10px rgba(138, 107, 255, 0.45)',
        'clay-inset': 'inset 0 2px 6px rgba(0, 0, 0, 0.38), inset 0 -1px 0 rgba(255, 255, 255, 0.05), 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'mic-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        'typing-dot': {
          '0%, 80%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '40%': { opacity: '1', transform: 'translateY(-3px)' },
        },
        'avatar-pop': {
          '0%': { opacity: '0', transform: 'scale(0.4)' },
          '70%': { opacity: '1', transform: 'scale(1.12)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        float: 'float 7s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 4s ease-in-out infinite',
        'mic-ring': 'mic-ring 1.6s ease-out infinite',
        'typing-dot': 'typing-dot 1.2s ease-in-out infinite',
        'avatar-pop': 'avatar-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};
