import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { fadeUpVariant, staggerContainer } from '@/design-system/tokens'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-16"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,217,61,0.2),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-800/30 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-8"
          >
            🍜
          </motion.div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Selamat Datang<br />di MaMiMa!
          </h2>
          <p className="text-white/70 font-body text-lg max-w-xs">
            Masuk untuk mulai menjelajahi kuliner Malang terbaik
          </p>

          {/* Floating food icons */}
          {['☕', '🧋', '🍱', '🥤'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: `${[15, 75, 20, 80][i]}%`, top: `${[20, 25, 70, 65][i]}%`, opacity: 0.4 }}
              animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.7 }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">M³</span>
            </div>
            <span className="font-display font-bold text-xl text-dark">MaMiMa</span>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h1 className="font-display font-bold text-3xl text-dark mb-2">Masuk</h1>
            <p className="text-muted font-body text-sm mb-8">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                Daftar gratis
              </Link>
            </p>
          </motion.div>

          {/* Demo hint */}
          <motion.div
            variants={fadeUpVariant}
            className="bg-primary-50 border border-primary-100 rounded-2xl p-4 mb-6"
          >
            <p className="text-xs font-body text-primary-700">
              <span className="font-semibold">💡 Demo:</span> Email: <code className="bg-primary-100 px-1.5 py-0.5 rounded font-mono">foodie@example.com</code> | Password: <code className="bg-primary-100 px-1.5 py-0.5 rounded font-mono">password123</code>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={fadeUpVariant}>
              <label className="text-sm font-semibold text-dark font-body mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className="input-field pl-11"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUpVariant}>
              <label className="text-sm font-semibold text-dark font-body mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-body bg-red-50 px-4 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <motion.div variants={fadeUpVariant} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Masuk
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
