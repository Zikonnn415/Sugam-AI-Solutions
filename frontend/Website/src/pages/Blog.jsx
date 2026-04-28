import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight } from 'lucide-react'

export default function Blog(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/blogs/')
      .then(r=>r.json())
      .then(d=>setItems(d?.results || []))
      .finally(()=>setLoading(false))
  },[])

  return (
    <div className="section-end page-shell">
      <section className="py-12 hero-gradient text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-secondary mb-2">Insights & Articles</h1>
          <p className="text-slate-400 mt-2">Perspectives, guides, and updates from the Sugam-AI Solutions team.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_,i)=>(<div key={i} className="card p-6 h-48"/>))}
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {items.map(p=>(
              <li key={p.id} className="card flex flex-col overflow-hidden">
                {p.cover_image_url && (
                  <img src={p.cover_image_url} alt="cover" className="w-full h-44 object-cover"/>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Calendar className="w-3.5 h-3.5"/>
                    {new Date(p.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                  </div>
                  <h3 className="text-slate-200 font-semibold mb-2 leading-snug">{p.title}</h3>
                  {p.excerpt && <p className="text-slate-500 text-sm flex-1 leading-relaxed">{p.excerpt}</p>}
                  <div className="mt-4">
                    <Link className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors" to={`/blog/${p.id}`}>
                      Read more <ArrowRight className="w-3.5 h-3.5"/>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
