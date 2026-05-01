import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const NO_FOOTER_ROUTES = ['/login', '/register']

export default function Layout() {
  const { pathname } = useLocation()
  const showFooter = !NO_FOOTER_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
