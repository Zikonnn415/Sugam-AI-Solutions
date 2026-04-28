import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'

export default function EventDetail(){
  const { id } = useParams()
  const [ev, setEv] = useState(null)

  useEffect(()=>{
    fetch(`http://127.0.0.1:8000/api/events/${id}/`)
      .then(r=>r.json()).then(setEv).catch(()=>{})
  },[id])

  if(!ev) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 section-end page-shell">
      <Link to="/events" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4"/> Back to Events
      </Link>
      {ev.image_url && <img src={ev.image_url} alt={ev.title} className="w-full rounded-2xl mb-8 max-h-72 object-cover"/>}
      <div className="flex items-center gap-2 text-indigo-400 text-sm mb-3">
        <CalendarDays className="w-4 h-4"/>
        {new Date(ev.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
      </div>
      <h1 className="heading-secondary mb-5">{ev.title}</h1>
      {ev.description && <div className="text-slate-400 leading-relaxed whitespace-pre-wrap">{ev.description}</div>}
    </div>
  )
}
