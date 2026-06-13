export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          dark: '#0f172a',
          gold: '#fbbf24',
          goldLight: '#fcd34d',
          purple: '#6d28d9',
          red: '#dc2626',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'stadium': "url('https://images.unsplash.com/photo-1518605368461-1e1e38ce158d?q=80&w=2000&auto=format&fit=crop')", // high quality placeholder stadium
      }
    },
  },
  plugins: [],
}
