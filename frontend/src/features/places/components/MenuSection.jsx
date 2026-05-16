import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react'
import { placesApi } from '../api/placesApi'
import { formatPrice } from '@/lib/utils'
import { fadeUp } from '@/design-system/tokens'

export default function MenuSection({ placeId, isOwner }) {
  const [menus, setMenus]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    placesApi.getMenus(placeId)
      .then(({ data }) => setMenus(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [placeId])

  const handleAdd = async (data) => {
    const { data: menu } = await placesApi.addMenu(placeId, data)
    setMenus(prev => [...prev, menu])
    setShowForm(false)
  }

  const handleUpdate = async (data) => {
    const { data: updated } = await placesApi.updateMenu(editItem.id, data)
    setMenus(prev => prev.map(m => m.id === updated.id ? updated : m))
    setEditItem(null)
  }

  const handleDelete = async (menuId) => {
    if (!confirm('Hapus menu ini?')) return
    await placesApi.deleteMenu(menuId)
    setMenus(prev => prev.filter(m => m.id !== menuId))
  }

  if (loading) return <div className="py-6 text-center text-sm text-muted">Memuat menu...</div>

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-lg text-dark">Menu</h3>
        {isOwner && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-xs btn-outline py-1.5 px-3">
            <Plus size={13} /> Tambah Menu
          </button>
        )}
      </div>

      {menus.length === 0 && !showForm && (
        <p className="text-sm text-muted text-center py-6 bg-surface rounded-2xl">Belum ada menu.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menus.map(menu => (
          <motion.div key={menu.id} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-start gap-3 p-3 bg-surface rounded-2xl border border-gray-100">
            {menu.image && (
              <img src={menu.image} alt={menu.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-dark">{menu.name}</p>
              <p className="text-primary-600 font-semibold text-sm">Rp {formatPrice(menu.price)}</p>
              {menu.description && <p className="text-xs text-muted mt-0.5 line-clamp-2">{menu.description}</p>}
            </div>
            {isOwner && (
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditItem(menu)}
                  className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-blue-500 transition-colors">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => handleDelete(menu.id)}
                  className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add / Edit form modal */}
      <AnimatePresence>
        {(showForm || editItem) && (
          <MenuForm
            initial={editItem}
            onSubmit={editItem ? handleUpdate : handleAdd}
            onClose={() => { setShowForm(false); setEditItem(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuForm({ initial, onSubmit, onClose }) {
  const [form, setForm]     = useState({ name: initial?.name || '', price: initial?.price || '', description: initial?.description || '' })
  const [image, setImage]   = useState(null)
  const [preview, setPreview] = useState(initial?.image || null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImage(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) { setError('Nama dan harga wajib diisi.'); return }
    setLoading(true)
    setError('')
    try {
      const data = { ...form, price: parseInt(form.price) }
      if (image) data.image = image
      await onSubmit(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-float w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-dark">{initial ? 'Edit Menu' : 'Tambah Menu'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Image upload */}
          <label className="cursor-pointer block">
            <div className={`w-full h-32 rounded-xl border-2 border-dashed overflow-hidden transition-colors ${preview ? 'border-primary-300' : 'border-gray-200 hover:border-primary-300'}`}>
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                    <Upload size={20} className="mb-1" /><span className="text-xs">Upload foto menu</span>
                  </div>
              }
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>

          <div>
            <label className="text-xs font-semibold text-dark mb-1 block">Nama Menu *</label>
            <input className="input-field" placeholder="cth: Ayam Bakar" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-dark mb-1 block">Harga (Rp) *</label>
            <input className="input-field" type="number" min="0" placeholder="15000" value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-dark mb-1 block">Deskripsi</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Keterangan singkat..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 btn-outline text-sm py-2.5">Batal</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Simpan'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
