// =============================================
// MaMiMa Design System Tokens
// =============================================

export const colors = {
  primary: {
    DEFAULT: '#FF6B35',
    50: '#FFF3EE',
    100: '#FFE4D5',
    500: '#FF6B35',
    600: '#E85520',
    700: '#C43E10',
  },
  accent: '#FFD93D',
  surface: '#FFF8F5',
  dark: '#1A1A1A',
  muted: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
}

export const typography = {
  fontFamily: {
    display: '"Fraunces", Georgia, serif',
    body: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
}

export const spacing = {
  section: '5rem',
  container: '80rem',
}

export const borderRadius = {
  sm: '0.5rem',
  DEFAULT: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
}

export const shadows = {
  soft: '0 4px 24px rgba(0,0,0,0.06)',
  card: '0 8px 32px rgba(255,107,53,0.12)',
  float: '0 8px 32px rgba(0,0,0,0.12)',
}

// Category config
export const CATEGORIES_JENIS = [
  { id: 'makan', label: 'Makan', emoji: '🍽️', color: 'bg-orange-100 text-orange-700' },
  { id: 'minum', label: 'Minum', emoji: '🥤', color: 'bg-blue-100 text-blue-700' },
]

export const CATEGORIES_LOKASI = [
  { id: 'merjosari', label: 'Merjosari', emoji: '📍', color: 'bg-green-100 text-green-700' },
  { id: 'watugong', label: 'Watugong', emoji: '📍', color: 'bg-purple-100 text-purple-700' },
  { id: 'suhat', label: 'Suhat', emoji: '📍', color: 'bg-pink-100 text-pink-700' },
  { id: 'sigura-gura', label: 'Sigura-gura', emoji: '📍', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'dinoyo', label: 'Dinoyo', emoji: '📍', color: 'bg-teal-100 text-teal-700' },
]

// Animation variants (Framer Motion)
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
