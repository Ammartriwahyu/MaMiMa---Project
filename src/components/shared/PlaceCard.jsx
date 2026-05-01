import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, Bookmark, Clock } from 'lucide-react'
import { CATEGORIES_JENIS, CATEGORIES_LOKASI, scaleInVariant } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export default function PlaceCard({ place, className, compact = false }) {
  const jenisConfig = CATEGORIES_JENIS.find(c => c.id === place.category)
  const lokasiConfig = CATEGORIES_LOKASI.find(l => l.id === place.lokasi)

  return (
    <motion.div
      variants={scaleInVariant}
      whileHover={{ y: -4, shadow: 'lg' }}
      className={cn('card group cursor-pointer', className)}
    >
      <Link to={`/place/${place.id}`} className="block">
        {/* Image area */}
        <div className={cn('relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50', compact ? 'h-36' : 'h-48')}>
          {place.image ? (
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* // foto tempat */}
              <span className="text-5xl opacity-30">{jenisConfig?.emoji}</span>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {jenisConfig && (
              <span className={cn('badge text-[10px]', jenisConfig.color)}>
                {jenisConfig.emoji} {jenisConfig.label}
              </span>
            )}
            {place.isVerified && (
              <span className="badge bg-primary-500 text-white text-[10px]">✓ Terverifikasi</span>
            )}
          </div>

          {/* Like button overlay */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={e => e.preventDefault()}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={14} className="text-gray-400 hover:text-red-400 transition-colors" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-display font-semibold text-dark text-base leading-tight line-clamp-1 group-hover:text-primary-600 transition-colors">
              {place.name}
            </h3>
            {place.rating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-dark">{place.rating}</span>
              </div>
            )}
          </div>

          {!compact && place.bio && (
            <p className="text-xs text-muted font-body leading-relaxed mb-3 line-clamp-2">
              {place.bio}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted">
              <MapPin size={11} />
              <span className="text-xs font-body">{lokasiConfig?.label || place.lokasi}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              {place.openHours && (
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span className="text-[10px] font-body">{place.openHours.split('–')[0]}</span>
                </div>
              )}
            </div>
          </div>

          {!compact && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary-600 font-body">
                Rp {place.priceRange}
              </span>
              <div className="flex items-center gap-3 text-muted">
                <span className="flex items-center gap-1 text-[11px]">
                  <Heart size={11} /> {place.likes}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Bookmark size={11} /> {place.saves}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
