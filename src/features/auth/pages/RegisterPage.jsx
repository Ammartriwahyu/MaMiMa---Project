import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AtSign } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { fadeUpVariant, staggerContainer } from '@/design-system/tokens'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'displayName', label: 'Nama Tampilan', placeholder: 'Nama Kamu', icon: User },
    { name: 'username', label: 'Username', placeholder: 'username_kamu', icon: AtSign },
    { name: 'email', label: 'Email', placeholder: 'email@example.com', icon: Mail, type: 'email' },
    { name: 'password', label: 'Password', placeholder: 'Min. 6 karakter', icon: Lock, type: 'password' },
    { name: 'confirmPassword', label: 'Konfirmasi Password', placeholder: 'Ulangi password', icon: Lock, type: 'password' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Right panel - decorative (reversed from login) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={fadeUpVariant} className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold">M³</span>
            </div>
            <span className="font-display font-bold text-xl text-dark">MaMiMa</span>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h1 className="font-display font-bold text-3xl text-dark mb-2">Daftar Gratis</h1>
            <p className="text-muted font-body text-sm mb-8">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
                Masuk sekarang
              </Link>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {fields.map(field => (
              <motion.div key={field.name} variants={fadeUpVariant}>
                <label className="text-sm font-semibold text-dark font-body mb-1.5 block">{field.label}</label>
                <div className="relative">
                  <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  {field.type === 'password' ? (
                    <div className="relative">
                      <field.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required
                        placeholder={field.placeholder}
                        className="input-field pl-11 pr-11"
                      />
                      {field.name === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="input-field pl-11"
                    />
                  )}
                </div>
              </motion.div>
            ))}

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
                    Buat Akun <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.p variants={fadeUpVariant} className="text-center text-xs text-muted font-body">
              Dengan mendaftar, kamu setuju dengan{' '}
              <a href="#" className="text-primary-500 hover:underline">Syarat & Ketentuan</a> kami.
            </motion.p>
          </form>
        </motion.div>
      </div>

      {/* Right decorative panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-bl from-primary-500 to-primary-700 flex-col items-center justify-center p-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,217,61,0.2),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-8"
          >
            ☕
          </motion.div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Bergabung<br />Bersama Kami!
          </h2>
          <p className="text-white/70 font-body text-lg max-w-xs">
            Share tempat makan favoritmu dan bantu sesama kuliner hunter di Malang
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {['✅ Upload tempat', '✅ Edit profil', '✅ Community', '✅ Gratis!'].map(item => (
              <div key={item} className="bg-white/10 rounded-xl px-3 py-2 text-white/80 text-sm font-body">
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
