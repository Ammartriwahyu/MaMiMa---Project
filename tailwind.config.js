export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35', 50:'#FFF3EE', 100:'#FFE4D5',
          200:'#FFC4A8', 400:'#FF7F50', 500:'#FF6B35',
          600:'#E85520', 700:'#C43E10', 800:'#9A2D07',
        },
        accent: '#FFD93D', surface: '#FFF8F5', dark: '#1A1A1A', muted: '#6B7280',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.06)',
        card: '0 8px 32px rgba(255,107,53,0.12)',
        float: '0 8px 32px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
