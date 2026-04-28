import { useEffect, useState } from 'react'
import { Quote } from 'lucide-react'

export default function Testimonials(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/testimonials/')
      .then(r=>r.json())
      .then(d=>setItems(d?.results || []))
      .finally(()=>setLoading(false))
  },[])

  return (
    <div className="section-end page-shell">
      <section className="py-12 text-center hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="heading-secondary mb-2">Client Testimonials</h1>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto">Genuine feedback from the partners we've had the privilege of working with.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_,i)=>(<div key={i} className="card p-6 h-44"/>))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {items.map((t)=>(
              <div key={t.id} className="card p-7 flex flex-col">
                <Quote className="w-7 h-7 text-indigo-600 mb-4 opacity-60"/>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">{t.text}</p>
                <div className="flex items-center justify-between mt-auto pt-4" style={{borderTop:'1px solid rgba(99,102,241,0.12)'}}>
                  <div>
                    <div className="text-slate-200 font-semibold text-sm">{t.author}</div>
                    {t.company && <div className="text-xs text-slate-500">{t.company}</div>}
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({length:5}).map((_,i)=>(
                      <span key={i} className={`text-sm ${i < t.rating ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
                    ))}
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
