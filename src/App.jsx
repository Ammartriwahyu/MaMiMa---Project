import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'

// Pages
import LandingPage from '@/features/landing/pages/LandingPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import HomePage from '@/features/home/pages/HomePage'
import ExplorePage from '@/features/explore/pages/ExplorePage'
import PlaceDetailPage from '@/features/place/pages/PlaceDetailPage'
import CreatePlacePage from '@/features/place/pages/CreatePlacePage'
import EditPlacePage from '@/features/place/pages/EditPlacePage'
import ProfilePage from '@/features/profile/pages/ProfilePage'

// Protected route: redirect to /login if not authenticated
function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <span className="text-muted font-body text-sm">Memuat...</span>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

// Public route: redirect to /home if already authenticated
function Public({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/home" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/place/:id" element={<PlaceDetailPage />} />

            {/* Auth routes (redirect if logged in) */}
            <Route path="/login" element={<Public><LoginPage /></Public>} />
            <Route path="/register" element={<Public><RegisterPage /></Public>} />

            {/* Protected routes */}
            <Route path="/home" element={<Protected><HomePage /></Protected>} />
            <Route path="/create" element={<Protected><CreatePlacePage /></Protected>} />
            <Route path="/place/:id/edit" element={<Protected><EditPlacePage /></Protected>} />
            <Route path="/profile/:username" element={<Protected><ProfilePage /></Protected>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
