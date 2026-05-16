import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { stagger, fadeUp } from '@/design-system/tokens'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ displayName:'', username:'', email:'', password:'', confirm:'' })
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Password tidak cocok.'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    try { await register(form); navigate('/home') }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const fields = [
    { k:'displayName', label:'Nama Tampilan', ph:'Nama kamu',       icon: User,   type:'text'     },
    { k:'username',    label:'Username',       ph:'username_kamu',   icon: AtSign, type:'text'     },
    { k:'email',       label:'Email',          ph:'email@example.com', icon: Mail,  type:'email'    },
    { k:'password',    label:'Password',       ph:'Min. 6 karakter', icon: Lock,   type:'password' },
    { k:'confirm',     label:'Konfirmasi Password', ph:'Ulangi password', icon: Lock, type:'password' },
  ]

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">M³</span>
            </div>
            <span className="font-display font-bold text-xl">MaMiMa</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1 className="font-display font-bold text-3xl text-dark mb-1">Daftar Gratis</h1>
            <p className="text-muted text-sm mb-8">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Masuk</Link>
            </p>
          </motion.div>

          <form onSubmit={handle} className="space-y-3.5">
            {fields.map(({ k, label, ph, icon: Icon, type }) => (
              <motion.div key={k} variants={fadeUp}>
                <label className="text-sm font-semibold text-dark mb-1.5 block">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input type={type === 'password' ? (show ? 'text' : 'password') : type}
                    value={form[k]} onChange={set(k)} required placeholder={ph}
                    className="input-field pl-11 pr-11" />
                  {k === 'password' && (
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                      {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {error && <motion.p initial={{opacity:0}} animate={{opacity:1}}
              className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</motion.p>}

            <motion.button variants={fadeUp} whileHover={{scale:1.01}} whileTap={{scale:0.98}}
              type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                : <>Buat Akun <ArrowRight size={18}/></>}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Decorative right */}
      <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.7}}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-primary-500 to-primary-700 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,217,61,0.2),transparent)]" />
        <div className="relative z-10 text-center">
          <motion.div animate={{rotate:[0,5,-5,0],y:[0,-8,0]}} transition={{duration:4,repeat:Infinity}} className="text-8xl mb-8">☕</motion.div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">Bergabung<br/>Bersama Kami!</h2>
          <p className="text-white/70 text-lg max-w-xs mb-8">Share tempat kuliner favoritmu dan bantu sesama hunter di Malang</p>
          <div className="grid grid-cols-2 gap-3">
            {['✅ Upload tempat','✅ Komentar','✅ Like & simpan','✅ Gratis!'].map(t => (
              <div key={t} className="bg-white/10 rounded-xl px-3 py-2 text-white/80 text-sm">{t}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
