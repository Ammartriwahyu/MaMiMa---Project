import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Camera } from 'lucide-react'

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm]     = useState({ name: user?.displayName||'', username: user?.username||'', bio: user?.bio||'' })
  const [avatar, setAvatar] = useState(null)
  const [cover, setCover]   = useState(null)
  const [avPrev, setAvPrev] = useState(user?.avatar || null)
  const [covPrev, setCovPrev] = useState(user?.coverImage || null)
  const [loading, setLoading] = useState(false)

  const pick = (setter, prevSetter) => (e) => {
    const f = e.target.files[0]
    if (!f) return
    setter(f)
    prevSetter(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    setLoading(true)
    const fd = new FormData()
    fd.append('name',     form.name)
    fd.append('username', form.username)
    fd.append('bio',      form.bio)
    if (avatar) fd.append('avatar',      avatar)
    if (cover)  fd.append('cover_image', cover)
    await onSave(fd)
    setLoading(false)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{scale:0.95,y:20}} animate={{scale:1,y:0}} exit={{scale:0.95,opacity:0}}
        className="bg-white rounded-3xl shadow-float w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-xl text-dark">Edit Profil</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-muted"><X size={18}/></button>
        </div>

        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Cover */}
          <div>
            <label className="text-sm font-semibold text-dark mb-1.5 block">Foto Sampul</label>
            <label className="cursor-pointer block">
              <div className="w-full h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 relative">
                {covPrev ? <img src={covPrev} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><Camera size={24} className="text-primary-400"/></div>}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-semibold">Ganti</span>
                </div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={pick(setCover, setCovPrev)}/>
            </label>
          </div>

          {/* Avatar */}
          <div>
            <label className="text-sm font-semibold text-dark mb-1.5 block">Foto Profil</label>
            <label className="cursor-pointer inline-block">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-soft bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {avPrev ? <img src={avPrev} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center"><span className="text-white font-display font-bold text-2xl">{form.name?.[0]?.toUpperCase()}</span></div>}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl"><Camera size={16} className="text-white"/></div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={pick(setAvatar, setAvPrev)}/>
            </label>
          </div>

          {[
            ['name', 'Nama Tampilan', 'text', 'Nama kamu'],
            ['username', 'Username', 'text', 'username_kamu'],
          ].map(([k,l,t,ph]) => (
            <div key={k}>
              <label className="text-sm font-semibold text-dark mb-1.5 block">{l}</label>
              <input type={t} value={form[k]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} placeholder={ph} className="input-field"/>
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold text-dark mb-1.5 block">Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} rows={3} className="input-field resize-none" placeholder="Ceritakan tentang dirimu..."/>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-2">
          <button onClick={onClose} className="flex-1 btn-outline text-sm py-2.5">Batal</button>
          <motion.button whileHover={{scale:1.01}} whileTap={{scale:0.98}} onClick={handleSave} disabled={loading}
            className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Simpan Profil'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
