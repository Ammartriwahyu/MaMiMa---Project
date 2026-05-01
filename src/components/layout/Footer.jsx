import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Instagram, Twitter, Mail, Heart } from 'lucide-react'
import { fadeUpVariant, staggerContainer } from '@/design-system/tokens'

export default function Footer() {
  return (
    <footer className="bg-dark text-white relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-60" />

      {/* Decorative blobs */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute top-10 left-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />

      <div className="page-container py-16 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand */}
          <motion.div variants={fadeUpVariant} className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-card">
                <span className="text-white font-display font-bold">M³</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">MaMiMa</h3>
                <p className="text-xs text-white/50 font-body">Makan Minum Malang</p>
              </div>
            </div>
            <p className="text-white/60 font-body text-sm leading-relaxed max-w-xs mb-6">
              Temukan & bagikan tempat makan dan minum UMKM terbaik di Kota Malang. Mendukung kuliner lokal bersama!
            </p>
            <div className="flex items-center gap-2 text-white/50 text-sm font-body">
              <MapPin size={14} className="text-primary-400" />
              Malang, Jawa Timur, Indonesia
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Mail, label: 'Email' },
              ].map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={fadeUpVariant}>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-widest">Jelajahi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Semua Tempat', to: '/explore' },
                { label: 'Kategori Makan', to: '/explore?kategori=makan' },
                { label: 'Kategori Minum', to: '/explore?kategori=minum' },
                { label: 'Area Merjosari', to: '/explore?lokasi=merjosari' },
                { label: 'Area Dinoyo', to: '/explore?lokasi=dinoyo' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/50 hover:text-primary-400 font-body text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeUpVariant}>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-widest">Info</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Tentang MaMiMa', to: '/' },
                { label: 'Cara Daftar', to: '/register' },
                { label: 'Tambah Tempat', to: '/create' },
                { label: 'Kebijakan Privasi', to: '/' },
                { label: 'Syarat & Ketentuan', to: '/' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-white/50 hover:text-primary-400 font-body text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">
            © 2024 MaMiMa. Semua hak dilindungi.
          </p>
          <p className="text-white/40 text-xs font-body flex items-center gap-1">
            Dibuat dengan <Heart size={12} className="text-primary-500 fill-primary-500" /> untuk kuliner Malang
          </p>
        </div>
      </div>
    </footer>
  )
}
