import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Search, MapPin, Utensils, Coffee, Users } from 'lucide-react'
import PlaceCard from '@/components/shared/PlaceCard'
import { placesApi } from '@/features/places/api/placesApi'
import { fadeUp, stagger, LOKASI_OPTIONS } from '@/design-system/tokens'

const STATS = [
  { icon: Utensils, value: '200+', label: 'Tempat Makan', color: 'text-orange-500' },
  { icon: Coffee,   value: '150+', label: 'Kedai Minum',  color: 'text-blue-500'   },
  { icon: MapPin,   value: '5',    label: 'Area Malang',  color: 'text-green-500'  },
  { icon: Users,    value: '1K+',  label: 'Pengguna',     color: 'text-purple-500' },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0,1], ['0%','30%'])
  const opacity = useTransform(scrollYProgress, [0,0.8], [1,0])
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    placesApi.getAll().then(({ data }) => setFeatured(data.slice(0,3))).catch(() => {})
  }, [])

  return (
    <div className="bg-white">
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-white to-white"/>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary-100 rounded-full blur-[120px] opacity-50"/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px]"/>
        {['🍜','☕','🥤','🍱','🧋','🍛'].map((e,i) => (
          <motion.div key={i} className="absolute text-3xl select-none pointer-events-none"
            style={{ left:`${[10,85,15,80,5,90][i]}%`, top:`${[20,15,70,65,45,40][i]}%`, opacity:0.15 }}
            animate={{ y:[0,-15,0], rotate:[0,5,-5,0] }}
            transition={{ duration:4+i*0.8, repeat:Infinity, delay:i*0.5 }}>{e}</motion.div>
        ))}

        <motion.div style={{y,opacity}} className="page-container relative z-10 pt-28 pb-16">
          <div className="max-w-3xl">
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.1}}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"/>
              <span className="text-primary-700 text-sm font-semibold">Direktori UMKM Kuliner Malang</span>
            </motion.div>

            <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-dark leading-tight mb-6">
              Cari & Temukan<br/><span className="gradient-text italic">Kuliner Malang</span><br/>Terbaik 🍜
            </motion.h1>

            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
              className="text-lg text-muted max-w-xl mb-8 leading-relaxed">
              Platform direktori tempat makan & minum UMKM lokal di Malang. Dari soto sampai kopi, semuanya ada!
            </motion.p>

            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
              className="flex flex-wrap gap-3 mb-10">
              <Link to="/register">
                <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                  className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
                  Mulai Jelajahi <ArrowRight size={18}/>
                </motion.button>
              </Link>
              <Link to="/explore">
                <motion.button whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}
                  className="btn-outline text-base px-8 py-3.5 flex items-center gap-2">
                  <Search size={18}/> Lihat Tempat
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-surface">
        <div className="page-container">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}}
            className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({icon:Icon,value,label,color}) => (
              <motion.div key={label} variants={fadeUp} className="card p-6 text-center hover:shadow-card transition-shadow">
                <div className={`inline-flex w-12 h-12 rounded-2xl bg-gray-50 items-center justify-center mb-3 ${color}`}><Icon size={22}/></div>
                <div className="font-display font-bold text-3xl text-dark mb-1">{value}</div>
                <div className="text-sm text-muted">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="page-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-2 block">Pilihan Editor</span>
                <h2 className="section-title">Tempat Populer 🔥</h2>
              </div>
              <Link to="/explore" className="btn-outline text-sm py-2 flex items-center gap-1.5">Lihat Semua <ArrowRight size={14}/></Link>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}}
              className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(p => <motion.div key={p.id} variants={fadeUp}><PlaceCard place={p}/></motion.div>)}
            </motion.div>
          </div>
        </section>
      )}

      {/* AREAS */}
      <section className="py-20 bg-surface">
        <div className="page-container">
          <div className="text-center mb-12">
            <span className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-2 block">Berdasarkan Lokasi</span>
            <h2 className="section-title">Jelajahi Area di Malang</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true}}
            className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {LOKASI_OPTIONS.map(l => (
              <motion.div key={l.id} variants={fadeUp}>
                <Link to={`/explore?lokasi=${l.id}`}>
                  <motion.div whileHover={{y:-6,scale:1.02}} className="card p-6 text-center hover:shadow-card transition-shadow cursor-pointer group">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{l.emoji}</div>
                    <h3 className="font-display font-semibold text-dark text-sm">{l.label}</h3>
                    <p className="text-xs text-muted mt-1">Malang</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,217,61,0.15),transparent_60%)]"/>
            <div className="relative z-10">
              <motion.div animate={{y:[0,-8,0]}} transition={{duration:2.5,repeat:Infinity}} className="text-5xl mb-6">🍽️</motion.div>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Punya Tempat Favoritmu?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">Daftar gratis dan mulai share tempat kuliner UMKM favoritmu di Malang!</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/register">
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    className="bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-2xl text-sm shadow-float flex items-center gap-2">
                    Daftar Sekarang <ArrowRight size={16}/>
                  </motion.button>
                </Link>
                <Link to="/explore">
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                    className="bg-transparent text-white border-2 border-white/40 hover:border-white/80 font-semibold px-8 py-3.5 rounded-2xl text-sm transition-colors">
                    Jelajahi Dulu
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
