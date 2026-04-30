import { useEffect, useState, useCallback } from 'react'
import {
  LayoutDashboard, FileText, Briefcase, Star, CalendarDays,
  LogOut, X, Eye, CheckCircle, Clock, Trash2, PenLine, Plus,
  AlertTriangle, Save, ChevronRight, RefreshCw, Search
} from 'lucide-react'

const BASE = 'http://127.0.0.1:8000/api'

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  const colors = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171' },
    info:    { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)', text: '#818cf8' },
  }
  const c = colors[type] || colors.info
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium shadow-2xl animate-fade-in"
         style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, backdropFilter: 'blur(12px)', minWidth: 240 }}>
      {type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
      {type === 'error'   && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
      {message}
      <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  )
}

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"
         style={{ background: 'rgba(6,7,26,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6"
           style={{ background: 'rgba(13,17,48,0.98)', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 32px 80px -16px rgba(239,68,68,0.2)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-300 transition-colors"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ── Form Field ────────────────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = { background: 'rgba(13,17,48,0.8)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '9px 13px', color: '#e2e8f0', fontSize: 14, width: '100%', outline: 'none', transition: 'border-color 0.2s' }
const textareaStyle = { ...inp, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }

// ── Shared table components ───────────────────────────────────────────────────
const Th = ({ children }) => (
  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</th>
)
const Td = ({ children, className = '' }) => (
  <td className={`py-3 px-4 text-sm text-slate-300 ${className}`}>{children}</td>
)

// ── Status Badge ──────────────────────────────────────────────────────────────
function Badge({ reviewed }) {
  return reviewed
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
        <CheckCircle className="w-3 h-3" />Reviewed
      </span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
        <Clock className="w-3 h-3" />Pending
      </span>
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [token, setToken]   = useState('')
  const [creds, setCreds]   = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [stats, setStats]   = useState(null)
  const [activeTab, setActiveTab] = useState('Inquiries')

  const [inquiries,    setInquiries]    = useState([])
  const [blogs,        setBlogs]        = useState([])
  const [cases,        setCases]        = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [events,       setEvents]       = useState([])

  const [loading,  setLoading]  = useState(false)
  const [toast,    setToast]    = useState(null)
  const [confirm,  setConfirm]  = useState(null)   // { message, onConfirm }

  // Search / filter
  const [searchTerm,       setSearchTerm]       = useState('')
  const [filterUnreviewed, setFilterUnreviewed] = useState(false)

  // Modals
  const [inquiryModal, setInquiryModal] = useState(null)  // selected inquiry obj
  const [formModal,    setFormModal]    = useState(null)   // { type, item|null }
  const [showLogout,   setShowLogout]   = useState(false)

  const showToast = (message, type = 'success') => setToast({ message, type })

  const authH = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token])

  // ── Auto-login from stored token ──────────────────────────────────────────
  useEffect(() => {
    const t = localStorage.getItem('nn_token')
    if (t) {
      fetch(`${BASE}/inquiries/`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => { if (r.ok) setToken(t); else localStorage.removeItem('nn_token') })
        .catch(() => localStorage.removeItem('nn_token'))
    }
  }, [])

  // ── Fetch stats (always) + data (when authenticated) ─────────────────────
  const refreshStats = useCallback(() => {
    fetch(`${BASE}/analytics/`).then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const fetchAll = useCallback(async (tok) => {
    if (!tok) return
    setLoading(true)
    try {
      const [ri, rb, rc, rt, re] = await Promise.all([
        fetch(`${BASE}/inquiries/?limit=1000`, { headers: { Authorization: `Bearer ${tok}` } }),
        fetch(`${BASE}/blogs/?limit=1000`),
        fetch(`${BASE}/case-studies/?limit=1000`),
        fetch(`${BASE}/testimonials/?limit=1000`),
        fetch(`${BASE}/events/?limit=1000`),
      ])
      const [di, db, dc, dt, de] = await Promise.all([ri.json(), rb.json(), rc.json(), rt.json(), re.json()])
      setInquiries(di?.results    || [])
      setBlogs(db?.results        || [])
      setCases(dc?.results        || [])
      setTestimonials(dt?.results || [])
      setEvents(de?.results       || [])
    } catch { showToast('Failed to load data', 'error') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    refreshStats()
    if (token) fetchAll(token)
  }, [token, refreshStats, fetchAll])

  // ── Login ─────────────────────────────────────────────────────────────────
  const onLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const r = await fetch(`${BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      })
      if (!r.ok) throw new Error()
      const d = await r.json()
      const tok = d.access || d.token
      localStorage.setItem('nn_token', tok)
      setToken(tok)
      window.dispatchEvent(new CustomEvent('authChange'))
    } catch {
      setLoginError('Invalid username or password')
    } finally {
      setLoginLoading(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const doLogout = () => {
    localStorage.removeItem('nn_token')
    setToken(''); setInquiries([]); setBlogs([]); setCases([]); setTestimonials([]); setEvents([])
    setStats(null); setShowLogout(false)
    window.dispatchEvent(new CustomEvent('authChange'))
  }

  // ── Inquiry actions ───────────────────────────────────────────────────────
  const toggleReview = async (id) => {
    const r = await fetch(`${BASE}/inquiries/${id}/toggle-review/`, { method: 'PATCH', headers: authH() })
    if (r.ok) {
      const d = await r.json()
      const next = Boolean(d?.is_reviewed)
      setInquiries(p => p.map(x => x.id === id ? { ...x, reviewed: next } : x))
      if (inquiryModal?.id === id) setInquiryModal(prev => ({ ...prev, reviewed: next }))
      refreshStats()
      showToast(`Marked as ${next ? 'reviewed' : 'unreviewed'}`)
    }
  }

  const deleteInquiry = (id) => {
    setConfirm({
      message: 'Delete this inquiry? This action cannot be undone.',
      onConfirm: async () => {
        setConfirm(null)
        const r = await fetch(`${BASE}/inquiries/${id}/`, { method: 'DELETE', headers: authH() })
        if (r.ok) {
          setInquiries(p => p.filter(x => x.id !== id))
          setInquiryModal(null)
          refreshStats()
          showToast('Inquiry deleted')
        } else {
          showToast('Failed to delete inquiry', 'error')
        }
      }
    })
  }

  // ── Generic CRUD ──────────────────────────────────────────────────────────
  const endpointMap = { Blogs: 'blogs', 'Case Studies': 'case-studies', Testimonials: 'testimonials', Events: 'events' }

  const saveItem = async (type, formData, editId) => {
    const ep = endpointMap[type]
    const url   = editId ? `${BASE}/${ep}/${editId}/` : `${BASE}/${ep}/`
    const method = editId ? 'PUT' : 'POST'
    const r = await fetch(url, { method, headers: authH(), body: JSON.stringify(formData) })
    if (!r.ok) {
      const err = await r.json().catch(() => ({}))
      throw new Error(Object.values(err).flat().join(' ') || 'Save failed')
    }
    return r.json()
  }

  const deleteItem = (type, id) => {
    const ep = endpointMap[type]
    setConfirm({
      message: `Delete this ${type.slice(0, -1).toLowerCase()}? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null)
        const r = await fetch(`${BASE}/${ep}/${id}/`, { method: 'DELETE', headers: authH() })
        if (r.ok) {
          const setter = { Blogs: setBlogs, 'Case Studies': setCases, Testimonials: setTestimonials, Events: setEvents }[type]
          setter(p => p.filter(x => x.id !== id))
          refreshStats()
          showToast(`${type.slice(0, -1)} deleted`)
        } else {
          showToast('Failed to delete', 'error')
        }
      }
    })
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { label: 'Inquiries',    icon: LayoutDashboard },
    { label: 'Blogs',        icon: FileText },
    { label: 'Case Studies', icon: Briefcase },
    { label: 'Testimonials', icon: Star },
    { label: 'Events',       icon: CalendarDays },
  ]

  const statCards = stats ? [
    { label: 'Total Inquiries', value: stats.inquiries,            color: 'text-indigo-400' },
    { label: 'Pending Review',  value: stats.unreviewed_inquiries, color: 'text-amber-400' },
    { label: 'Blog Posts',      value: stats.blogs,                color: 'text-violet-400' },
    { label: 'Case Studies',    value: stats.case_studies,         color: 'text-emerald-400' },
    { label: 'Testimonials',    value: stats.testimonials,         color: 'text-sky-400' },
    { label: 'Events',          value: stats.events,               color: 'text-rose-400' },
  ] : []

  // ── Filtered inquiries ────────────────────────────────────────────────────
  const displayedInquiries = inquiries.filter(x => {
    if (filterUnreviewed && x.reviewed) return false
    if (searchTerm && !`${x.name} ${x.email} ${x.company}`.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-5"
                 style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <LayoutDashboard className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to manage your content</p>
          </div>

          <form onSubmit={onLogin} className="space-y-4 rounded-2xl p-7"
                style={{ background: 'rgba(13,17,48,0.85)', border: '1px solid rgba(99,102,241,0.18)', boxShadow: '0 24px 64px -16px rgba(79,70,229,0.2)' }}>
            <Field label="Username" required>
              <input style={inp} placeholder="admin" value={creds.username} autoFocus
                     onChange={e => setCreds({ ...creds, username: e.target.value })} />
            </Field>
            <Field label="Password" required>
              <input type="password" style={inp} placeholder="••••••••" value={creds.password}
                     onChange={e => setCreds({ ...creds, password: e.target.value })} />
            </Field>
            {loginError && (
              <div className="flex items-center gap-2 text-red-400 text-sm px-3 py-2.5 rounded-lg"
                   style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />{loginError}
              </div>
            )}
            <button type="submit" disabled={loginLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 8px 24px -8px rgba(99,102,241,0.5)' }}>
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Sign In <ChevronRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all Sugam-AI Solutions content</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchAll(token)}
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => setShowLogout(true)}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium text-white transition-colors"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map(({ label, value, color }, i) => (
            <div key={i} className="rounded-xl p-4 text-center"
                 style={{ background: 'rgba(13,17,48,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
              <div className={`text-2xl font-bold ${color}`}>{value ?? '—'}</div>
              <div className="text-xs text-slate-600 mt-1 font-medium uppercase tracking-wider leading-tight">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: 'rgba(99,102,241,0.12)', paddingBottom: '1px' }}>
        {tabs.map(({ label, icon: Icon }) => (
          <button key={label}
                  onClick={() => { setActiveTab(label); setSearchTerm('') }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-t-xl ${
                    activeTab === label ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  style={activeTab === label
                    ? { background: 'rgba(99,102,241,0.15)', borderBottom: '2px solid #6366f1', marginBottom: -1 }
                    : {}}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" /> Loading…
        </div>
      )}

      {/* ── INQUIRIES ── */}
      {!loading && activeTab === 'Inquiries' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                     placeholder="Search by name, email, company…"
                     style={{ ...inp, paddingLeft: 36 }} />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
              <input type="checkbox" className="rounded" checked={filterUnreviewed}
                     onChange={e => setFilterUnreviewed(e.target.checked)} />
              Unreviewed only
            </label>
            <span className="text-xs text-slate-600">({displayedInquiries.length} shown)</span>
          </div>

          <div className="rounded-xl overflow-x-auto"
               style={{ background: 'rgba(13,17,48,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <table className="w-full">
              <thead style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                <tr><Th>Name</Th><Th>Email</Th><Th>Company</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th></tr>
              </thead>
              <tbody>
                {displayedInquiries.map(x => (
                  <tr key={x.id} className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid rgba(99,102,241,0.07)' }}>
                    <Td className="font-medium text-slate-200">{x.name}</Td>
                    <Td>{x.email}</Td>
                    <Td>{x.company || '—'}</Td>
                    <Td><Badge reviewed={x.reviewed} /></Td>
                    <Td className="text-slate-500 text-xs">{new Date(x.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <div className="flex gap-1.5 flex-wrap">
                        <button onClick={() => setInquiryModal(x)}
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-indigo-300 transition-colors"
                                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                          <Eye className="w-3.5 h-3.5" />View
                        </button>
                        <button onClick={() => toggleReview(x.id)}
                                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${x.reviewed
                                  ? 'text-amber-300' : 'text-emerald-300'}`}
                                style={x.reviewed
                                  ? { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }
                                  : { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                          {x.reviewed ? 'Unreview' : 'Review'}
                        </button>
                        <button onClick={() => deleteInquiry(x.id)}
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-red-400 transition-colors"
                                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {displayedInquiries.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-slate-600 text-sm">No inquiries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BLOGS ── */}
      {!loading && activeTab === 'Blogs' && (
        <ContentTable
          items={blogs} type="Blogs"
          headers={['Title', 'Excerpt', 'Date']}
          renderRow={(b) => [
            <span className="font-medium text-slate-200 line-clamp-1">{b.title}</span>,
            <span className="text-slate-500 line-clamp-1 max-w-xs">{b.excerpt || '—'}</span>,
            <span className="text-slate-500 text-xs">{new Date(b.created_at || b.published_at).toLocaleDateString()}</span>,
          ]}
          onAdd={() => setFormModal({ type: 'Blogs', item: null })}
          onEdit={(b) => setFormModal({ type: 'Blogs', item: b })}
          onDelete={(b) => deleteItem('Blogs', b.id)}
        />
      )}

      {/* ── CASE STUDIES ── */}
      {!loading && activeTab === 'Case Studies' && (
        <ContentTable
          items={cases} type="Case Studies"
          headers={['Title', 'Summary', 'Date']}
          renderRow={(c) => [
            <span className="font-medium text-slate-200">{c.name || c.title}</span>,
            <span className="text-slate-500 line-clamp-1 max-w-xs">{c.summary || '—'}</span>,
            <span className="text-slate-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</span>,
          ]}
          onAdd={() => setFormModal({ type: 'Case Studies', item: null })}
          onEdit={(c) => setFormModal({ type: 'Case Studies', item: c })}
          onDelete={(c) => deleteItem('Case Studies', c.id)}
        />
      )}

      {/* ── TESTIMONIALS ── */}
      {!loading && activeTab === 'Testimonials' && (
        <ContentTable
          items={testimonials} type="Testimonials"
          headers={['Author', 'Company', 'Rating', 'Date']}
          renderRow={(t) => [
            <span className="font-medium text-slate-200">{t.author || t.client_name}</span>,
            <span className="text-slate-500">{t.company || t.organisation || '—'}</span>,
            <span className="text-amber-400 text-base tracking-tight">{'★'.repeat(t.rating || t.stars || 5)}</span>,
            <span className="text-slate-500 text-xs">{new Date(t.created_at).toLocaleDateString()}</span>,
          ]}
          onAdd={() => setFormModal({ type: 'Testimonials', item: null })}
          onEdit={(t) => setFormModal({ type: 'Testimonials', item: t })}
          onDelete={(t) => deleteItem('Testimonials', t.id)}
        />
      )}

      {/* ── EVENTS ── */}
      {!loading && activeTab === 'Events' && (
        <ContentTable
          items={events} type="Events"
          headers={['Title', 'Event Date', 'Description', 'Created']}
          renderRow={(ev) => [
            <span className="font-medium text-slate-200">{ev.title}</span>,
            <span className="text-indigo-300 text-xs font-medium">{new Date(ev.date || ev.event_date).toLocaleDateString()}</span>,
            <span className="text-slate-500 line-clamp-1 max-w-xs">{ev.description || '—'}</span>,
            <span className="text-slate-500 text-xs">{new Date(ev.created_at).toLocaleDateString()}</span>,
          ]}
          onAdd={() => setFormModal({ type: 'Events', item: null })}
          onEdit={(ev) => setFormModal({ type: 'Events', item: ev })}
          onDelete={(ev) => deleteItem('Events', ev.id)}
        />
      )}

      {/* ── INQUIRY DETAIL MODAL ── */}
      {inquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(6,7,26,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
               style={{ background: 'rgba(13,17,48,0.98)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 32px 80px -16px rgba(79,70,229,0.4)' }}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-100">Inquiry Details</h3>
                <button onClick={() => setInquiryModal(null)} className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                {[
                  ['Name',       inquiryModal.name],
                  ['Email',      inquiryModal.email],
                  ['Phone',      inquiryModal.phone || '—'],
                  ['Company',    inquiryModal.company || '—'],
                  ['Country',    inquiryModal.country || '—'],
                  ['Job Title',  inquiryModal.job_title || '—'],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-slate-200 text-sm">{val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Project Details</div>
                <div className="p-4 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-wrap"
                     style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)' }}>
                  {inquiryModal.job_details || '—'}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-6">
                <span>Submitted: {new Date(inquiryModal.created_at).toLocaleString()}</span>
                <Badge reviewed={inquiryModal.reviewed} />
              </div>

              <div className="flex gap-3 pt-5" style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <button onClick={() => { toggleReview(inquiryModal.id); setInquiryModal(null) }}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                        style={inquiryModal.reviewed
                          ? { background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }
                          : { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                  {inquiryModal.reviewed ? 'Mark Unreviewed' : 'Mark Reviewed'}
                </button>
                <button onClick={() => deleteInquiry(inquiryModal.id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  Delete
                </button>
                <button onClick={() => setInquiryModal(null)}
                        className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-slate-400 transition-colors"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT FORM MODAL ── */}
      {formModal && (
        <ContentFormModal
          type={formModal.type}
          item={formModal.item}
          onClose={() => setFormModal(null)}
          onSave={async (data) => {
            try {
              const saved = await saveItem(formModal.type, data, formModal.item?.id)
              const setters = { Blogs: setBlogs, 'Case Studies': setCases, Testimonials: setTestimonials, Events: setEvents }
              const setter  = setters[formModal.type]
              if (formModal.item) {
                setter(p => p.map(x => x.id === saved.id ? saved : x))
                showToast(`${formModal.type.slice(0, -1)} updated`)
              } else {
                setter(p => [saved, ...p])
                showToast(`${formModal.type.slice(0, -1)} created`)
              }
              refreshStats()
              setFormModal(null)
            } catch (err) {
              showToast(err.message || 'Save failed', 'error')
            }
          }}
        />
      )}

      {/* ── LOGOUT CONFIRM ── */}
      {showLogout && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"
             style={{ background: 'rgba(6,7,26,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6"
               style={{ background: 'rgba(13,17,48,0.98)', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 32px 80px -16px rgba(79,70,229,0.3)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(239,68,68,0.12)' }}>
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-100">Sign Out</h3>
                <p className="text-slate-500 text-xs mt-0.5">You'll need to log in again to make changes.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)}
                      className="flex-1 py-2 rounded-lg text-sm text-slate-300 transition-colors"
                      style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>Cancel</button>
              <button onClick={doLogout}
                      className="flex-1 py-2 rounded-lg text-sm text-white font-medium bg-red-600 hover:bg-red-700 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      {/* ── TOAST ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Table (Blogs / Case Studies / Testimonials / Events)
// ─────────────────────────────────────────────────────────────────────────────
function ContentTable({ items, type, headers, renderRow, onAdd, onEdit, onDelete }) {
  const singular = type === 'Case Studies' ? 'Case Study' : type.slice(0, -1)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-sm">{items.length} {type.toLowerCase()} total</p>
        <button onClick={onAdd}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)' }}>
          <Plus className="w-4 h-4" /> Add {singular}
        </button>
      </div>

      <div className="rounded-xl overflow-x-auto"
           style={{ background: 'rgba(13,17,48,0.7)', border: '1px solid rgba(99,102,241,0.12)' }}>
        <table className="w-full">
          <thead style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
            <tr>
              {headers.map(h => <Th key={h}>{h}</Th>)}
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors"
                  style={{ borderBottom: '1px solid rgba(99,102,241,0.07)' }}>
                {renderRow(item).map((cell, i) => <Td key={i}>{cell}</Td>)}
                <Td>
                  <div className="flex gap-1.5">
                    <button onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-indigo-300 transition-colors"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <PenLine className="w-3.5 h-3.5" />Edit
                    </button>
                    <button onClick={() => onDelete(item)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-red-400 transition-colors"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={headers.length + 1} className="py-12 text-center text-slate-600 text-sm">
                No {type.toLowerCase()} yet. Add one to get started.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Form Modal
// ─────────────────────────────────────────────────────────────────────────────
function ContentFormModal({ type, item, onClose, onSave }) {
  const isEdit = Boolean(item)
  const singular = type === 'Case Studies' ? 'Case Study' : type.slice(0, -1)

  // Initialise form state based on type
  const initState = () => {
    if (type === 'Blogs') return {
      title:           item?.title           || '',
      excerpt:         item?.excerpt         || '',
      content:         item?.content         || item?.body || '',
      cover_image_url: item?.cover_image_url || item?.cover_url || '',
    }
    if (type === 'Case Studies') return {
      name:      item?.name      || item?.title       || '',
      summary:   item?.summary   || '',
      details:   item?.details   || item?.description || '',
      image_url: item?.image_url || '',
    }
    if (type === 'Testimonials') return {
      author:    item?.author    || item?.client_name  || '',
      company:   item?.company   || item?.organisation || '',
      rating:    item?.rating    || item?.stars        || 5,
      text:      item?.text      || item?.feedback     || '',
    }
    if (type === 'Events') return {
      title:       item?.title       || '',
      date:        item?.date        || item?.event_date || '',
      description: item?.description || '',
      image_url:   item?.image_url   || '',
    }
    return {}
  }

  const [form, setForm] = useState(initState)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setSaving(true)
    try {
      await onSave(form)
    } catch (e) {
      setErr(e.message || 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(6,7,26,0.88)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl"
           style={{ background: 'rgba(13,17,48,0.98)', border: '1px solid rgba(99,102,241,0.28)', boxShadow: '0 40px 100px -20px rgba(79,70,229,0.4)' }}>

        {/* Modal header */}
        <div className="flex items-center justify-between p-6"
             style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
              {isEdit ? <PenLine className="w-4 h-4 text-indigo-400" /> : <Plus className="w-4 h-4 text-indigo-400" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{isEdit ? `Edit ${singular}` : `Add ${singular}`}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{isEdit ? 'Update the details below' : 'Fill in the details to create a new entry'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* BLOGS */}
          {type === 'Blogs' && (<>
            <Field label="Title" required>
              <input style={inp} value={form.title} onChange={e => set('title', e.target.value)}
                     placeholder="Blog post title" required />
            </Field>
            <Field label="Excerpt">
              <input style={inp} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                     placeholder="Short summary shown in listing" />
            </Field>
            <Field label="Content" required>
              <textarea style={{ ...textareaStyle, minHeight: 160 }} value={form.content}
                        onChange={e => set('content', e.target.value)} placeholder="Full article content…" />
            </Field>
            <Field label="Cover Image URL">
              <input style={inp} value={form.cover_image_url} onChange={e => set('cover_image_url', e.target.value)}
                     placeholder="https://example.com/image.jpg" type="url" />
            </Field>
          </>)}

          {/* CASE STUDIES */}
          {type === 'Case Studies' && (<>
            <Field label="Title" required>
              <input style={inp} value={form.name} onChange={e => set('name', e.target.value)}
                     placeholder="Case study title" required />
            </Field>
            <Field label="Summary" required>
              <input style={inp} value={form.summary} onChange={e => set('summary', e.target.value)}
                     placeholder="One-line summary" required />
            </Field>
            <Field label="Details">
              <textarea style={{ ...textareaStyle, minHeight: 140 }} value={form.details}
                        onChange={e => set('details', e.target.value)} placeholder="Full description of the case study…" />
            </Field>
            <Field label="Image URL">
              <input style={inp} value={form.image_url} onChange={e => set('image_url', e.target.value)}
                     placeholder="https://example.com/image.jpg" type="url" />
            </Field>
          </>)}

          {/* TESTIMONIALS */}
          {type === 'Testimonials' && (<>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Author Name" required>
                <input style={inp} value={form.author} onChange={e => set('author', e.target.value)}
                       placeholder="Client name" required />
              </Field>
              <Field label="Company / Organisation">
                <input style={inp} value={form.company} onChange={e => set('company', e.target.value)}
                       placeholder="Company name" />
              </Field>
            </div>
            <Field label="Rating">
              <div className="flex items-center gap-3">
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={() => set('rating', n)}
                          className="text-2xl transition-transform hover:scale-110"
                          style={{ color: n <= form.rating ? '#fbbf24' : 'rgba(100,116,139,0.4)' }}>★</button>
                ))}
                <span className="text-sm text-slate-400 ml-1">{form.rating}/5</span>
              </div>
            </Field>
            <Field label="Testimonial Text" required>
              <textarea style={{ ...textareaStyle, minHeight: 120 }} value={form.text}
                        onChange={e => set('text', e.target.value)} placeholder="What the client said…" required />
            </Field>
          </>)}

          {/* EVENTS */}
          {type === 'Events' && (<>
            <Field label="Event Title" required>
              <input style={inp} value={form.title} onChange={e => set('title', e.target.value)}
                     placeholder="Event name" required />
            </Field>
            <Field label="Event Date" required>
              <input type="date" style={inp} value={form.date} onChange={e => set('date', e.target.value)} required />
            </Field>
            <Field label="Description">
              <textarea style={{ ...textareaStyle, minHeight: 120 }} value={form.description}
                        onChange={e => set('description', e.target.value)} placeholder="Describe the event…" />
            </Field>
            <Field label="Image URL">
              <input style={inp} value={form.image_url} onChange={e => set('image_url', e.target.value)}
                     placeholder="https://example.com/image.jpg" type="url" />
            </Field>
          </>)}

          {/* Error */}
          {err && (
            <div className="flex items-center gap-2 text-red-400 text-sm px-3 py-2.5 rounded-lg"
                 style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2" style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 20 }}>
            <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', boxShadow: '0 4px 16px -4px rgba(99,102,241,0.5)', opacity: saving ? 0.7 : 1 }}>
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : (isEdit ? 'Save Changes' : `Create ${singular}`)}
            </button>
            <button type="button" onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-colors"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
