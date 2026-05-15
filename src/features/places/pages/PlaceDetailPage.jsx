import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Star, Clock, Phone, ArrowLeft, Heart, Bookmark, Share2,
  Edit2, Trash2, ExternalLink, MessageCircle, Copy, Check, Navigation
} from 'lucide-react'
import { usePlace } from '../hooks/usePlaces'
import { placesApi } from '../api/placesApi'
import { useAuth } from '@/context/AuthContext'
import { post } from '@/lib/apiClient'
import { LOKASI_OPTIONS, TYPE_OPTIONS, fadeUp } from '@/design-system/tokens'
import { formatPrice, whatsappUrl, mapsUrl } from '@/lib/utils'
import CommentSection from '@/features/comments/components/CommentSection'
import MenuSection from '../components/MenuSection'

export default function PlaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { place, setPlace, loading, error, refresh } = usePlace(id)
  const [copied, setCopied] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [bmLoading, setBmLoading] = useState(false)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  )
  if (error || !place) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4">
      <div className="text-6xl mb-4">😕</div>
      <h1 className="font-display font-bold text-2xl text-dark mb-2">Tempat tidak ditemukan</h1>
      <button onClick={() => navigate(-1)} className="btn-primary mt-4">Kembali</button>
    </div>
  )

  const lokasiConfig = LOKASI_OPTIONS.find(l => l.id === place.lokasi)
  const isOwner = user?.id === place.userId
  const waUrl   = whatsappUrl(place.whatsapp, `Halo, saya tertarik dengan ${place.name}`)
  const gmUrl   = place.latitude && place.longitude ? mapsUrl(place.latitude, place.longitude) : null

  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    setLikeLoading(true)
    try {
      const res = await post(`/places/${place.id}/like`)
      setPlace(p => ({ ...p, isLiked: res.liked, likesCount: res.likesCount }))
    } finally { setLikeLoading(false) }
  }

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return }
    setBmLoading(true)
    try {
      const res = await post(`/places/${place.id}/bookmark`)
      setPlace(p => ({ ...p, isBookmarked: res.bookmarked, savesCount: res.savesCount }))
    } finally { setBmLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus "${place.name}"? Tindakan ini tidak dapat dibatalkan.`)) return
    try {
      await placesApi.delete(place.id)
      navigate('/home')
    } catch (e) { alert(e.message) }
  }

  const copyCoords = () => {
    if (!place.latitude) return
    navigator.clipboard.writeText(`${place.latitude}, ${place.longitude}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-72 md:h-96 bg-gradient-to-br from-orange-50 to-amber-100 overflow-hidden">
        {place.image
          ? <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🍽️</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/95">
          <ArrowLeft size={18} />
        </motion.button>

        {isOwner && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute top-6 right-6 flex gap-2">
            <Link to={`/place/${place.id}/edit`}
              className="glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white/95 text-blue-600">
              <Edit2 size={16} />
            </Link>
            <button onClick={handleDelete}
              className="glass-card rounded-xl w-10 h-10 flex items-center justify-center hover:bg-red-50 text-red-500">
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}

        {/* Type badges */}
        <div className="absolute bottom-4 left-6 flex gap-2 flex-wrap">
          {(place.types || []).map(t => {
            const c = TYPE_OPTIONS.find(o => o.id === t)
            return c ? <span key={t} className="badge bg-white/90 text-dark text-xs">{c.emoji} {c.label}</span> : null
          })}
          {place.isVerified && <span className="badge bg-primary-500 text-white text-xs">✓ Terverifikasi</span>}
        </div>
      </div>

      <div className="page-container py-8">
        <div className="max-w-3xl mx-auto">

          {/* Title + actions */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display font-bold text-3xl text-dark mb-2">{place.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {place.rating > 0 && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold">{place.rating}</span>
                    <span className="text-muted">({place.reviewCount})</span>
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted text-sm">
                  <MapPin size={13} /> {lokasiConfig?.label}, Malang
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button whileTap={{ scale: 0.85 }} onClick={handleLike} disabled={likeLoading}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  place.isLiked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-muted hover:border-red-200 hover:text-red-400'
                }`}>
                <Heart size={15} className={place.isLiked ? 'fill-red-500' : ''} />
                {place.likesCount}
              </motion.button>

              <motion.button whileTap={{ scale: 0.85 }} onClick={handleBookmark} disabled={bmLoading}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm transition-all ${
                  place.isBookmarked ? 'bg-primary-50 border-primary-200 text-primary-600' : 'border-gray-200 text-muted hover:border-primary-200'
                }`}>
                <Bookmark size={15} className={place.isBookmarked ? 'fill-primary-500' : ''} />
              </motion.button>

              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => navigator.share?.({ title: place.name, url: window.location.href })}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-muted hover:border-gray-300 transition-colors">
                <Share2 size={15} />
              </motion.button>
            </div>
          </motion.div>

          {place.bio && (
            <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-dark/70 text-base leading-relaxed mb-6 bg-surface rounded-2xl p-4">
              {place.bio}
            </motion.p>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              { icon: MapPin,   label: 'Alamat',       value: place.address },
              { icon: Clock,    label: 'Jam Buka',      value: place.openHours },
              { icon: Star,     label: 'Harga',         value: place.priceRange ? `Rp ${place.priceRange}` : null },
              { icon: Phone,    label: 'Telepon',       value: place.phone },
            ].filter(i => i.value).map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3.5 bg-surface rounded-2xl">
                <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={14} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-xs text-muted">{item.label}</p>
                  <p className="text-sm font-semibold text-dark">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Coordinates */}
          {place.latitude && place.longitude && (
            <div className="bg-surface rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-muted mb-1 flex items-center gap-1"><Navigation size={12} /> Koordinat</p>
                  <p className="text-sm font-mono font-semibold text-dark">{place.latitude}, {place.longitude}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={copyCoords}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 text-dark hover:bg-gray-50 transition-colors">
                    {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    {copied ? 'Disalin!' : 'Salin'}
                  </button>
                  <a href={gmUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                    <ExternalLink size={13} /> Buka Maps
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors mb-6">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Pesan via WhatsApp
            </a>
          )}

          {/* Categories */}
          {place.categories?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-dark mb-2">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {place.categories.map(c => (
                  <span key={c.id} className={`badge border ${c.color || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {c.emoji} {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Menus */}
          <MenuSection placeId={place.id} isOwner={isOwner} />

          {/* Comments */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-display font-semibold text-xl text-dark mb-4 flex items-center gap-2">
              <MessageCircle size={20} className="text-primary-500" /> Komentar
            </h3>
            <CommentSection placeId={place.id} />
          </div>

          {/* Uploader */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link to={`/profile/${place.username}`} className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                {place.userAvatar
                  ? <img src={place.userAvatar} alt="" className="w-full h-full object-cover" />
                  : <span className="text-white font-bold">{place.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-dark group-hover:text-primary-600 transition-colors">@{place.username}</p>
                <p className="text-xs text-muted">{place.createdAt}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
