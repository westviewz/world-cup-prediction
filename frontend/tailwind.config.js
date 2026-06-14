export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wc: {
          burgundy:    '#4A0E1A',
          crimson:     '#7A1423',
          gold:        '#F4C542',
          goldLight:   '#F9E2AE',
          orange:      '#FF6B35',
          champagne:   '#F9E2AE',
          dark:        '#0D0507',
          darkCard:    '#1A0810',
          muted:       '#D9D9D9',
        }
      },
      backgroundImage: {
        'stadium':    "url('https://images.unsplash.com/photo-1568992688065-536aad8a12f6?q=80&w=2000&auto=format&fit=crop')",
        'stadium2':   "url('https://images.unsplash.com/photo-1551958219-acbc595d831d?q=80&w=2000&auto=format&fit=crop')",
        'gold-shine': 'linear-gradient(135deg, #F9E2AE 0%, #F4C542 40%, #c9920a 70%, #F4C542 100%)',
        'burgundy-gradient': 'linear-gradient(135deg, #4A0E1A 0%, #7A1423 50%, #4A0E1A 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(10,3,6,0.7) 0%, rgba(74,14,26,0.5) 40%, rgba(13,5,7,0.95) 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow':    '0 0 30px rgba(244,197,66,0.4), 0 0 60px rgba(244,197,66,0.2)',
        'gold-glow-lg': '0 0 50px rgba(244,197,66,0.5), 0 0 100px rgba(244,197,66,0.25)',
        'crimson-glow': '0 0 30px rgba(122,20,35,0.6)',
        'card':         '0 25px 60px rgba(0,0,0,0.6)',
      },
      animation: {
        'float':        'float 3s ease-in-out infinite',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244,197,66,0.4)' },
          '50%':      { boxShadow: '0 0 60px rgba(244,197,66,0.8)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
