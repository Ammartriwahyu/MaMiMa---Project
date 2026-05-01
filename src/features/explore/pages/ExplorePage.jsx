import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { usePlaces } from '@/features/home/hooks/usePlaces'
import PlaceCard from '@/components/shared/PlaceCard'
import { FilterChips } from '@/components/shared/CategoryBadge'
import { AnimatedSection, StaggerSection } from '@/components/shared/AnimatedSection'
import { fadeUpVariant, staggerContainer, CATEGORIES_JENIS, CATEGORIES_LOKASI } from '@/design-system/tokens'

export default function ExplorePage() {
  const { places, loading } = usePlaces()
  const [searchParams, setSearchParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [aktifJenis, setAktifJenis] = useState(searchParams.get('kategori') || null)
  const [aktifLokasi, setAktifLokasi] = useState(searchParams.get('lokasi') || null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const params = {}
    if (aktifJenis) params.kategori = aktifJenis
    if (aktifLokasi) params.lokasi = aktifLokasi
    setSearchParams(params, { replace: true })
  }, [aktifJenis, aktifLokasi])

  const filtered = useMemo(() => {
    let list = [...places]
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.bio?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.lokasi.toLowerCase().includes(q)
      )
    }
    if (aktifJenis) list = list.filter(p => p.category === aktifJenis)
    if (aktifLokasi) list = list.filter(p => p.lokasi === aktifLokasi)
    return list
  }, [places, query, aktifJenis, aktifLokasi])

  const hasFilter = aktifJenis || aktifLokasi || query

  return (
    <div className="min-h-screen bg-white">
      {/* Hero search area */}
      <section className="pt-24 pb-10 bg-gradient-to-b from-surface to-white">
        <div className="page-container">
          <AnimatedSection className="text-center mb-8">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-dark mb-3">
              Jelajahi Kuliner <span className="gradient-text">Malang</span>
            </h1>
            <p className="text-muted font-body text-base">
              Temukan {places.length}+ tempat makan & minum terbaik di Malang
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cari nama tempat, menu, atau area..."
                className="input-field pl-14 pr-14 py-4 text-base rounded-2xl shadow-soft"
              />
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                >
                  <X size={18} />
                </motion.button>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters + results */}
      <section className="py-6">
        <div className="page-container">
          {/* Filter row */}
          <AnimatedSection className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <FilterChips
                filters={CATEGORIES_JENIS}
                activeFilter={aktifJenis}
                onFilter={setAktifJenis}
                label="Jenis"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-sm font-body font-semibold px-3 py-1.5 rounded-xl transition-colors ${showFilters ? 'bg-primary-500 text-white' : 'text-dark hover:bg-gray-100'}`}
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>
          </AnimatedSection>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-surface rounded-2xl p-4">
                  <FilterChips
                    filters={CATEGORIES_LOKASI}
                    activeFilter={aktifLokasi}
                    onFilter={setAktifLokasi}
                    label="Area"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters summary + count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted font-body">
              <span className="font-semibold text-dark">{filtered.length}</span> tempat ditemukan
              {query && <span> untuk "<span className="text-primary-600">{query}</span>"</span>}
            </p>
            {hasFilter && (
              <button
                onClick={() => { setQuery(''); setAktifJenis(null); setAktifLokasi(null) }}
                className="text-xs text-primary-500 font-semibold font-body hover:text-primary-600 flex items-center gap-1"
              >
                <X size={12} /> Reset semua
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-64 animate-pulse bg-gray-50" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="font-display font-semibold text-2xl text-dark mb-2">Tidak ditemukan</p>
              <p className="text-muted font-body">Coba kata kunci atau filter yang berbeda</p>
            </motion.div>
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
    </div>
  )
}
