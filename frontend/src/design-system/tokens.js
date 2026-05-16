export const LOKASI_OPTIONS = [
  { id: 'merjosari',  label: 'Merjosari',  emoji: '🏘️' },
  { id: 'watugong',   label: 'Watugong',   emoji: '🏔️' },
  { id: 'suhat',      label: 'Suhat',      emoji: '🏛️' },
  { id: 'sigura-gura',label: 'Sigura-gura',emoji: '🌊' },
  { id: 'dinoyo',     label: 'Dinoyo',     emoji: '🌿' },
]

export const TYPE_OPTIONS = [
  { id: 'makan', label: 'Makan', emoji: '🍽️', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'minum', label: 'Minum', emoji: '🥤', color: 'bg-blue-100 text-blue-700 border-blue-200' },
]

export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}
