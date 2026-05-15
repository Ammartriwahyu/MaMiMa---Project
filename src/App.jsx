import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Layout from '@/components/layout/Layout'
import LandingPage    from '@/features/landing/pages/LandingPage'
import LoginPage      from '@/features/auth/pages/LoginPage'
import RegisterPage   from '@/features/auth/pages/RegisterPage'
import HomePage       from '@/features/places/pages/HomePage'
import ExplorePage    from '@/features/explore/pages/ExplorePage'
import PlaceDetailPage from '@/features/places/pages/PlaceDetailPage'
import CreatePlacePage from '@/features/places/pages/CreatePlacePage'
import EditPlacePage  from '@/features/places/pages/EditPlacePage'
import ProfilePage    from '@/features/profile/pages/ProfilePage'
import BookmarksPage  from '@/features/bookmarks/pages/BookmarksPage'

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"/>
        <span className="text-muted text-sm font-body">Memuat...</span>
      </div>
    </div>
  )
}

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader/>
  return user ? children : <Navigate to="/login" replace/>
}

function Public({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? children : <Navigate to="/home" replace/>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            {/* Public */}
            <Route path="/"       element={<LandingPage/>}/>
            <Route path="/explore" element={<ExplorePage/>}/>
            <Route path="/place/:id" element={<PlaceDetailPage/>}/>

            {/* Auth only */}
            <Route path="/login"    element={<Public><LoginPage/></Public>}/>
            <Route path="/register" element={<Public><RegisterPage/></Public>}/>

            {/* Protected */}
            <Route path="/home"              element={<Protected><HomePage/></Protected>}/>
            <Route path="/create"            element={<Protected><CreatePlacePage/></Protected>}/>
            <Route path="/place/:id/edit"    element={<Protected><EditPlacePage/></Protected>}/>
            <Route path="/profile/:username" element={<Protected><ProfilePage/></Protected>}/>
            <Route path="/bookmarks"         element={<Protected><BookmarksPage/></Protected>}/>

            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
