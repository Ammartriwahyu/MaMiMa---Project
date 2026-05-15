import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const NO_FOOTER = ['/login', '/register']

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      {!NO_FOOTER.includes(pathname) && <Footer />}
    </div>
  )
}
