import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CaseStudies(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/case-studies/')
      .then(r=>r.json())
      .then(d=>setItems(d?.results || []))
      .finally(()=>setLoading(false))
  },[])

  return (
    <div className="section-end page-shell">
      <section className="py-12 hero-gradient text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-secondary mb-2">Case Studies</h1>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">Real-world AI deployments and the outcomes they delivered.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_,i)=>(<div key={i} className="card h-56"/>))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {items.map(c=>(
              <div key={c.id} className="card flex flex-col overflow-hidden">
                {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-44 object-cover"/>}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-slate-200 mb-2">{c.name}</h3>
                  <p className="text-slate-500 text-sm flex-1 leading-relaxed">{c.summary}</p>
                  <div className="mt-4">
                    <Link to={`/case-studies/${c.id}`} className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                      Read case study <ArrowRight className="w-3.5 h-3.5"/>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
