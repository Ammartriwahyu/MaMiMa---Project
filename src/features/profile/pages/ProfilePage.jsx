import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Grid, Edit2, Trash2, Calendar, Bookmark } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { profileApi } from '../api/profileApi'
import { placesApi } from '@/features/places/api/placesApi'
import PlaceCard from '@/components/shared/PlaceCard'
import { fadeUp, stagger } from '@/design-system/tokens'
import EditProfileModal from '../components/EditProfileModal'

export default function ProfilePage() {
  const { username }  = useParams()
  const { user, updateUser } = useAuth()
  const navigate      = useNavigate()
  const [profile, setProfile] = useState(null)
  const [places, setPlaces]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEdit]   = useState(false)
  const isOwn = user?.username === username

  useEffect(() => {
    setLoading(true)
    Promise.all([profileApi.getProfile(username), profileApi.getPlaces(username)])
      .then(([{data:p},{data:pl}]) => { setProfile(p); setPlaces(pl) })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [username])

  const handleDelete = async (place) => {
    if (!confirm(`Hapus "${place.name}"?`)) return
    try { await placesApi.delete(place.id); setPlaces(prev => prev.filter(p => p.id !== place.id)) }
    catch (e) { alert(e.message) }
  }

  const handleSave = async (formData) => {
    try {
      const { user: updated } = await profileApi.update(username, formData)
      setProfile(updated)
      updateUser(updated)
      setEdit(false)
    } catch (e) { alert(e.message) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"/></div>
  if (!profile) return <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center"><div className="text-5xl mb-4">👤</div><p className="font-display font-semibold text-xl">User tidak ditemukan</p></div>

  return (
    <div className="min-h-screen bg-white">
      {/* Cover */}
      <div className="relative h-52 md:h-64 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 overflow-hidden">
        {profile.coverImage
          ? <img src={profile.coverImage} alt="" className="w-full h-full object-cover"/>
          : <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle,#FFD93D 1px,transparent 1px)',backgroundSize:'30px 30px'}}/>
        }
      </div>

      <div className="page-container">
        {/* Profile header */}
        <div className="relative -mt-16 pb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-float bg-gradient-to-br from-primary-400 to-primary-600 shrink-0">
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover"/>
              : <div className="w-full h-full flex items-center justify-center"><span className="text-white font-display font-bold text-4xl">{profile.displayName?.[0]?.toUpperCase()}</span></div>
            }
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              <h1 className="font-display font-bold text-2xl text-dark">{profile.displayName}</h1>
              <p className="text-muted text-sm">@{profile.username}</p>
            </motion.div>
            {isOwn && (
              <button onClick={() => setEdit(true)} className="flex items-center gap-2 btn-outline text-sm py-2">
                <Settings size={15}/> Edit Profil
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="flex gap-8 pb-5 border-b border-gray-100">
          {[['Tempat',places.length],['Pengikut',profile.followersCount||0],['Mengikuti',profile.followingCount||0]].map(([l,v]) => (
            <motion.div key={l} variants={fadeUp} className="text-center">
              <p className="font-display font-bold text-xl text-dark">{v}</p>
              <p className="text-xs text-muted">{l}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="py-4 border-b border-gray-100">
            <p className="text-dark/80 text-sm leading-relaxed">{profile.bio}</p>
            {profile.joinedAt && (
              <p className="flex items-center gap-1.5 mt-2 text-muted text-xs">
                <Calendar size={12}/> Bergabung sejak {profile.joinedAt}
              </p>
            )}
          </motion.div>
        )}

        {/* Saved places shortcut (own profile) */}
        {isOwn && (
          <div className="py-4 border-b border-gray-100">
            <Link to="/bookmarks" className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              <Bookmark size={16}/> Lihat Tempat yang Disimpan
            </Link>
          </div>
        )}

        {/* Places grid */}
        <div className="py-8">
          <div className="flex items-center gap-2 mb-6">
            <Grid size={18}/>
            <h2 className="font-display font-semibold text-lg text-dark">Postingan {isOwn ? 'Saya' : profile.displayName}</h2>
            <span className="text-xs text-muted bg-gray-100 px-2 py-0.5 rounded-full">{places.length}</span>
          </div>

          {places.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-display font-semibold text-xl text-dark mb-2">Belum ada postingan</p>
              {isOwn && <><p className="text-muted text-sm mb-5">Mulai bagikan tempat kuliner favoritmu!</p><Link to="/create" className="btn-primary">Tambah Tempat Pertama</Link></>}
            </div>
          ) : (
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {places.map(p => (
                <motion.div key={p.id} variants={fadeUp} className="relative group">
                  <PlaceCard place={p}/>
                  {isOwn && (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Link to={`/place/${p.id}/edit`} onClick={e => e.stopPropagation()}
                        className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-blue-600 hover:bg-blue-50">
                        <Edit2 size={13}/>
                      </Link>
                      <button onClick={e => { e.preventDefault(); handleDelete(p) }}
                        className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-red-500 hover:bg-red-50">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editOpen && <EditProfileModal user={profile} onClose={() => setEdit(false)} onSave={handleSave}/>}
      </AnimatePresence>
    </div>
  )
}
