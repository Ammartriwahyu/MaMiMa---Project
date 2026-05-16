import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, MapPin, Clock, Phone, DollarSign, Navigation, Tag, FileText } from 'lucide-react'
import { get } from '@/lib/apiClient'
import { TYPE_OPTIONS, LOKASI_OPTIONS, fadeUp, stagger } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export default function PlaceForm({ initialData = {}, onSubmit, loading, submitLabel = 'Simpan' }) {
  const [form, setForm] = useState({
    name:        initialData.name        || '',
    bio:         initialData.bio         || '',
    types:       initialData.types       || [],
    lokasi:      initialData.lokasi      || '',
    address:     initialData.address     || '',
    price_range: initialData.priceRange  || '',
    open_hours:  initialData.openHours   || '',
    phone:       initialData.phone       || '',
    whatsapp:    initialData.whatsapp    || '',
    latitude:    initialData.latitude    || '',
    longitude:   initialData.longitude   || '',
    categories:  initialData.categories?.map(c => c.id) || [],
  })
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.image || null)
  const [allCategories, setAllCategories] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    get('/categories').then(({ data }) => setAllCategories(data)).catch(() => {})
  }, [])

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })) }

  const toggleType = (t) => {
    setForm(f => ({
      ...f,
      types: f.types.includes(t) ? f.types.filter(x => x !== t) : [...f.types, t]
    }))
  }

  const toggleCategory = (id) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(id) ? f.categories.filter(x => x !== id) : [...f.categories, id]
    }))
  }

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())   e.name   = 'Nama wajib diisi'
    if (!form.types.length)  e.types  = 'Pilih minimal satu jenis'
    if (!form.lokasi)        e.lokasi = 'Pilih lokasi'
    if (!form.address.trim()) e.address = 'Alamat wajib diisi'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const data = { ...form }
    if (imageFile) data.image = imageFile
    onSubmit(data)
  }

  const inputRow = (icon, label, key, props = {}) => (
    <div>
      <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <input value={form[key]} onChange={e => set(key, e.target.value)}
        className={cn('input-field', errors[key] && 'border-red-400 ring-1 ring-red-200')} {...props} />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit}>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

        {/* Image */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-1.5 block">Foto Tempat</label>
          <label className="cursor-pointer block">
            <div className={cn('w-full h-48 rounded-2xl border-2 border-dashed overflow-hidden transition-colors',
              imagePreview ? 'border-primary-300' : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/20')}>
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                    <Upload size={28} className="mb-2" /><p className="text-sm">Klik untuk upload foto</p>
                    <p className="text-xs mt-1 text-muted/60">PNG, JPG, WEBP — maks 5MB</p>
                  </div>
              }
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </label>
        </motion.div>

        {/* Name */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-1.5 block">Nama Tempat *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="cth: Warung Soto Pak Dhe"
            className={cn('input-field', errors.name && 'border-red-400')} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </motion.div>

        {/* Jenis (multi-select) */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-2 block">Jenis Tempat * (bisa pilih keduanya)</label>
          <div className="flex gap-3">
            {TYPE_OPTIONS.map(t => (
              <button key={t.id} type="button" onClick={() => toggleType(t.id)}
                className={cn('flex-1 py-3 rounded-2xl border-2 font-semibold text-sm transition-all',
                  form.types.includes(t.id)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-muted hover:border-primary-200')}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          {errors.types && <p className="text-red-500 text-xs mt-1">{errors.types}</p>}
        </motion.div>

        {/* Lokasi */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-primary-500" /> Area/Lokasi *
          </label>
          <select value={form.lokasi} onChange={e => set('lokasi', e.target.value)}
            className={cn('input-field', errors.lokasi && 'border-red-400')}>
            <option value="">Pilih area...</option>
            {LOKASI_OPTIONS.map(l => <option key={l.id} value={l.id}>{l.emoji} {l.label}</option>)}
          </select>
          {errors.lokasi && <p className="text-red-500 text-xs mt-1">{errors.lokasi}</p>}
        </motion.div>

        {/* Categories (multi-select chips) */}
        {allCategories.length > 0 && (
          <motion.div variants={fadeUp}>
            <label className="text-sm font-semibold text-dark mb-2 flex items-center gap-1.5">
              <Tag size={14} className="text-primary-500" /> Kategori (opsional, pilih beberapa)
            </label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map(c => (
                <button key={c.id} type="button" onClick={() => toggleCategory(c.id)}
                  className={cn('badge border transition-all cursor-pointer text-sm py-1.5 px-3',
                    form.categories.includes(c.id)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : (c.color || 'bg-gray-100 text-gray-700 border-gray-200') + ' hover:opacity-80')}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Address */}
        <motion.div variants={fadeUp}>
          {inputRow(<MapPin size={14} className="text-primary-500" />, 'Alamat Lengkap *', 'address', { placeholder: 'cth: Jl. Merjosari No. 45, Malang' })}
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </motion.div>

        {/* Bio */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-primary-500" /> Deskripsi (opsional)
          </label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3}
            placeholder="Ceritakan keunikan tempat ini..." className="input-field resize-none" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeUp}>
            <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
              <Clock size={14} className="text-primary-500" /> Jam Operasional
            </label>
            <input value={form.open_hours} onChange={e => set('open_hours', e.target.value)}
              placeholder="08.00 – 21.00" className="input-field" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
              <DollarSign size={14} className="text-primary-500" /> Kisaran Harga (Rp)
            </label>
            <input value={form.price_range} onChange={e => set('price_range', e.target.value)}
              placeholder="10.000 – 30.000" className="input-field" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div variants={fadeUp}>
            <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-primary-500" /> No. Telepon
            </label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="0812-3456-7890" className="input-field" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <label className="text-sm font-semibold text-dark mb-1.5 flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-green-500 fill-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              No. WhatsApp
            </label>
            <input value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)}
              placeholder="0812-3456-7890" className="input-field" />
          </motion.div>
        </div>

        {/* Coordinates */}
        <motion.div variants={fadeUp}>
          <label className="text-sm font-semibold text-dark mb-2 flex items-center gap-1.5">
            <Navigation size={14} className="text-primary-500" /> Koordinat (opsional)
          </label>
          <p className="text-xs text-muted mb-2">Cari di Google Maps → klik kanan lokasi → salin koordinat</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.latitude} onChange={e => set('latitude', e.target.value)}
              placeholder="Latitude: -7.9392" className="input-field text-sm" />
            <input value={form.longitude} onChange={e => set('longitude', e.target.value)}
              placeholder="Longitude: 112.5965" className="input-field text-sm" />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp} className="pt-2">
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : submitLabel}
          </motion.button>
        </motion.div>

      </motion.div>
    </form>
  )
}
