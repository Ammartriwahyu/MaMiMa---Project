import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { stagger, fadeUp } from '@/design-system/tokens'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try { await login(form.email, form.password); navigate('/home') }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Decorative left panel */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,217,61,0.2),transparent)]" />
        {['🍜','☕','🥤','🍱'].map((e,i) => (
          <motion.div key={i} className="absolute text-3xl opacity-25"
            style={{ left:`${[12,78,18,82][i]}%`, top:`${[18,22,72,68][i]}%` }}
            animate={{ y:[0,-12,0] }} transition={{ duration:3+i, repeat:Infinity, delay:i*0.6 }}>{e}</motion.div>
        ))}
        <div className="relative z-10 text-center">
          <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:3, repeat:Infinity }} className="text-8xl mb-8">🍜</motion.div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">Selamat Datang<br/>di MaMiMa!</h2>
          <p className="text-white/70 text-lg max-w-xs">Masuk untuk menjelajahi kuliner UMKM terbaik di Malang</p>
        </div>
      </motion.div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">M³</span>
            </div>
            <span className="font-display font-bold text-xl text-dark">MaMiMa</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1 className="font-display font-bold text-3xl text-dark mb-1">Masuk</h1>
            <p className="text-muted text-sm mb-8">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">Daftar gratis</Link>
            </p>
          </motion.div>

          <form onSubmit={handle} className="space-y-4">
            <motion.div variants={fadeUp}>
              <label className="text-sm font-semibold text-dark mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  required placeholder="email@example.com" className="input-field pl-11" />
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <label className="text-sm font-semibold text-dark mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input type={show ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))}
                  required placeholder="Password" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {error && <motion.p initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}}
              className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{error}</motion.p>}

            <motion.button variants={fadeUp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Masuk <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
