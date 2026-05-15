import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { placesApi } from '../api/placesApi'
import PlaceForm from '../components/PlaceForm'

export default function CreatePlacePage() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (data) => {
    setLoading(true)
    setError('')
    try {
      const { data: place } = await placesApi.create(data)
      setSuccess(true)
      setTimeout(() => navigate(`/place/${place.id}`), 1200)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-surface pt-24 pb-8 border-b border-gray-100">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted hover:text-dark mb-4 transition-colors">
              <ArrowLeft size={16} /> Kembali
            </button>
            <h1 className="font-display font-bold text-3xl text-dark mb-1">Tambah Tempat Baru</h1>
            <p className="text-muted text-sm">Bagikan tempat makan atau minum favoritmu di Malang</p>
          </motion.div>
        </div>
      </div>
      <div className="page-container py-10">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display font-bold text-2xl text-dark mb-2">Berhasil Ditambahkan!</h2>
              <p className="text-muted">Mengarahkan ke halaman detail...</p>
            </motion.div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl mb-4">{error}</div>}
              <PlaceForm onSubmit={handleSubmit} loading={loading} submitLabel="Upload Tempat 🚀" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
