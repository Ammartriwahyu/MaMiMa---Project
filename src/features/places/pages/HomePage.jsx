import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { placesApi } from '../api/placesApi'
import PlaceCard from '@/components/shared/PlaceCard'
import { fadeUp, stagger, LOKASI_OPTIONS, TYPE_OPTIONS } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { user } = useAuth()
  const [places, setPlaces]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTypes, setActiveTypes] = useState([])   // multi-select
  const [activeLokasi, setActiveLokasi] = useState(null)

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeTypes.length)  params.type   = activeTypes
    if (activeLokasi)        params.lokasi  = activeLokasi
    placesApi.getAll(params)
      .then(({ data }) => setPlaces(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeTypes, activeLokasi])

  const toggleType = (t) => setActiveTypes(prev =>
    prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
  )

  const popular = useMemo(() => [...places].sort((a,b) => b.likesCount - a.likesCount).slice(0,4), [places])
  const recent  = useMemo(() => places.slice(0,4), [places])

  const hasFilter = activeTypes.length || activeLokasi

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome */}
      <section className="pt-28 pb-8 bg-gradient-to-b from-surface to-white">
        <div className="page-container">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-primary-500 font-semibold text-sm mb-1">{greeting()}, {user?.displayName?.split(' ')[0]} 👋</p>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-dark">Mau makan apa hari ini?</h1>
                <p className="text-muted text-sm mt-1">{places.length} tempat tersedia di Malang</p>
              </div>
              <Link to="/create">
                <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                  className="btn-primary flex items-center gap-2">
                  <Plus size={16}/> Tambah Tempat
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6">
        <div className="page-container">
          {/* Type filter (multi) */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Jenis:</span>
            <button onClick={() => setActiveTypes([])}
              className={cn('badge border text-xs transition-all cursor-pointer px-3 py-1.5',
                !activeTypes.length ? 'bg-dark text-white border-dark' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200')}>
              Semua
            </button>
            {TYPE_OPTIONS.map(t => (
              <button key={t.id} onClick={() => toggleType(t.id)}
                className={cn('badge border text-xs transition-all cursor-pointer px-3 py-1.5',
                  activeTypes.includes(t.id) ? 'bg-primary-500 text-white border-primary-500' : cn(t.color, 'hover:opacity-80'))}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          {/* Lokasi filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Area:</span>
            <button onClick={() => setActiveLokasi(null)}
              className={cn('badge border text-xs transition-all cursor-pointer px-3 py-1.5',
                !activeLokasi ? 'bg-dark text-white border-dark' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200')}>
              Semua
            </button>
            {LOKASI_OPTIONS.map(l => (
              <button key={l.id} onClick={() => setActiveLokasi(activeLokasi === l.id ? null : l.id)}
                className={cn('badge border text-xs transition-all cursor-pointer px-3 py-1.5',
                  activeLokasi === l.id
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200')}>
                {l.emoji} {l.label}
              </button>
            ))}
          </div>

          {/* Count + reset */}
          <div className="flex items-center justify-between mt-4 mb-6">
            <p className="text-sm text-muted">
              <span className="font-semibold text-dark">{places.length}</span> tempat
            </p>
            {hasFilter && (
              <button onClick={() => { setActiveTypes([]); setActiveLokasi(null) }}
                className="text-xs text-primary-500 font-semibold hover:text-primary-600">Reset filter</button>
            )}
          </div>

          {/* Grid */}
          {loading
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{[...Array(8)].map((_,i) => <div key={i} className="card h-64 animate-pulse bg-gray-50"/>)}</div>
            : places.length === 0
              ? <div className="text-center py-20"><div className="text-5xl mb-4">🔍</div><p className="font-display font-semibold text-xl text-dark mb-2">Tidak ada hasil</p><p className="text-muted text-sm">Coba ubah filter di atas</p></div>
              : <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {places.map(p => <motion.div key={p.id} variants={fadeUp}><PlaceCard place={p}/></motion.div>)}
                </motion.div>
          }
        </div>
      </section>

      {/* Popular & Recent (only when no filter) */}
      {!hasFilter && !loading && (
        <>
          <section className="py-10 bg-surface">
            <div className="page-container">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><TrendingUp size={20} className="text-primary-500"/><h2 className="font-display font-bold text-2xl text-dark">Paling Disukai</h2></div>
                <Link to="/explore" className="text-primary-500 text-sm font-semibold flex items-center gap-1">Lihat semua <ArrowRight size={14}/></Link>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {popular.map(p => <motion.div key={p.id} variants={fadeUp}><PlaceCard place={p}/></motion.div>)}
              </motion.div>
            </div>
          </section>
          <section className="py-10">
            <div className="page-container">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><Clock size={20} className="text-primary-500"/><h2 className="font-display font-bold text-2xl text-dark">Baru Ditambahkan</h2></div>
                <Link to="/explore" className="text-primary-500 text-sm font-semibold flex items-center gap-1">Lihat semua <ArrowRight size={14}/></Link>
              </div>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recent.map(p => <motion.div key={p.id} variants={fadeUp}><PlaceCard place={p}/></motion.div>)}
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
