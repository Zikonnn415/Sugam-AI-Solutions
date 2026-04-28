import { useEffect, useState } from 'react'
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './components/Logo.jsx'
import ChatBot from './components/ChatBot.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import CaseStudies from './pages/CaseStudies.jsx'
import Testimonials from './pages/Testimonials.jsx'
import Blog from './pages/Blog.jsx'
import Events from './pages/Events.jsx'
import Contact from './pages/Contact.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import BlogPost from './pages/BlogPost.jsx'
import CaseStudyDetail from './pages/CaseStudyDetail.jsx'
import EventDetail from './pages/EventDetail.jsx'

function App() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    Boolean(localStorage.getItem('nn_token'))
  )

  useEffect(() => {
    const syncAdminAuthState = () => {
      setIsAdminAuthenticated(Boolean(localStorage.getItem('nn_token')))
    }

    // Listen for custom auth change event (for immediate updates)
    const handleAuthChange = () => {
      setIsAdminAuthenticated(Boolean(localStorage.getItem('nn_token')))
    }

    window.addEventListener('storage', syncAdminAuthState)
    window.addEventListener('focus', syncAdminAuthState)
    window.addEventListener('authChange', handleAuthChange)
    syncAdminAuthState()

    return () => {
      window.removeEventListener('storage', syncAdminAuthState)
      window.removeEventListener('focus', syncAdminAuthState)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  useEffect(() => {
    const pageTitles = {
      '/': 'Home',
      '/services': 'Services',
      '/case-studies': 'Case Studies',
      '/testimonials': 'Testimonials',
      '/blog': 'Blog',
      '/events': 'Events',
      '/contact': 'Contact',
      '/admin': 'Admin Dashboard'
    }
    const current = pageTitles[location.pathname] || 'Page'
    document.title = `${current} | Sugam-AI Solutions`
  }, [location.pathname])

  const navigation = [
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Blog', href: '/blog' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
    { label: 'Admin', href: '/admin' }
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{background:'linear-gradient(160deg,#06071a 0%,#0d1130 50%,#080c22 100%)'}}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{background:'rgba(6,7,26,0.92)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(99,102,241,0.15)',boxShadow:'0 4px 32px -8px rgba(79,70,229,0.18)'}}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <Logo size={38} />
              <span className="text-2xl font-bold text-gradient">Sugam-AI Solutions</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <Link to={isAdminAuthenticated ? "/admin" : "/contact"} className="hidden md:inline-flex btn-accent text-xs px-4 py-2">
                {isAdminAuthenticated ? 'Admin Dashboard' : 'Get Started'}
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)'}}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4" style={{borderTop:'1px solid rgba(99,102,241,0.15)'}}>
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} px-4 py-3 rounded-lg`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<Services/>} />
          <Route path="/case-studies" element={<CaseStudies/>} />
          <Route path="/case-studies/:id" element={<CaseStudyDetail/>} />
          <Route path="/testimonials" element={<Testimonials/>} />
          <Route path="/blog" element={<Blog/>} />
          <Route path="/blog/:id" element={<BlogPost/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/events/:id" element={<EventDetail/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-16" style={{background:'rgba(6,7,26,0.95)',borderTop:'1px solid rgba(99,102,241,0.15)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-5">
                <Logo size={34} />
                <span className="text-xl font-bold text-gradient">Sugam-AI Solutions</span>
              </div>
              <p className="text-slate-400 mb-5 max-w-md leading-relaxed text-sm">
                Empowering Nepali businesses with cutting-edge AI solutions. We specialize in finance, tourism, retail, healthcare, and government transformation.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>📍 Hattisar, Kathmandu 44600, Nepal</p>
                <p>📞 +977-1-5551234</p>
                <p>✉️ hello@sugamaisolutions.com.np</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Navigation</h3>
              <ul className="space-y-3 text-sm">
                {['Services','Case Studies','Testimonials','Blog','Contact'].map(l => (
                  <li key={l}>
                    <Link to={`/${l.toLowerCase().replace(' ','-')}`} className="text-slate-500 hover:text-indigo-400 transition-colors">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Services</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                {['AI Prototyping','Virtual Assistant','Data Engineering','ML Consulting','Cloud Integration'].map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{borderTop:'1px solid rgba(99,102,241,0.1)'}}>
            <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} Sugam-AI Solutions. All rights reserved.</p>
            <p className="text-sm text-slate-600">Built by <span className="text-indigo-400 font-medium">Sugam Shrestha</span> · Kathmandu, Nepal</p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}

export default App
