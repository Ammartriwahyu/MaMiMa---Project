import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Clock, Sparkles, Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { usePlaces } from '../hooks/usePlaces'
import PlaceCard from '@/components/shared/PlaceCard'
import { FilterChips } from '@/components/shared/CategoryBadge'
import { AnimatedSection, StaggerSection } from '@/components/shared/AnimatedSection'
import { fadeUpVariant, staggerContainer, CATEGORIES_JENIS, CATEGORIES_LOKASI } from '@/design-system/tokens'

export default function HomePage() {
  const { user } = useAuth()
  const { places, loading } = usePlaces()
  const [aktifJenis, setAktifJenis] = useState(null)
  const [aktifLokasi, setAktifLokasi] = useState(null)

  const filtered = useMemo(() => {
    let list = [...places]
    if (aktifJenis) list = list.filter(p => p.category === aktifJenis)
    if (aktifLokasi) list = list.filter(p => p.lokasi === aktifLokasi)
    return list
  }, [places, aktifJenis, aktifLokasi])

  const recent = useMemo(() => [...places].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4), [places])
  const popular = useMemo(() => [...places].sort((a, b) => b.likes - a.likes).slice(0, 4), [places])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ===== WELCOME BANNER ===== */}
      <section className="pt-28 pb-10 bg-gradient-to-b from-surface to-white">
        <div className="page-container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariant} className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-primary-500 font-body font-semibold text-sm mb-1">
                  {greeting()}, {user?.displayName?.split(' ')[0]} 👋
                </p>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-dark">
                  Mau makan apa hari ini?
                </h1>
                <p className="text-muted font-body text-sm mt-2">
                  {places.length} tempat tersedia di Malang
                </p>
              </div>

              <motion.div variants={fadeUpVariant}>
                <Link to="/create">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Tambah Tempat
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FILTER + GRID ===== */}
      <section className="py-8">
        <div className="page-container">
          {/* Filters */}
          <AnimatedSection className="space-y-3 mb-8">
            <FilterChips
              filters={CATEGORIES_JENIS}
              activeFilter={aktifJenis}
              onFilter={setAktifJenis}
              label="Jenis"
            />
            <FilterChips
              filters={CATEGORIES_LOKASI}
              activeFilter={aktifLokasi}
              onFilter={setAktifLokasi}
              label="Area"
            />
          </AnimatedSection>

          {/* Results count */}
          <AnimatedSection className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted font-body">
              Menampilkan <span className="font-semibold text-dark">{filtered.length}</span> tempat
            </p>
            {(aktifJenis || aktifLokasi) && (
              <button
                onClick={() => { setAktifJenis(null); setAktifLokasi(null) }}
                className="text-xs text-primary-500 font-semibold font-body hover:text-primary-600 transition-colors"
              >
                Reset filter
              </button>
            )}
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-gray-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="font-display font-semibold text-xl text-dark mb-2">Tidak ada hasil</p>
              <p className="text-muted font-body text-sm">Coba ubah filter di atas</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map(place => (
                <motion.div key={place.id} variants={fadeUpVariant}>
                  <PlaceCard place={place} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="py-12 bg-surface">
        <div className="page-container">
          <AnimatedSection className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary-500" />
              <h2 className="font-display font-bold text-2xl text-dark">Paling Disukai</h2>
            </div>
            <Link to="/explore" className="text-primary-500 text-sm font-semibold font-body flex items-center gap-1 hover:gap-2 transition-all">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popular.map(place => (
              <motion.div key={place.id} variants={fadeUpVariant}>
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ===== RECENTLY ADDED ===== */}
      <section className="py-12">
        <div className="page-container">
          <AnimatedSection className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-primary-500" />
              <h2 className="font-display font-bold text-2xl text-dark">Baru Ditambahkan</h2>
            </div>
            <Link to="/explore" className="text-primary-500 text-sm font-semibold font-body flex items-center gap-1 hover:gap-2 transition-all">
              Lihat semua <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.map(place => (
              <motion.div key={place.id} variants={fadeUpVariant}>
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>
    </div>
  )
}
