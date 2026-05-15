import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { placesApi } from '@/features/places/api/placesApi'
import { get } from '@/lib/apiClient'
import PlaceCard from '@/components/shared/PlaceCard'
import { fadeUp, stagger, LOKASI_OPTIONS, TYPE_OPTIONS } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export default function ExplorePage() {
  const [sp, setSp] = useSearchParams()
  const [places, setPlaces]   = useState([])
  const [categories, setCat]  = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState(sp.get('search') || '')
  const [types, setTypes]     = useState(sp.getAll('type') || [])
  const [lokasi, setLokasi]   = useState(sp.get('lokasi') || null)
  const [category, setCategory] = useState(sp.get('category') || null)
  const [showFilters, setShow]= useState(false)

  useEffect(() => { get('/categories').then(({data}) => setCat(data)).catch(()=>{}) }, [])

  const fetchPlaces = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (query)    params.search   = query
      if (types.length) params.type = types
      if (lokasi)   params.lokasi   = lokasi
      if (category) params.category = category
      const { data } = await placesApi.getAll(params)
      setPlaces(data)

      // sync URL
      const next = new URLSearchParams()
      if (query)    next.set('search', query)
      types.forEach(t => next.append('type', t))
      if (lokasi)   next.set('lokasi', lokasi)
      if (category) next.set('category', category)
      setSp(next, { replace: true })
    } catch {}
    finally { setLoading(false) }
  }, [query, types, lokasi, category]) // eslint-disable-line

  useEffect(() => {
    const id = setTimeout(fetchPlaces, query ? 400 : 0)
    return () => clearTimeout(id)
  }, [fetchPlaces])

  const toggleType = t => setTypes(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t])
  const reset = () => { setQuery(''); setTypes([]); setLokasi(null); setCategory(null) }
  const hasFilter = query || types.length || lokasi || category

  return (
    <div className="min-h-screen bg-white">
      {/* Search hero */}
      <section className="pt-24 pb-8 bg-gradient-to-b from-surface to-white">
        <div className="page-container">
          <div className="text-center mb-7">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-dark mb-2">
              Jelajahi Kuliner <span className="gradient-text">Malang</span>
            </h1>
            <p className="text-muted text-base">{places.length}+ tempat makan & minum tersedia</p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Cari nama, deskripsi, area..."
              className="input-field pl-14 pr-14 py-4 text-base rounded-2xl shadow-soft" />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                <X size={18}/>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="page-container">
          {/* Filter toggle row */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Jenis:</span>
              {['all', ...TYPE_OPTIONS.map(t=>t.id)].map(t => {
                const cfg = TYPE_OPTIONS.find(o=>o.id===t)
                const active = t === 'all' ? !types.length : types.includes(t)
                return (
                  <button key={t}
                    onClick={() => t === 'all' ? setTypes([]) : toggleType(t)}
                    className={cn('badge border text-xs px-3 py-1.5 transition-all cursor-pointer',
                      active ? 'bg-primary-500 text-white border-primary-500'
                             : t === 'all' ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                             : cn(cfg?.color, 'hover:opacity-80'))}>
                    {t === 'all' ? 'Semua' : `${cfg?.emoji} ${cfg?.label}`}
                  </button>
                )
              })}
            </div>
            <button onClick={() => setShow(!showFilters)}
              className={cn('flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors',
                showFilters ? 'bg-primary-500 text-white' : 'text-dark hover:bg-gray-100')}>
              <SlidersHorizontal size={14}/> Filter Lanjutan
            </button>
          </div>

          {/* Extended filters */}
          {showFilters && (
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
              className="bg-surface rounded-2xl p-4 mb-4 space-y-3">
              {/* Lokasi */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Area:</span>
                {[{id:null,label:'Semua',emoji:'🗺️'}, ...LOKASI_OPTIONS].map(l => (
                  <button key={l.id||'all'} onClick={() => setLokasi(l.id)}
                    className={cn('badge border text-xs px-3 py-1.5 transition-all cursor-pointer',
                      lokasi === l.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200')}>
                    {l.emoji} {l.label}
                  </button>
                ))}
              </div>
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider">Kategori:</span>
                  <button onClick={() => setCategory(null)}
                    className={cn('badge border text-xs px-3 py-1.5 transition-all cursor-pointer',
                      !category ? 'bg-dark text-white border-dark' : 'bg-gray-100 text-gray-600 border-gray-200')}>
                    Semua
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setCategory(category === c.slug ? null : c.slug)}
                      className={cn('badge border text-xs px-3 py-1.5 transition-all cursor-pointer',
                        category === c.slug ? 'bg-primary-500 text-white border-primary-500' : (c.color||'bg-gray-100 text-gray-600 border-gray-200') + ' hover:opacity-80')}>
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Count + reset */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted">
              <span className="font-semibold text-dark">{places.length}</span> tempat ditemukan
              {query && <span> untuk "<span className="text-primary-600">{query}</span>"</span>}
            </p>
            {hasFilter && (
              <button onClick={reset} className="text-xs text-primary-500 font-semibold flex items-center gap-1">
                <X size={12}/> Reset semua
              </button>
            )}
          </div>

          {/* Results */}
          {loading
            ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{[...Array(8)].map((_,i) => <div key={i} className="card h-64 animate-pulse bg-gray-50"/>)}</div>
            : places.length === 0
              ? <div className="text-center py-20"><div className="text-6xl mb-4">🔍</div><p className="font-display font-semibold text-2xl text-dark mb-2">Tidak ditemukan</p><p className="text-muted">Coba kata kunci atau filter yang berbeda</p></div>
              : <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {places.map(p => <motion.div key={p.id} variants={fadeUp}><PlaceCard place={p}/></motion.div>)}
                </motion.div>
          }
        </div>
      </section>
    </div>
  )
}
