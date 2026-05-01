import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Plus, User, LogOut, Compass, Home } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = user
    ? [
        { to: '/home', label: 'Beranda', icon: Home },
        { to: '/explore', label: 'Jelajahi', icon: Compass },
      ]
    : [
        { to: '/', label: 'Beranda' },
        { to: '/explore', label: 'Jelajahi' },
      ]

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'top-3 mx-4 md:mx-8 lg:mx-16'
            : 'top-0 mx-0'
        )}
      >
        <div
          className={cn(
            'transition-all duration-300',
            scrolled
              ? 'backdrop-blur-xl bg-white/90 border border-white/60 shadow-float rounded-2xl px-6 py-3'
              : 'bg-transparent px-6 py-4'
          )}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to={user ? '/home' : '/'} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-card"
              >
                <span className="text-white font-display font-bold text-sm">M³</span>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-dark text-lg tracking-tight">MaMiMa</span>
                <span className="text-[10px] text-muted font-body hidden sm:block">Makan Minum Malang</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200',
                    location.pathname === link.to
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark/70 hover:text-dark hover:bg-gray-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search icon */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/explore')}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-dark/60 hover:text-dark hover:bg-gray-100 transition-colors"
              >
                <Search size={18} />
              </motion.button>

              {user ? (
                <>
                  {/* Create button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/create')}
                    className="hidden sm:flex items-center gap-1.5 bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-semibold font-body shadow-card hover:bg-primary-600 transition-colors"
                  >
                    <Plus size={15} />
                    Tambah
                  </motion.button>

                  {/* Profile dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.displayName?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="font-semibold text-sm text-dark truncate">{user.displayName}</p>
                            <p className="text-xs text-muted truncate">@{user.username}</p>
                          </div>
                          <div className="p-1.5">
                            <button
                              onClick={() => { navigate(`/profile/${user.username}`); setProfileOpen(false) }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-dark hover:bg-gray-50 transition-colors"
                            >
                              <User size={15} className="text-muted" />
                              Profil Saya
                            </button>
                            <button
                              onClick={() => { navigate('/create'); setProfileOpen(false) }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-dark hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={15} className="text-muted" />
                              Tambah Tempat
                            </button>
                            <hr className="my-1.5 border-gray-100" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <LogOut size={15} />
                              Keluar
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">Masuk</Link>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/register" className="btn-primary text-sm py-2">Daftar</Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden md:hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-dark hover:bg-gray-50 transition-colors"
                >
                  {link.icon && <link.icon size={16} className="text-muted" />}
                  {link.label}
                </Link>
              ))}
              <hr className="border-gray-100 my-2" />
              {user ? (
                <>
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-dark hover:bg-gray-50">
                    <User size={16} className="text-muted" />
                    Profil Saya
                  </Link>
                  <Link to="/create" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-primary-600 hover:bg-primary-50">
                    <Plus size={16} />
                    Tambah Tempat
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium text-red-500 hover:bg-red-50">
                    <LogOut size={16} />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link to="/login" className="flex-1 text-center btn-outline text-sm py-2">Masuk</Link>
                  <Link to="/register" className="flex-1 text-center btn-primary text-sm py-2">Daftar</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns */}
      {(profileOpen || mobileOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setProfileOpen(false); setMobileOpen(false) }}
        />
      )}
    </>
  )
}
