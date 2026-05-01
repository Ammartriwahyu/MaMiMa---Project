import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Camera, User } from 'lucide-react'

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || null,
    coverImage: user?.coverImage || null,
  })
  const [loading, setLoading] = useState(false)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImageChange = (field) => (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setField(field, reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      onSave(form)
      setLoading(false)
    }, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl shadow-float w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-xl text-dark">Edit Profil</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-muted">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Cover image */}
          <div>
            <label className="text-sm font-semibold text-dark font-body mb-2 block">Foto Sampul</label>
            <label className="cursor-pointer block">
              <div className="w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 relative">
                {form.coverImage ? (
                  <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* // cover photo */}
                    <Camera size={24} className="text-primary-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-body font-semibold">Ganti Foto</span>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange('coverImage')} />
            </label>
          </div>

          {/* Avatar */}
          <div>
            <label className="text-sm font-semibold text-dark font-body mb-2 block">Foto Profil</label>
            <label className="cursor-pointer inline-block">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-soft bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {form.avatar ? (
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* // avatar photo */}
                    <span className="text-white font-display font-bold text-2xl">
                      {form.displayName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange('avatar')} />
            </label>
          </div>

          {/* Display name */}
          <div>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 block">Nama Tampilan</label>
            <input
              type="text"
              value={form.displayName}
              onChange={e => setField('displayName', e.target.value)}
              className="input-field"
              placeholder="Nama kamu"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 block">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-body text-sm">@</span>
              <input
                type="text"
                value={form.username}
                onChange={e => setField('username', e.target.value)}
                className="input-field pl-8"
                placeholder="username_kamu"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setField('bio', e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Ceritakan tentang dirimu..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <button onClick={onClose} className="flex-1 btn-outline text-sm py-2.5">Batal</button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={loading}
            className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Simpan Profil'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
