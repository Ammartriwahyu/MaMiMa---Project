import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Trash2, Loader2 } from 'lucide-react'
import { useComments } from '../hooks/useComments'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { fadeUp } from '@/design-system/tokens'

export default function CommentSection({ placeId }) {
  const { user }                = useAuth()
  const navigate                = useNavigate()
  const { comments, loading, addComment, deleteComment } = useComments(placeId)
  const [text, setText]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await addComment(text.trim())
      setText('')
    } catch (e) { setError(e.message) } finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus komentar ini?')) return
    try { await deleteComment(id) } catch (e) { alert(e.message) }
  }

  return (
    <div>
      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            {user.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="text-white font-bold text-sm">{user.displayName?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Tulis komentar..."
                rows={2}
                className="input-field resize-none flex-1 text-sm"
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(e) }}
              />
              <button type="submit" disabled={submitting || !text.trim()}
                className="btn-primary text-xs px-3 py-2 self-start flex items-center gap-1.5 disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={13} />}
                Kirim
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </form>
      ) : (
        <div className="mb-5 bg-surface rounded-2xl p-4 text-center">
          <p className="text-sm text-muted mb-2">Masuk untuk berkomentar</p>
          <button onClick={() => navigate('/login')} className="btn-primary text-xs py-2 px-4">Masuk</button>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-6 text-muted text-sm">Memuat komentar...</div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted text-center py-6 bg-surface rounded-2xl">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map(c => (
              <motion.div key={c.id} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3 p-3 bg-surface rounded-2xl">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center">
                  {c.userAvatar
                    ? <img src={c.userAvatar} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white font-bold text-xs">{c.username?.[0]?.toUpperCase()}</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-dark">{c.userDisplay || c.username}</span>
                    <span className="text-[10px] text-muted">@{c.username}</span>
                    <span className="text-[10px] text-muted ml-auto">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-dark/80 leading-relaxed break-words">{c.content}</p>
                </div>

                {user?.id === c.userId && (
                  <button onClick={() => handleDelete(c.id)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-muted hover:text-red-400 transition-colors shrink-0">
                    <Trash2 size={12} />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
