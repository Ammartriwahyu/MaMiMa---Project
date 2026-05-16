import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, Bookmark, Clock } from 'lucide-react'
import { scaleIn, LOKASI_OPTIONS, TYPE_OPTIONS } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export default function PlaceCard({ place, className }) {
  const lokasiConfig = LOKASI_OPTIONS.find(l => l.id === place.lokasi)

  return (
    <motion.div variants={scaleIn} whileHover={{ y: -4 }} className={cn('card group cursor-pointer', className)}>
      <Link to={`/place/${place.id}`} className="block">
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
          {place.image
            ? <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🍽️</div>
          }
          {/* Type badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {(place.types || []).map(t => {
              const config = TYPE_OPTIONS.find(o => o.id === t)
              return config ? (
                <span key={t} className={cn('badge text-[10px] border', config.color)}>
                  {config.emoji} {config.label}
                </span>
              ) : null
            })}
            {place.isVerified && <span className="badge bg-primary-500 text-white text-[10px]">✓</span>}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-dark text-base line-clamp-1 group-hover:text-primary-600 transition-colors">
              {place.name}
            </h3>
            {place.rating > 0 && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-dark">{place.rating}</span>
              </div>
            )}
          </div>

          {place.bio && <p className="text-xs text-muted leading-relaxed mb-2.5 line-clamp-2">{place.bio}</p>}

          <div className="flex items-center justify-between text-muted text-xs mb-3">
            <span className="flex items-center gap-1"><MapPin size={11} />{lokasiConfig?.label || place.lokasi}</span>
            {place.openHours && <span className="flex items-center gap-1"><Clock size={10} />{place.openHours.split('–')[0]?.trim()}</span>}
          </div>

          <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary-600">
              {place.priceRange ? `Rp ${place.priceRange}` : '—'}
            </span>
            <div className="flex items-center gap-2.5 text-muted text-[11px]">
              <span className="flex items-center gap-1"><Heart size={11} />{place.likesCount ?? 0}</span>
              <span className="flex items-center gap-1"><Bookmark size={11} />{place.savesCount ?? 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
