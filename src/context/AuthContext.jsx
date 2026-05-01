import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Dummy users stored in localStorage
const USERS_KEY = 'mamima_users'
const AUTH_KEY = 'mamima_auth'

const defaultUsers = [
  {
    id: 'u1',
    username: 'foodie_malang',
    email: 'foodie@example.com',
    password: 'password123',
    displayName: 'Foodie Malang',
    bio: 'Pecinta kuliner Malang 🍜 | Selalu hunting tempat makan baru!',
    avatar: null, // // avatar image
    coverImage: null, // // cover image
    joinedAt: '2024-01-15',
    followers: 234,
    following: 89,
  },
  {
    id: 'u2',
    username: 'kuliner_joss',
    email: 'kuliner@example.com',
    password: 'password123',
    displayName: 'Kuliner Joss',
    bio: 'Content creator kuliner 📸 | Malang based',
    avatar: null,
    coverImage: null,
    joinedAt: '2024-02-20',
    followers: 512,
    following: 120,
  },
]

function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  } catch {
    return defaultUsers
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(AUTH_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const users = loadUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Email atau password salah.')
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser))
    return safeUser
  }

  const register = async ({ username, email, password, displayName }) => {
    const users = loadUsers()
    if (users.find(u => u.email === email)) throw new Error('Email sudah terdaftar.')
    if (users.find(u => u.username === username)) throw new Error('Username sudah digunakan.')
    const newUser = {
      id: `u${Date.now()}`,
      username,
      email,
      password,
      displayName: displayName || username,
      bio: '',
      avatar: null,
      coverImage: null,
      joinedAt: new Date().toISOString().split('T')[0],
      followers: 0,
      following: 0,
    }
    saveUsers([...users, newUser])
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser))
    return safeUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
    // Also update in users store
    const users = loadUsers()
    saveUsers(users.map(u => u.id === updated.id ? { ...u, ...updates } : u))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
