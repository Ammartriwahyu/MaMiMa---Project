import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CATEGORIES_JENIS, CATEGORIES_LOKASI } from '@/design-system/tokens'

export function CategoryBadge({ type, value, size = 'md', onClick, active }) {
  const all = [...CATEGORIES_JENIS, ...CATEGORIES_LOKASI]
  const config = all.find(c => c.id === value)

  const sizes = {
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'badge font-body font-semibold transition-all duration-200 cursor-pointer',
        sizes[size],
        active
          ? 'bg-primary-500 text-white shadow-card'
          : config?.color || 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        onClick && 'cursor-pointer'
      )}
    >
      {config?.emoji} {config?.label || value}
    </motion.button>
  )
}

export function FilterChips({ filters, activeFilter, onFilter, label }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && <span className="text-xs font-semibold text-muted font-body uppercase tracking-wider">{label}:</span>}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onFilter(null)}
        className={cn(
          'badge text-xs font-body font-semibold transition-all duration-200',
          !activeFilter
            ? 'bg-dark text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        Semua
      </motion.button>
      {filters.map(f => (
        <CategoryBadge
          key={f.id}
          value={f.id}
          active={activeFilter === f.id}
          onClick={() => onFilter(activeFilter === f.id ? null : f.id)}
        />
      ))}
    </div>
  )
}
