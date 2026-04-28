import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'

export default function Events(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/events/')
      .then(r=>r.json())
      .then(d=>setItems(d?.results || []))
      .finally(()=>setLoading(false))
  },[])

  return (
    <div className="section-end page-shell">
      <section className="py-12 hero-gradient text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-secondary mb-2">Events & Workshops</h1>
          <p className="text-slate-400 mt-2">Join our upcoming talks, webinars, and hands-on AI workshops.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_,i)=>(<div key={i} className="card p-6 h-36"/>))}
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {items.map(e=>{
              const d = new Date(e.date)
              return (
                <li key={e.id} className="card p-6 flex gap-5">
                  <div className="flex-shrink-0 text-center w-14">
                    <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{d.toLocaleString('en-US',{month:'short'})}</div>
                    <div className="text-3xl font-bold text-slate-200 leading-none mt-1">{d.getDate()}</div>
                    <div className="text-xs text-slate-600 mt-1">{d.getFullYear()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-200 font-semibold mb-2 leading-snug">{e.title}</h3>
                    {e.description && <p className="text-slate-500 text-sm line-clamp-2">{e.description}</p>}
                    <div className="mt-3">
                      <Link className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors" to={`/events/${e.id}`}>
                        Details <ArrowRight className="w-3.5 h-3.5"/>
                      </Link>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
