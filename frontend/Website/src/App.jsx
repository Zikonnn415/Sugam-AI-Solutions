import { useEffect, useState } from 'react'
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './components/Logo.jsx'
import ChatBot from './components/ChatBot.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { Reveal } from './components/Reveal.jsx'
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const syncAuth = () => setIsAdminAuthenticated(Boolean(localStorage.getItem('nn_token')))
    window.addEventListener('storage',    syncAuth)
    window.addEventListener('focus',      syncAuth)
    window.addEventListener('authChange', syncAuth)
    syncAuth()
    return () => {
      window.removeEventListener('storage',    syncAuth)
      window.removeEventListener('focus',      syncAuth)
      window.removeEventListener('authChange', syncAuth)
    }
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const pageTitles = {
      '/':            'Home',
      '/services':    'Services',
      '/case-studies':'Case Studies',
      '/testimonials':'Testimonials',
      '/blog':        'Blog',
      '/events':      'Events',
      '/contact':     'Contact',
      '/admin':       'Admin Dashboard',
    }
    const current = pageTitles[location.pathname] || 'Page'
    document.title = `${current} | Sugam-AI Solutions`
  }, [location.pathname])

  // Admin link is intentionally excluded from the main nav
  const navigation = [
    { label: 'Services',    href: '/services' },
    { label: 'Case Studies',href: '/case-studies' },
    { label: 'Testimonials',href: '/testimonials' },
    { label: 'Blog',        href: '/blog' },
    { label: 'Events',      href: '/events' },
    { label: 'Contact',     href: '/contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col page-background">
      <ScrollToTop />

      {/* ── Header ── */}
      <header className={`site-header ${isScrolled ? 'site-header-scrolled' : ''}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 lg:gap-6 py-3 sm:py-3.5 lg:py-4">

            {/* Logo */}
            <Link to="/" className="flex items-center group shrink-0 min-w-0 max-w-[46%] sm:max-w-none">
              <Logo variant="header" className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto" />
            </Link>

            {/* Desktop Navigation — centered pill */}
            <div className="hidden lg:flex flex-1 justify-center px-2 min-w-0">
              <div className="nav-pill">
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
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                to={isAdminAuthenticated ? '/admin' : '/contact'}
                className="hidden lg:inline-flex btn-nav-cta"
              >
                {isAdminAuthenticated ? 'Admin Dashboard' : 'Get Started'}
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden nav-menu-btn"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile / tablet navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mobile-nav-panel pb-4">
              <div className="nav-pill nav-pill-mobile flex flex-col">
                {navigation.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) => `nav-link nav-link-mobile ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <Link
                to={isAdminAuthenticated ? '/admin' : '/contact'}
                className="btn-nav-cta w-full justify-center mt-3 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isAdminAuthenticated ? 'Admin Dashboard' : 'Get Started'}
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/services"        element={<Services />} />
          <Route path="/case-studies"    element={<CaseStudies />} />
          <Route path="/case-studies/:id"element={<CaseStudyDetail />} />
          <Route path="/testimonials"    element={<Testimonials />} />
          <Route path="/blog"            element={<Blog />} />
          <Route path="/blog/:id"        element={<BlogPost />} />
          <Route path="/events"          element={<Events />} />
          <Route path="/events/:id"      element={<EventDetail />} />
          <Route path="/contact"         element={<Contact />} />
          <Route path="/admin"           element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16"
              style={{ background: 'rgba(6,7,26,0.95)', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <Reveal as="div" className="col-span-1 md:col-span-2" variant="up">
              <div className="mb-5">
                <Logo variant="footer" className="h-16 sm:h-[4.5rem] md:h-20 w-auto" />
              </div>
              <p className="text-slate-400 mb-5 max-w-md leading-relaxed text-sm">
                Empowering Nepali businesses with cutting-edge AI solutions. We specialize in finance, tourism, retail, healthcare, and government transformation.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>📍 Hattisar, Kathmandu 44600, Nepal</p>
                <p>📞 +977-1-5551234</p>
                <p>✉️ hello@sugamaisolutions.com.np</p>
              </div>
            </Reveal>

            {/* Quick Links */}
            <Reveal as="div" variant="up" delay={80}>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Navigation</h3>
              <ul className="space-y-3 text-sm">
                {['Services', 'Case Studies', 'Testimonials', 'Blog', 'Events', 'Contact'].map((l) => (
                  <li key={l}>
                    <Link
                      to={`/${l.toLowerCase().replace(' ', '-')}`}
                      className="text-slate-500 hover:text-indigo-400 link-hover"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Services + Admin Portal */}
            <Reveal as="div" variant="up" delay={160}>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5">Services</h3>
              <ul className="space-y-3 text-sm text-slate-500 mb-8">
                {['AI Prototyping', 'Virtual Assistant', 'Data Engineering', 'ML Consulting', 'Cloud Integration'].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              {/* Admin portal — discreet, below Services */}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                <p className="text-xs text-slate-700 uppercase tracking-wider mb-2 font-semibold">Staff Access</p>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-400 transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                  {isAdminAuthenticated ? '⚙ Admin Dashboard' : 'Admin Login'}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" variant="fade"
               style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
            <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} Sugam-AI Solutions. All rights reserved.</p>
            <p className="text-sm text-slate-600">
              Built by <span className="text-indigo-400 font-medium">Sugam Shrestha</span> · Kathmandu, Nepal
            </p>
          </Reveal>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}

export default App
