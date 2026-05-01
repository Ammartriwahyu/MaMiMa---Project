import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Search, MapPin, Star, Utensils, Coffee, Users, TrendingUp } from 'lucide-react'
import { AnimatedSection, StaggerSection } from '@/components/shared/AnimatedSection'
import { fadeUpVariant } from '@/design-system/tokens'
import { CATEGORIES_LOKASI } from '@/design-system/tokens'
import PlaceCard from '@/components/shared/PlaceCard'
import { dummyPlaces } from '@/features/home/data/dummyPlaces'

const STATS = [
  { icon: Utensils, value: '200+', label: 'Tempat Makan', color: 'text-orange-500' },
  { icon: Coffee, value: '150+', label: 'Kedai Minum', color: 'text-blue-500' },
  { icon: MapPin, value: '5', label: 'Area di Malang', color: 'text-green-500' },
  { icon: Users, value: '1.2K+', label: 'Pengguna Aktif', color: 'text-purple-500' },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const featuredPlaces = dummyPlaces.slice(0, 3)

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-white to-white" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-100 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]" />

        {/* Floating food emojis */}
        {['🍜', '☕', '🥤', '🍱', '🧋', '🍛'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl select-none pointer-events-none"
            style={{
              left: `${[10, 85, 15, 80, 5, 90][i]}%`,
              top: `${[20, 15, 70, 65, 45, 40][i]}%`,
              opacity: 0.15,
            }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="page-container relative z-10 pt-28 pb-16"
        >
          <div className="max-w-3xl">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-primary-700 text-sm font-semibold font-body">Direktori UMKM Kuliner Malang</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-dark leading-tight mb-6"
            >
              Cari & Temukan <br />
              <span className="gradient-text italic">Kuliner Malang</span> <br />
              Terbaik 🍜
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg text-muted font-body max-w-xl mb-8 leading-relaxed"
            >
              MaMiMa adalah platform untuk menemukan dan berbagi tempat makan & minum UMKM lokal di Malang. Dari soto sampai kopi, semuanya ada!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
                >
                  Mulai Jelajahi
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline text-base px-8 py-3.5 flex items-center gap-2"
                >
                  <Search size={18} />
                  Lihat Tempat
                </motion.button>
              </Link>
            </motion.div>

            {/* Quick search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-float border border-gray-100 p-2 flex items-center gap-2 max-w-md"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search size={16} className="text-muted" />
                <Link to="/explore" className="flex-1 text-sm text-muted font-body py-2">
                  Cari tempat makan atau minum...
                </Link>
              </div>
              <Link to="/explore" className="btn-primary text-sm py-2 px-4 shrink-0">Cari</Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-muted font-body">Scroll ke bawah</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-muted/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-muted/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 bg-surface">
        <div className="page-container">
          <StaggerSection className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <motion.div
                key={label}
                variants={fadeUpVariant}
                className="card p-6 text-center hover:shadow-card transition-shadow"
              >
                <div className={`inline-flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center mb-3 ${color}`}>
                  <Icon size={22} />
                </div>
                <div className="font-display font-bold text-3xl text-dark mb-1">{value}</div>
                <div className="text-sm text-muted font-body">{label}</div>
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ===== FEATURED PLACES ===== */}
      <section className="py-20">
        <div className="page-container">
          <AnimatedSection className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary-500 text-sm font-semibold font-body uppercase tracking-widest mb-2 block">Pilihan Editor</span>
              <h2 className="section-title">Tempat Populer 🔥</h2>
            </div>
            <Link to="/explore" className="btn-outline text-sm py-2 flex items-center gap-1.5">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          <StaggerSection className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlaces.map(place => (
              <motion.div key={place.id} variants={fadeUpVariant}>
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 bg-surface">
        <div className="page-container">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary-500 text-sm font-semibold font-body uppercase tracking-widest mb-2 block">Berdasarkan Lokasi</span>
            <h2 className="section-title">Jelajahi Area di Malang</h2>
          </AnimatedSection>

          <StaggerSection className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES_LOKASI.map(lokasi => (
              <motion.div key={lokasi.id} variants={fadeUpVariant}>
                <Link to={`/explore?lokasi=${lokasi.id}`}>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="card p-6 text-center hover:shadow-card transition-shadow group cursor-pointer"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {['🏘️', '🏔️', '🏛️', '🌊', '🌿'][CATEGORIES_LOKASI.indexOf(lokasi)]}
                    </div>
                    <h3 className="font-display font-semibold text-dark text-sm">{lokasi.label}</h3>
                    <p className="text-xs text-muted font-body mt-1">Malang</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20">
        <div className="page-container">
          <AnimatedSection className="text-center mb-14">
            <span className="text-primary-500 text-sm font-semibold font-body uppercase tracking-widest mb-2 block">Cara Kerja</span>
            <h2 className="section-title">Gampang & Cepat</h2>
          </AnimatedSection>

          <StaggerSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔍', title: 'Cari Tempat', desc: 'Search berdasarkan nama, kategori, atau area di Malang.' },
              { step: '02', icon: '📍', title: 'Temukan Detail', desc: 'Lihat info lengkap: lokasi, jam buka, harga, dan menu.' },
              { step: '03', icon: '✍️', title: 'Bagikan ke Teman', desc: 'Upload tempat favoritmu dan bantu sesama kuliner hunter!' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariant}
                className="relative"
              >
                <div className="card p-8 hover:shadow-card transition-shadow">
                  <span className="font-mono text-xs text-primary-400 font-semibold tracking-widest block mb-4">{item.step}</span>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-display font-semibold text-xl text-dark mb-2">{item.title}</h3>
                  <p className="text-muted font-body text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-2xl text-primary-200">→</div>
                )}
              </motion.div>
            ))}
          </StaggerSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20">
        <div className="page-container">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-12 md:p-16 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,217,61,0.15),transparent_60%)]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-5xl mb-6"
                >
                  🍽️
                </motion.div>
                <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                  Punya Tempat Favoritmu?
                </h2>
                <p className="text-white/80 font-body text-lg mb-8 max-w-md mx-auto">
                  Daftar gratis dan mulai share tempat makan & minum favorit di Malang!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-2xl text-sm font-body shadow-float hover:shadow-xl transition-shadow flex items-center gap-2"
                    >
                      Daftar Sekarang <ArrowRight size={16} />
                    </motion.button>
                  </Link>
                  <Link to="/explore">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-transparent text-white border-2 border-white/40 hover:border-white/80 font-semibold px-8 py-3.5 rounded-2xl text-sm font-body transition-colors"
                    >
                      Jelajahi Dulu
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
