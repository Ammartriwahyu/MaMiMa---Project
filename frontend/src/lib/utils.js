import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) { return twMerge(clsx(inputs)) }

export function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatPrice(n) {
  return new Intl.NumberFormat('id-ID').format(n)
}

export function whatsappUrl(number, message = '') {
  const clean = number?.replace(/\D/g, '')
  if (!clean) return null
  const base = `https://wa.me/${clean}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function mapsUrl(lat, lng) {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

export function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}
