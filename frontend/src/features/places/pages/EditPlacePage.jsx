import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { usePlace } from '../hooks/usePlaces'
import { placesApi } from '../api/placesApi'
import { useAuth } from '@/context/AuthContext'
import PlaceForm from '../components/PlaceForm'

export default function EditPlacePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { place, loading: fetching, error: fetchErr } = usePlace(id)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (fetching) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" /></div>
  if (!place || fetchErr) return <div className="min-h-screen flex flex-col items-center justify-center pt-20"><div className="text-5xl mb-4">😕</div><p className="font-display font-semibold text-xl text-dark mb-4">Tempat tidak ditemukan</p><button onClick={() => navigate(-1)} className="btn-primary">Kembali</button></div>
  if (user?.id !== place.userId) return <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center px-4"><div className="text-5xl mb-4">🚫</div><p className="font-display font-semibold text-xl mb-2">Akses Ditolak</p><p className="text-muted mb-4 text-sm">Kamu hanya bisa mengedit tempat milikmu sendiri.</p><button onClick={() => navigate(-1)} className="btn-primary">Kembali</button></div>

  const handleSubmit = async (data) => {
    setSaving(true)
    setError('')
    try {
      await placesApi.update(id, data)
      setSuccess(true)
      setTimeout(() => navigate(`/place/${id}`), 1000)
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-surface pt-24 pb-8 border-b border-gray-100">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted hover:text-dark mb-4"><ArrowLeft size={16} /> Kembali</button>
            <h1 className="font-display font-bold text-3xl text-dark mb-1">Edit Tempat</h1>
            <p className="text-muted text-sm">{place.name}</p>
          </motion.div>
        </div>
      </div>
      <div className="page-container py-10">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="font-display font-bold text-2xl text-dark mb-2">Berhasil Diupdate!</h2>
            </motion.div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl mb-4">{error}</div>}
              <PlaceForm initialData={place} onSubmit={handleSubmit} loading={saving} submitLabel="Simpan Perubahan" />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
