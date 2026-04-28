import { useEffect, useState } from 'react'
import { LayoutDashboard, FileText, Briefcase, Star, CalendarDays, LogOut, X, Eye, CheckCircle, Clock, Trash2, PenLine, Plus, AlertTriangle } from 'lucide-react'

const BASE = 'http://127.0.0.1:8000/api'

export default function AdminDashboard(){
  const [token, setToken]         = useState('')
  const [creds, setCreds]         = useState({username:'', password:''})
  const [error, setError]         = useState('')
  const [stats, setStats]         = useState(null)
  const [activeTab, setActiveTab] = useState('Inquiries')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const [items,        setItems]        = useState([])
  const [blogs,        setBlogs]        = useState([])
  const [cases,        setCases]        = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [events,       setEvents]       = useState([])

  const [blogForm,  setBlogForm]  = useState({id:null,title:'',excerpt:'',content:'',cover_image_url:''})
  const [caseForm,  setCaseForm]  = useState({id:null,name:'',summary:'',details:'',image_url:''})
  const [testForm,  setTestForm]  = useState({id:null,author:'',company:'',rating:5,text:''})
  const [eventForm, setEventForm] = useState({id:null,title:'',date:'',description:'',image_url:''})

  const [selectedInquiry,   setSelectedInquiry]   = useState(null)
  const [showInquiryModal,  setShowInquiryModal]  = useState(false)
  const [filterUnreviewed,  setFilterUnreviewed]  = useState(false)

  // Auto-login from stored token
  useEffect(()=>{
    const t = localStorage.getItem('nn_token')
    if(t){
      fetch(`${BASE}/inquiries/`,{headers:{Authorization:`Bearer ${t}`}})
        .then(r=>{ if(r.ok) setToken(t); else localStorage.removeItem('nn_token') })
        .catch(()=>localStorage.removeItem('nn_token'))
    }
  },[])

  useEffect(()=>{
    fetch(`${BASE}/analytics/`).then(r=>r.json()).then(setStats).catch(()=>{})
    if(token){
      fetch(`${BASE}/inquiries/?limit=1000`,{headers:{Authorization:`Bearer ${token}`}})
        .then(r=>r.ok ? r.json() : Promise.reject())
        .then(d=>setItems(d?.results || []))
        .catch(()=>{})
      Promise.all([
        fetch(`${BASE}/blogs/`),
        fetch(`${BASE}/case-studies/`),
        fetch(`${BASE}/testimonials/`),
        fetch(`${BASE}/events/`)
      ]).then(async ([rb,rc,rt,re])=>{
        const [db,dc,dt,de] = await Promise.all([rb.json(),rc.json(),rt.json(),re.json()])
        setBlogs(db?.results || []); setCases(dc?.results || []); setTestimonials(dt?.results || []); setEvents(de?.results || [])
      }).catch(()=>{})
    }
  },[token])

  const onLogin = async (e)=>{
    e.preventDefault(); setError('')
    try{
      const r = await fetch(`${BASE}/auth/login/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(creds)})
      if(!r.ok) throw new Error()
      const d = await r.json()
      localStorage.setItem('nn_token',d.access || d.token); setToken(d.access || d.token)
      // Dispatch custom event to notify App component of auth change
      window.dispatchEvent(new CustomEvent('authChange'));
    }catch{ setError('Invalid username or password') }
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => { 
    localStorage.removeItem('nn_token'); 
    setToken(''); 
    setItems([]); 
    setStats(null);
    setShowLogoutConfirm(false);
    // Dispatch custom event to notify App component of auth change
    window.dispatchEvent(new CustomEvent('authChange'));
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const authH = {'Content-Type':'application/json',Authorization:`Bearer ${token}`}
  const refreshStats = ()=> fetch(`${BASE}/analytics/`).then(r=>r.json()).then(setStats).catch(()=>{})
  const resetForms = ()=>{
    setBlogForm({id:null,title:'',excerpt:'',content:'',cover_image_url:''})
    setCaseForm({id:null,name:'',summary:'',details:'',image_url:''})
    setTestForm({id:null,author:'',company:'',rating:5,text:''})
    setEventForm({id:null,title:'',date:'',description:'',image_url:''})
  }

  const toggleReview = async(id)=>{
    const r=await fetch(`${BASE}/inquiries/${id}/toggle-review/`,{method:'PATCH',headers:authH})
    if(r.ok){
      const d=await r.json()
      const nextReviewed = Boolean(d?.is_reviewed)
      setItems(p=>p.map(x=>x.id===id?{...x,reviewed:nextReviewed}:x))
      if(selectedInquiry?.id===id) setSelectedInquiry(prev=>({...prev,reviewed:nextReviewed}))
      refreshStats()
    }
  }
  const deleteInquiry = async(id)=>{
    if(!confirm('Delete this inquiry?')) return
    const r=await fetch(`${BASE}/inquiries/${id}/`,{method:'DELETE',headers:authH})
    if(r.ok){ setItems(p=>p.filter(x=>x.id!==id)); setShowInquiryModal(false); refreshStats() }
  }

  const tabs = [
    {label:'Inquiries',    icon:LayoutDashboard},
    {label:'Blogs',        icon:FileText},
    {label:'Case Studies', icon:Briefcase},
    {label:'Testimonials', icon:Star},
    {label:'Events',       icon:CalendarDays},
  ]

  const statCards = stats ? [
    {label:'Total Inquiries',  value:stats.inquiries,            color:'text-indigo-400'},
    {label:'Pending Review',   value:stats.unreviewed_inquiries, color:'text-amber-400'},
    {label:'Blog Posts',       value:stats.blogs,                color:'text-violet-400'},
    {label:'Case Studies',     value:stats.case_studies,         color:'text-emerald-400'},
    {label:'Testimonials',     value:stats.testimonials,         color:'text-sky-400'},
  ] : []

  const displayedItems = filterUnreviewed ? items.filter(x=>!x.reviewed) : items

  // Shared table styles
  const Th = ({children,className=''})=> <th className={`text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>{children}</th>
  const Td = ({children,className=''})=> <td className={`py-3 px-4 text-sm text-slate-300 ${className}`}>{children}</td>

  if(!token){
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="icon-badge w-14 h-14 mx-auto flex items-center justify-center mb-4">
              <LayoutDashboard className="w-7 h-7 text-indigo-400"/>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">Admin Login</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to manage your content</p>
          </div>
          <form onSubmit={onLogin} className="card p-7 space-y-4">
            <div>
              <label className="form-label">Username</label>
              <input className="form-input" placeholder="admin" value={creds.username}
                onChange={e=>setCreds({...creds,username:e.target.value})} autoFocus/>
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={creds.password}
                onChange={e=>setCreds({...creds,password:e.target.value})}/>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center">Sign In →</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage all Sugam-AI Solutions content from here</p>
        </div>
        <button onClick={handleLogoutClick} className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors">
          <LogOut className="w-4 h-4"/> Sign Out
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map(({label,value,color},i)=>(
            <div key={i} className="card p-5 text-center">
              <div className={`text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-slate-600 mt-1 font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({label,icon:Icon})=>(
          <button key={label} onClick={()=>{setActiveTab(label);setError('');resetForms()}}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab===label
                ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            style={activeTab===label
              ? {background:'rgba(99,102,241,0.2)',border:'1px solid rgba(99,102,241,0.4)'}
              : {background:'rgba(30,41,59,0.4)',border:'1px solid rgba(99,102,241,0.1)'}}>
            <Icon className="w-4 h-4"/>{label}
          </button>
        ))}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* ── INQUIRIES ── */}
      {activeTab==='Inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
              <input type="checkbox" className="rounded" checked={filterUnreviewed}
                onChange={e=>setFilterUnreviewed(e.target.checked)}/>
              Show unreviewed only
            </label>
            <span className="text-xs text-slate-600">({displayedItems.length} shown)</span>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead style={{borderBottom:'1px solid rgba(99,102,241,0.12)'}}>
                <tr>
                  <Th>Name</Th><Th>Email</Th><Th>Company</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map(x=>(
                  <tr key={x.id} style={{borderBottom:'1px solid rgba(99,102,241,0.07)'}}>
                    <Td className="font-medium text-slate-200">{x.name}</Td>
                    <Td>{x.email}</Td>
                    <Td>{x.company||'—'}</Td>
                    <Td>
                      {x.reviewed
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{background:'rgba(16,185,129,0.12)',color:'#34d399',border:'1px solid rgba(16,185,129,0.2)'}}><CheckCircle className="w-3 h-3"/>Reviewed</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{background:'rgba(245,158,11,0.12)',color:'#fbbf24',border:'1px solid rgba(245,158,11,0.2)'}}><Clock className="w-3 h-3"/>Pending</span>
                      }
                    </Td>
                    <Td className="text-slate-500 text-xs">{new Date(x.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <div className="flex gap-2">
                        <button className="btn-accent" style={{padding:'4px 10px',fontSize:'12px'}} onClick={()=>{setSelectedInquiry(x);setShowInquiryModal(true)}}>
                          <Eye className="w-3.5 h-3.5 inline mr-1"/>View
                        </button>
                        <button onClick={()=>toggleReview(x.id)}
                          className={x.reviewed?'btn-warning':'btn-success'} style={{padding:'4px 10px',fontSize:'12px'}}>
                          {x.reviewed?'Unreview':'Review'}
                        </button>
                        <button className="btn-danger" style={{padding:'4px 10px',fontSize:'12px'}} onClick={()=>deleteInquiry(x.id)}>
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {displayedItems.length===0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-600 text-sm">No inquiries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BLOGS ── */}
      {activeTab==='Blogs' && (
        <div className="card overflow-x-auto">
            <table className="w-full">
              <thead style={{borderBottom:'1px solid rgba(99,102,241,0.12)'}}>
                <tr><Th>Title</Th><Th>Date</Th></tr>
              </thead>
              <tbody>
                {blogs.map(b=>(
                  <tr key={b.id} style={{borderBottom:'1px solid rgba(99,102,241,0.07)'}}>
                    <Td className="max-w-xs font-medium text-slate-200" title={b.title}>{b.title.length>45?b.title.slice(0,45)+'…':b.title}</Td>
                    <Td className="text-slate-500 text-xs">{new Date(b.created_at).toLocaleDateString()}</Td>
                  </tr>
                ))}
                {blogs.length===0 && (
                  <tr><td colSpan={2} className="py-10 text-center text-slate-600 text-sm">No blog posts found</td></tr>
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* ── CASE STUDIES ── */}
      {activeTab==='Case Studies' && (
        <div className="card overflow-x-auto">
            <table className="w-full">
              <thead style={{borderBottom:'1px solid rgba(99,102,241,0.12)'}}>
                <tr><Th>Name</Th><Th>Date</Th></tr>
              </thead>
              <tbody>
                {cases.map(c=>(
                  <tr key={c.id} style={{borderBottom:'1px solid rgba(99,102,241,0.07)'}}>
                    <Td className="font-medium text-slate-200">{c.name}</Td>
                    <Td className="text-slate-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</Td>
                  </tr>
                ))}
                {cases.length===0 && (
                  <tr><td colSpan={2} className="py-10 text-center text-slate-600 text-sm">No case studies found</td></tr>
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      {activeTab==='Testimonials' && (
        <div className="card overflow-x-auto">
            <table className="w-full">
              <thead style={{borderBottom:'1px solid rgba(99,102,241,0.12)'}}>
                <tr><Th>Author</Th><Th>Rating</Th></tr>
              </thead>
              <tbody>
                {testimonials.map(t=>(
                  <tr key={t.id} style={{borderBottom:'1px solid rgba(99,102,241,0.07)'}}>
                    <Td className="font-medium text-slate-200">{t.author}</Td>
                    <Td><span className="text-amber-400">{'★'.repeat(t.rating)}</span></Td>
                  </tr>
                ))}
                {testimonials.length===0 && (
                  <tr><td colSpan={2} className="py-10 text-center text-slate-600 text-sm">No testimonials found</td></tr>
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* ── EVENTS ── */}
      {activeTab==='Events' && (
        <div className="card overflow-x-auto">
            <table className="w-full">
              <thead style={{borderBottom:'1px solid rgba(99,102,241,0.12)'}}>
                <tr><Th>Title</Th><Th>Date</Th></tr>
              </thead>
              <tbody>
                {events.map(ev=>(
                  <tr key={ev.id} style={{borderBottom:'1px solid rgba(99,102,241,0.07)'}}>
                    <Td className="font-medium text-slate-200">{ev.title}</Td>
                    <Td className="text-slate-500 text-xs">{new Date(ev.date).toLocaleDateString()}</Td>
                  </tr>
                ))}
                {events.length===0 && (
                  <tr><td colSpan={2} className="py-10 text-center text-slate-600 text-sm">No events found</td></tr>
                )}
              </tbody>
            </table>
        </div>
      )}

      {/* ── INQUIRY MODAL ── */}
      {showInquiryModal && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(6,7,26,0.85)',backdropFilter:'blur(8px)'}}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{background:'rgba(13,17,48,0.98)',border:'1px solid rgba(99,102,241,0.3)',boxShadow:'0 32px 80px -16px rgba(79,70,229,0.4)'}}>
            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-100">Inquiry Details</h3>
                <button onClick={()=>setShowInquiryModal(false)} className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-5">
                {[
                  ['Name',      selectedInquiry.name],
                  ['Email',     selectedInquiry.email],
                  ['Phone',     selectedInquiry.phone||'—'],
                  ['Company',   selectedInquiry.company||'—'],
                  ['Country',   selectedInquiry.country||'—'],
                  ['Job Title', selectedInquiry.job_title||'—'],
                ].map(([label,val])=>(
                  <div key={label}>
                    <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-slate-200 text-sm">{val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Project Details</div>
                <div className="p-4 rounded-xl text-slate-300 text-sm leading-relaxed whitespace-pre-wrap"
                     style={{background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.12)'}}>
                  {selectedInquiry.job_details}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-6">
                <span>Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
                {selectedInquiry.reviewed
                  ? <span className="flex items-center gap-1 text-emerald-400"><CheckCircle className="w-3.5 h-3.5"/>Reviewed</span>
                  : <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3.5 h-3.5"/>Pending Review</span>
                }
              </div>

              <div className="flex gap-3 pt-5" style={{borderTop:'1px solid rgba(99,102,241,0.12)'}}>
                <button className={selectedInquiry.reviewed?'btn-warning':'btn-success'}
                  onClick={()=>{ toggleReview(selectedInquiry.id); setShowInquiryModal(false) }}>
                  {selectedInquiry.reviewed?'Mark Unreviewed':'Mark Reviewed'}
                </button>
                <button className="btn-danger" onClick={()=>deleteInquiry(selectedInquiry.id)}>Delete</button>
                <button className="btn-secondary ml-auto" onClick={()=>setShowInquiryModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-600 bg-opacity-20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirm Sign Out</h3>
                <p className="text-slate-400 text-sm">Are you sure you want to sign out of the admin dashboard?</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={cancelLogout}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
