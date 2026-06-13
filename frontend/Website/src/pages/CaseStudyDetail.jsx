import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Reveal } from '../components/Reveal.jsx'

export default function CaseStudyDetail(){
  const { id } = useParams()
  const [item, setItem] = useState(null)

  useEffect(()=>{
    fetch(`http://127.0.0.1:8000/api/case-studies/${id}/`)
      .then(r=>r.json()).then(setItem).catch(()=>{})
  },[id])

  if(!item) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 section-end page-shell">
      <Reveal>
        <Link to="/case-studies" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-8 link-hover-lift">
          <ArrowLeft className="w-4 h-4"/> Back to Case Studies
        </Link>
      </Reveal>
      {item.image_url && (
        <Reveal variant="fade" delay={60}>
          <img src={item.image_url} alt={item.name} className="w-full rounded-2xl mb-8 max-h-72 object-cover"/>
        </Reveal>
      )}
      <Reveal delay={100}>
        <h1 className="heading-secondary mb-3">{item.name}</h1>
        <p className="text-slate-400 text-lg mb-6 leading-relaxed">{item.summary}</p>
      </Reveal>
      {item.details && (
        <Reveal delay={160}>
          <div className="prose prose-invert max-w-none text-slate-400 leading-relaxed whitespace-pre-wrap">{item.details}</div>
        </Reveal>
      )}
    </div>
  )
}
