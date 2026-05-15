import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X, Plus, User, LogOut, Home, Compass, Bookmark } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropOpen(false) }, [pathname])

  const navLinks = user
    ? [
        { to: '/home',    label: 'Beranda',  icon: Home },
        { to: '/explore', label: 'Jelajahi', icon: Compass },
      ]
    : [
        { to: '/',        label: 'Beranda' },
        { to: '/explore', label: 'Jelajahi' },
      ]

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed z-50 left-0 right-0 transition-all duration-300',
          scrolled ? 'top-3 mx-4 md:mx-10 lg:mx-20' : 'top-0 mx-0'
        )}
      >
        <div className={cn(
          'transition-all duration-300',
          scrolled
            ? 'backdrop-blur-xl bg-white/90 border border-gray-200/60 shadow-float rounded-2xl px-5 py-3'
            : 'bg-transparent px-6 py-4'
        )}>
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to={user ? '/home' : '/'} className="flex items-center gap-2">
              <motion.div whileHover={{ rotate: [-5, 5, -5, 0] }} transition={{ duration: 0.4 }}
                className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-card">
                <span className="text-white font-display font-bold text-sm">M³</span>
              </motion.div>
              <div>
                <span className="font-display font-bold text-dark text-lg tracking-tight">MaMiMa</span>
                <span className="hidden sm:block text-[10px] text-muted font-body leading-none">Makan Minum Malang</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to}
                  className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    pathname === l.to ? 'bg-primary-50 text-primary-600' : 'text-dark/60 hover:text-dark hover:bg-gray-50')}>
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/explore')}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-dark/50 hover:text-dark hover:bg-gray-100 transition-colors">
                <Search size={17} />
              </motion.button>

              {user ? (
                <>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => navigate('/create')}
                    className="hidden sm:flex items-center gap-1.5 btn-primary text-xs py-2 px-3.5">
                    <Plus size={14} /> Tambah
                  </motion.button>

                  {/* Profile dropdown */}
                  <div className="relative">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDropOpen(!dropOpen)}
                      className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors">
                      {user.avatar
                        ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{user.displayName?.[0]?.toUpperCase()}</span>
                          </div>
                      }
                    </motion.button>

                    <AnimatePresence>
                      {dropOpen && (
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-float border border-gray-100 overflow-hidden z-50">
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="font-semibold text-sm text-dark truncate">{user.displayName}</p>
                            <p className="text-xs text-muted">@{user.username}</p>
                          </div>
                          <div className="p-1.5 space-y-0.5">
                            {[
                              { label: 'Profil Saya',    icon: User,     to: `/profile/${user.username}` },
                              { label: 'Tambah Tempat',  icon: Plus,     to: '/create' },
                              { label: 'Tersimpan',      icon: Bookmark, to: '/bookmarks' },
                            ].map(({ label, icon: Icon, to }) => (
                              <button key={to} onClick={() => navigate(to)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-dark hover:bg-gray-50 transition-colors">
                                <Icon size={14} className="text-muted" /> {label}
                              </button>
                            ))}
                            <hr className="border-gray-100 my-1" />
                            <button onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                              <LogOut size={14} /> Keluar
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
                  <Link to="/register"><motion.span whileHover={{ scale: 1.02 }} className="btn-primary text-sm py-2 px-4 block">Daftar</motion.span></Link>
                </div>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-4 top-[72px] z-40 bg-white rounded-2xl shadow-float border border-gray-100 p-3 md:hidden">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-dark hover:bg-gray-50 transition-colors">
                {l.icon && <l.icon size={15} className="text-muted" />} {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <hr className="border-gray-100 my-2" />
                <Link to="/create" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-primary-600 hover:bg-primary-50">
                  <Plus size={15} /> Tambah Tempat
                </Link>
                <Link to={`/profile/${user.username}`} className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-dark hover:bg-gray-50">
                  <User size={15} className="text-muted" /> Profil Saya
                </Link>
                <Link to="/bookmarks" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-dark hover:bg-gray-50">
                  <Bookmark size={15} className="text-muted" /> Tersimpan
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50">
                  <LogOut size={15} /> Keluar
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" className="flex-1 text-center btn-outline text-sm py-2">Masuk</Link>
                <Link to="/register" className="flex-1 text-center btn-primary text-sm py-2">Daftar</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {(dropOpen || mobileOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setDropOpen(false); setMobileOpen(false) }} />
      )}
    </>
  )
}
