/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Spline Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        fog: {
          1: '#fbf8f2',
          2: '#f6f1e7',
          3: '#efe7dc',
        },
        ink: {
          1: '#14101c',
          2: '#231b2e',
          3: '#3a2f47',
        },
        sage: {
          1: '#a7b9aa',
          2: '#869a8a',
          3: '#617565',
        },
        lilac: {
          1: '#d7c8f1',
          2: '#bda5e7',
          3: '#8c6fc1',
        },
        apricot: {
          1: '#ffd6bf',
          2: '#f7ba96',
          3: '#d58b64',
        },
      },
      boxShadow: {
        bloom:
          '0 28px 80px rgba(20, 16, 28, 0.22), 0 10px 30px rgba(20, 16, 28, 0.12)',
        glass: '0 14px 40px rgba(20, 16, 28, 0.18)',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: 0, transform: 'translateY(18px) scale(0.99)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        glint: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '140% 50%' },
        },
        'orb-breathe': {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(0,-10px,0) scale(1.02)' },
        },
        'soft-float': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(0,-10px,0)' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up 900ms cubic-bezier(.16,1,.3,1) both',
        glint: 'glint 2200ms cubic-bezier(.16,1,.3,1) both',
        'orb-breathe': 'orb-breathe 3600ms ease-in-out infinite alternate',
        'soft-float': 'soft-float 4.8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
