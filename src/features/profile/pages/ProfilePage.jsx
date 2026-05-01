import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Grid, Edit2, Trash2, MapPin, Calendar } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { usePlaces } from '@/features/home/hooks/usePlaces'
import PlaceCard from '@/components/shared/PlaceCard'
import { AnimatedSection, StaggerSection } from '@/components/shared/AnimatedSection'
import { fadeUpVariant, staggerContainer } from '@/design-system/tokens'
import { formatDate } from '@/lib/utils'
import EditProfileModal from '../components/EditProfileModal'

export default function ProfilePage() {
  const { username } = useParams()
  const { user, updateProfile } = useAuth()
  const { places, deletePlace } = usePlaces()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)

  // Find profile user (for now use current user if username matches)
  const isOwn = user?.username === username
  const profileUser = isOwn ? user : { username, displayName: username }

  const userPlaces = useMemo(
    () => places.filter(p => p.username === username),
    [places, username]
  )

  const handleDelete = (place) => {
    if (confirm(`Hapus "${place.name}"?`)) {
      deletePlace(place.id)
    }
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 text-center">
        <div>
          <div className="text-5xl mb-4">👤</div>
          <p className="font-display font-semibold text-xl">User tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cover image */}
      <div className="relative h-52 md:h-64 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 overflow-hidden">
        {profileUser.coverImage ? (
          <img src={profileUser.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full">
            {/* // cover photo user */}
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #FFD93D 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }}
            />
          </div>
        )}
      </div>

      {/* Profile info */}
      <div className="page-container">
        <div className="relative -mt-16 pb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-float bg-gradient-to-br from-primary-400 to-primary-600 shrink-0">
            {profileUser.avatar ? (
              <img src={profileUser.avatar} alt={profileUser.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {/* // avatar user */}
                <span className="text-white font-display font-bold text-4xl">
                  {profileUser.displayName?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name + actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display font-bold text-2xl text-dark">{profileUser.displayName}</h1>
              <p className="text-muted font-body text-sm">@{profileUser.username}</p>
            </motion.div>

            {isOwn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 btn-outline text-sm py-2"
              >
                <Settings size={15} />
                Edit Profil
              </motion.button>
            )}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex gap-8 pb-6 border-b border-gray-100"
        >
          {[
            { label: 'Tempat', value: userPlaces.length },
            { label: 'Pengikut', value: profileUser.followers || 0 },
            { label: 'Mengikuti', value: profileUser.following || 0 },
          ].map(stat => (
            <motion.div key={stat.label} variants={fadeUpVariant} className="text-center">
              <p className="font-display font-bold text-xl text-dark">{stat.value}</p>
              <p className="text-xs text-muted font-body">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio */}
        {profileUser.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-5 border-b border-gray-100"
          >
            <p className="text-dark/80 font-body text-sm leading-relaxed">{profileUser.bio}</p>
            {profileUser.joinedAt && (
              <div className="flex items-center gap-1.5 mt-2 text-muted text-xs font-body">
                <Calendar size={12} />
                Bergabung sejak {formatDate(profileUser.joinedAt)}
              </div>
            )}
          </motion.div>
        )}

        {/* Places grid */}
        <div className="py-8">
          <AnimatedSection className="flex items-center gap-2 mb-6">
            <Grid size={18} className="text-dark" />
            <h2 className="font-display font-semibold text-lg text-dark">
              Postingan {isOwn ? 'Saya' : profileUser.displayName}
            </h2>
            <span className="text-xs font-body text-muted bg-gray-100 px-2 py-0.5 rounded-full">
              {userPlaces.length}
            </span>
          </AnimatedSection>

          {userPlaces.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📝</div>
              <p className="font-display font-semibold text-xl text-dark mb-2">Belum ada postingan</p>
              {isOwn && (
                <>
                  <p className="text-muted font-body text-sm mb-5">Mulai bagikan tempat makan favoritmu!</p>
                  <Link to="/create" className="btn-primary">Tambah Tempat Pertama</Link>
                </>
              )}
            </div>
          ) : (
            <StaggerSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {userPlaces.map(place => (
                <motion.div key={place.id} variants={fadeUpVariant} className="relative group">
                  <PlaceCard place={place} />
                  {/* Owner action overlay */}
                  {isOwn && (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Link
                        to={`/place/${place.id}/edit`}
                        className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50"
                        onClick={e => e.stopPropagation()}
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={e => { e.preventDefault(); handleDelete(place) }}
                        className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </StaggerSection>
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal
            user={user}
            onClose={() => setEditOpen(false)}
            onSave={(data) => { updateProfile(data); setEditOpen(false) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
