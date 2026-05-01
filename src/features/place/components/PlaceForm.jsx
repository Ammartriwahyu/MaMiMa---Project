import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Image, Tag, Clock, Phone, FileText, DollarSign, Upload } from 'lucide-react'
import { CATEGORIES_JENIS, CATEGORIES_LOKASI, fadeUpVariant, staggerContainer } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

const INITIAL_STATE = {
  name: '',
  bio: '',
  category: '',
  lokasi: '',
  address: '',
  openHours: '',
  phone: '',
  priceRange: '',
  menu: '',
  tags: '',
  image: null,
}

export default function PlaceForm({ initialData = {}, onSubmit, loading, submitLabel = 'Simpan' }) {
  const [form, setForm] = useState({ ...INITIAL_STATE, ...initialData, menu: initialData.menu?.join(', ') || '', tags: initialData.tags?.join(', ') || '' })
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(initialData.image || null)

  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nama wajib diisi'
    if (!form.category) e.category = 'Pilih jenis tempat'
    if (!form.lokasi) e.lokasi = 'Pilih lokasi'
    if (!form.address.trim()) e.address = 'Alamat wajib diisi'
    return e
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setField('image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({
      ...form,
      menu: form.menu ? form.menu.split(',').map(s => s.trim()).filter(Boolean) : [],
      tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Image upload */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-2 block">Foto Tempat</label>
          <label className="cursor-pointer block">
            <div className={cn(
              'w-full h-48 rounded-2xl border-2 border-dashed transition-colors overflow-hidden relative',
              imagePreview ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/20'
            )}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
                  <Upload size={28} className="text-muted mb-2" />
                  {/* // upload foto tempat */}
                  <p className="text-sm font-body text-muted">Klik untuk upload foto</p>
                  <p className="text-xs text-muted/60 font-body mt-1">PNG, JPG, WEBP max 5MB</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </motion.div>

        {/* Nama */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 block">
            Nama Tempat <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setField('name', e.target.value)}
            placeholder="cth: Warung Soto Lamongan Pak Dhe"
            className={cn('input-field', errors.name && 'border-red-400 ring-red-200')}
          />
          {errors.name && <p className="text-red-500 text-xs font-body mt-1">{errors.name}</p>}
        </motion.div>

        {/* Bio */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 block">
            Deskripsi <span className="text-muted text-xs font-normal">(opsional)</span>
          </label>
          <textarea
            value={form.bio}
            onChange={e => setField('bio', e.target.value)}
            placeholder="Ceritakan tentang tempat ini..."
            rows={3}
            className="input-field resize-none"
          />
        </motion.div>

        {/* Category + Lokasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeUpVariant}>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 block">
              Jenis <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              {CATEGORIES_JENIS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setField('category', c.id)}
                  className={cn(
                    'flex-1 py-3 rounded-2xl border-2 font-body font-semibold text-sm transition-all',
                    form.category === c.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-muted hover:border-primary-200'
                  )}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            {errors.category && <p className="text-red-500 text-xs font-body mt-1">{errors.category}</p>}
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 block">
              Area/Lokasi <span className="text-red-400">*</span>
            </label>
            <select
              value={form.lokasi}
              onChange={e => setField('lokasi', e.target.value)}
              className={cn('input-field', errors.lokasi && 'border-red-400')}
            >
              <option value="">Pilih area...</option>
              {CATEGORIES_LOKASI.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
            {errors.lokasi && <p className="text-red-500 text-xs font-body mt-1">{errors.lokasi}</p>}
          </motion.div>
        </div>

        {/* Address */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-primary-500" /> Alamat Lengkap <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={e => setField('address', e.target.value)}
            placeholder="cth: Jl. Merjosari No. 45, Malang"
            className={cn('input-field', errors.address && 'border-red-400')}
          />
          {errors.address && <p className="text-red-500 text-xs font-body mt-1">{errors.address}</p>}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jam buka */}
          <motion.div variants={fadeUpVariant}>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-primary-500" /> Jam Operasional
            </label>
            <input
              type="text"
              value={form.openHours}
              onChange={e => setField('openHours', e.target.value)}
              placeholder="cth: 08.00 – 21.00"
              className="input-field"
            />
          </motion.div>

          {/* Price range */}
          <motion.div variants={fadeUpVariant}>
            <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary-500" /> Kisaran Harga (Rp)
            </label>
            <input
              type="text"
              value={form.priceRange}
              onChange={e => setField('priceRange', e.target.value)}
              placeholder="cth: 10.000 – 30.000"
              className="input-field"
            />
          </motion.div>
        </div>

        {/* Phone */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
            <Phone size={14} className="text-primary-500" /> Nomor Telepon / WA
          </label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
            placeholder="cth: 0812-3456-7890"
            className="input-field"
          />
        </motion.div>

        {/* Menu */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-primary-500" /> Menu (pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={form.menu}
            onChange={e => setField('menu', e.target.value)}
            placeholder="cth: Soto Ayam, Es Teh, Nasi Goreng"
            className="input-field"
          />
          <p className="text-xs text-muted font-body mt-1">Contoh: Nasi Goreng, Mie Ayam, Es Jeruk</p>
        </motion.div>

        {/* Tags */}
        <motion.div variants={fadeUpVariant}>
          <label className="text-sm font-semibold text-dark font-body mb-1.5 flex items-center gap-1.5">
            <Tag size={14} className="text-primary-500" /> Tags (pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={e => setField('tags', e.target.value)}
            placeholder="cth: soto, murah, sarapan"
            className="input-field"
          />
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUpVariant}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : submitLabel}
          </motion.button>
        </motion.div>
      </motion.div>
    </form>
  )
}
