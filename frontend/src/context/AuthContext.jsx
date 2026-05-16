import { createContext, useContext, useState, useEffect } from 'react'
import { get, post } from '@/lib/apiClient'

const AuthContext = createContext(null)
const TOKEN_KEY = 'mamima_token'
const USER_KEY  = 'mamima_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const stored = localStorage.getItem(USER_KEY)
    if (token && stored) {
      setUser(JSON.parse(stored))
      get('/auth/me')
        .then(({ user }) => { setUser(user); localStorage.setItem(USER_KEY, JSON.stringify(user)) })
        .catch(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { user, token } = await post('/auth/login', { email, password })
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async ({ displayName, username, email, password }) => {
    const { user, token } = await post('/auth/register', { name: displayName, username, email, password })
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = async () => {
    try { await post('/auth/logout') } catch {}
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const updateUser = (updated) => {
    const merged = { ...user, ...updated }
    setUser(merged)
    localStorage.setItem(USER_KEY, JSON.stringify(merged))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
