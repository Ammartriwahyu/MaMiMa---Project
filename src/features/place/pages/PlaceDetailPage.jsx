import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Clock, Phone, ArrowLeft, Heart, Bookmark, Share2, Edit2, Trash2, Tag } from 'lucide-react'
import { usePlaces } from '@/features/home/hooks/usePlaces'
import { useAuth } from '@/context/AuthContext'
import { CATEGORIES_JENIS, CATEGORIES_LOKASI, fadeUpVariant, staggerContainer } from '@/design-system/tokens'
import { formatDate } from '@/lib/utils'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, deletePlace } = usePlaces()
  const { user } = useAuth()

  const place = getById(id)

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="font-display font-bold text-2xl text-dark mb-2">Tempat tidak ditemukan</h1>
        <p className="text-muted font-body mb-6">Mungkin sudah dihapus atau link-nya salah.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Kembali</button>
      </div>
    )
  }

  const jenisConfig = CATEGORIES_JENIS.find(c => c.id === place.category)
  const lokasiConfig = CATEGORIES_LOKASI.find(l => l.id === place.lokasi)
  const isOwner = user?.id === place.userId

  const handleDelete = () => {
    if (confirm(`Hapus "${place.name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      deletePlace(place.id)
      navigate('/home')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image area */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-orange-50 to-amber-100 overflow-hidden">
        {place.image ? (
          <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* // foto utama tempat */}
            <span className="text-9xl opacity-20">{jenisConfig?.emoji}</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/90 transition-colors"
        >
          <ArrowLeft size={18} />
        </motion.button>

        {/* Owner actions */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 right-6 flex gap-2"
          >
            <Link
              to={`/place/${place.id}/edit`}
              className="glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/90 transition-colors text-blue-600"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={handleDelete}
              className="glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-red-50 transition-colors text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}

        {/* Badges on image */}
        <div className="absolute bottom-4 left-6 flex gap-2">
          {jenisConfig && (
            <span className={`badge text-xs ${jenisConfig.color}`}>
              {jenisConfig.emoji} {jenisConfig.label}
            </span>
          )}
          {place.isVerified && (
            <span className="badge bg-primary-500 text-white text-xs">✓ Terverifikasi</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-8">
        <div className="max-w-3xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Title + actions */}
            <motion.div variants={fadeUpVariant} className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-display font-bold text-3xl text-dark mb-2">{place.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  {place.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-sm">{place.rating}</span>
                      <span className="text-muted text-sm">({place.reviewCount} ulasan)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted text-sm">
                    <MapPin size={14} />
                    {lokasiConfig?.label}, Malang
                  </div>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors text-gray-400 hover:text-red-400">
                  <Heart size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-primary-50 hover:border-primary-200 transition-colors text-gray-400 hover:text-primary-500">
                  <Bookmark size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-400">
                  <Share2 size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Bio */}
            {place.bio && (
              <motion.p variants={fadeUpVariant} className="text-dark/70 font-body text-base leading-relaxed mb-6 bg-surface rounded-2xl p-4">
                {place.bio}
              </motion.p>
            )}

            {/* Info grid */}
            <motion.div variants={fadeUpVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { icon: MapPin, label: 'Alamat', value: place.address },
                { icon: Clock, label: 'Jam Buka', value: place.openHours },
                { icon: Tag, label: 'Kisaran Harga', value: `Rp ${place.priceRange}` },
                { icon: Phone, label: 'Telepon', value: place.phone },
              ].filter(item => item.value).map(item => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-surface rounded-2xl">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon size={15} className="text-primary-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted font-body">{item.label}</p>
                    <p className="text-sm font-semibold text-dark font-body">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Menu */}
            {place.menu?.length > 0 && (
              <motion.div variants={fadeUpVariant} className="mb-6">
                <h3 className="font-display font-semibold text-lg text-dark mb-3">Menu Tersedia</h3>
                <div className="flex flex-wrap gap-2">
                  {place.menu.map(item => (
                    <span key={item} className="bg-gray-100 text-dark text-sm px-3 py-1.5 rounded-xl font-body">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {place.tags?.length > 0 && (
              <motion.div variants={fadeUpVariant} className="mb-6">
                <h3 className="font-display font-semibold text-lg text-dark mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map(tag => (
                    <span key={tag} className="text-primary-600 text-sm font-body font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Uploader info */}
            <motion.div variants={fadeUpVariant} className="border-t border-gray-100 pt-6">
              <p className="text-xs text-muted font-body mb-3">Ditambahkan oleh</p>
              <Link to={`/profile/${place.username}`} className="flex items-center gap-3 group w-fit">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                  {place.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors font-body">
                    @{place.username}
                  </p>
                  <p className="text-xs text-muted font-body">{formatDate(place.createdAt)}</p>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
