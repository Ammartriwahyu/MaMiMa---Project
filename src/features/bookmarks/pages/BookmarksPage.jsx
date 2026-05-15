import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { bookmarksApi } from '../api/bookmarksApi'
import PlaceCard from '@/components/shared/PlaceCard'
import { fadeUp, stagger } from '@/design-system/tokens'

export default function BookmarksPage() {
  const [places, setPlaces]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookmarksApi.getAll()
      .then(({ data }) => setPlaces(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-surface pt-24 pb-8 border-b border-gray-100">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <Bookmark size={24} className="text-primary-500" />
              <h1 className="font-display font-bold text-3xl text-dark">Tempat Tersimpan</h1>
            </div>
            <p className="text-muted text-sm">{places.length} tempat disimpan</p>
          </motion.div>
        </div>
      </div>

      <div className="page-container py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_,i) => <div key={i} className="card h-64 animate-pulse bg-gray-50"/>)}
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔖</div>
            <p className="font-display font-semibold text-2xl text-dark mb-2">Belum ada tempat tersimpan</p>
            <p className="text-muted text-sm">Tekan ikon bookmark di halaman detail tempat untuk menyimpan</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {places.map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <PlaceCard place={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
