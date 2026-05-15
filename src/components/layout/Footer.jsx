import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Instagram, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">M³</span>
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg">MaMiMa</span>
                <p className="text-[10px] text-white/40 font-body">Makan Minum Malang</p>
              </div>
            </div>
            <p className="text-white/50 text-sm font-body leading-relaxed mb-4 max-w-xs">
              Temukan & bagikan tempat makan minum UMKM terbaik di Kota Malang.
            </p>
            <div className="flex items-center gap-1.5 text-white/40 text-sm">
              <MapPin size={13} className="text-primary-400" /> Malang, Jawa Timur
            </div>
          </div>

          {/* Jelajahi */}
          <div>
            <h4 className="font-body font-semibold text-white text-xs uppercase tracking-widest mb-4">Jelajahi</h4>
            <ul className="space-y-2.5">
              {[
                ['Semua Tempat',    '/explore'],
                ['Kategori Makan', '/explore?type[]=makan'],
                ['Kategori Minum', '/explore?type[]=minum'],
                ['Area Merjosari', '/explore?lokasi=merjosari'],
                ['Area Dinoyo',    '/explore?lokasi=dinoyo'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-primary-400 text-sm font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h4 className="font-body font-semibold text-white text-xs uppercase tracking-widest mb-4">Akun</h4>
            <ul className="space-y-2.5">
              {[
                ['Masuk',          '/login'],
                ['Daftar',         '/register'],
                ['Tambah Tempat',  '/create'],
                ['Tersimpan',      '/bookmarks'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-white/40 hover:text-primary-400 text-sm font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs font-body">© 2026 MaMiMa. Semua hak dilindungi.</p>
          <p className="text-white/30 text-xs font-body flex items-center gap-1">
            Dibuat dengan <Heart size={11} className="text-primary-500 fill-primary-500" /> untuk kuliner Malang
          </p>
        </div>
      </div>
    </footer>
  )
}
