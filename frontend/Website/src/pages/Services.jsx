import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Building2, Hospital, Hotel, ShoppingCart, Landmark, Factory, ChevronRight, Code, Cpu, Brain, Database, Cloud, Shield, Workflow, BarChart3, Cog, Server, Camera, Bot, Rocket, ImageIcon } from 'lucide-react'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/services/')
      .then(async r=>{ if(!r.ok) throw new Error('Failed'); return r.json() })
      .then(d=>setServices(d?.results || [])).catch(()=>setServices([])).finally(()=>setLoading(false))
  },[])

  const iconMap = {
    'ai':Brain,'ml':Brain,'machine_learning':Brain,'llm':Bot,'chat':Bot,'chatbot':Bot,'nlp':Bot,
    'prototype':Code,'prototyping':Code,'dev':Code,'development':Code,'integration':Cog,
    'automation':Workflow,'rpa':Workflow,'data':Database,'analytics':BarChart3,'analysis':BarChart3,
    'cloud':Cloud,'devops':Server,'infrastructure':Server,'security':Shield,'vision':Camera,'cv':Camera,
    'cpu':Cpu,'rocket':Rocket,'strategy':Brain,'consulting':Brain,'assistant':Bot,'virtual_assistant':Bot,
  }
  const emojiMap = {'🤖':Bot,'🚀':Rocket,'📈':BarChart3,'🧠':Brain,'🛠️':Cog,'⚙️':Cog,'☁️':Cloud,'🔒':Shield,'📦':Server,'🖼️':Camera,'💾':Database}

  const resolveIcon = (raw, title) => {
    if (raw && emojiMap[raw]) return emojiMap[raw]
    if (raw) { const k=raw.toLowerCase().replace(/\s+/g,'_'); if(iconMap[k]) return iconMap[k] }
    if (!title) return null
    const t=title.toLowerCase()
    if (t.includes('automation')||t.includes('process')) return Workflow
    if (t.includes('data')||t.includes('analytics')) return Database
    if (t.includes('assistant')) return Bot
    if (t.includes('prototype')) return Code
    if (t.includes('vision')||t.includes('image')) return Camera
    return null
  }

  const steps = [
    { step:'01', title:'Discovery & Analysis',        desc:'Deep dive into your business goals, challenges, and technical landscape.' },
    { step:'02', title:'Strategy & Roadmap',           desc:'A tailored AI strategy with clear milestones, priorities, and ROI targets.' },
    { step:'03', title:'Prototype & Validate',         desc:'Rapid working prototypes to test ideas before committing to full build.' },
    { step:'04', title:'Build & Integrate',            desc:'Production-ready development with seamless integration into your stack.' },
    { step:'05', title:'Test & Optimise',              desc:'Rigorous QA, performance tuning, and edge-case hardening.' },
    { step:'06', title:'Deploy & Support',             desc:'Smooth launch with ongoing monitoring, updates, and dedicated support.' },
  ]

  const industries = [
    { name:'Banking',       icon:Building2, items:['Fraud Detection','Risk Assessment','Credit Scoring'] },
    { name:'Healthcare',    icon:Hospital,  items:['Medical Imaging','Patient Monitoring','Clinical AI'] },
    { name:'Tourism',       icon:Hotel,     items:['Recommendation Engine','Demand Forecasting','Chatbots'] },
    { name:'Retail',        icon:ShoppingCart, items:['Inventory AI','Customer Analytics','Price Engine'] },
    { name:'Government',    icon:Landmark,  items:['Citizen Services','Document Processing','Policy AI'] },
    { name:'Manufacturing', icon:Factory,   items:['Quality Control','Predictive Maintenance','Supply Chain'] },
  ]

  return (
    <div className="min-h-screen page-shell">
      {/* Hero */}
      <section className="hero-gradient py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading-primary mb-5">Our AI Services</h1>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            End-to-end AI capabilities — from rapid prototyping to enterprise deployments — designed to deliver measurable business value.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Get Started Today</Link>
            <Link to="/case-studies" className="btn-outline">View Our Work</Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-3">Comprehensive AI Solutions</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Purpose-built services to tackle your most complex challenges with intelligent automation.</p>
          </div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 animate-pulse">
              {[...Array(6)].map((_,i)=>(<div key={i} className="card h-72"/>))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 reveal-stagger">
              {services.map((service, i) => {
                const Icon = resolveIcon(service.icon || service.icon_name, service.title)
                return (
                  <div key={i} className="card p-8">
                    <div className="icon-badge w-12 h-12 flex items-center justify-center mb-5">
                      {Icon ? <Icon className="w-6 h-6 text-indigo-400"/> : <span className="text-indigo-400 font-bold text-xs">AI</span>}
                    </div>
                    <h3 className="heading-tertiary mb-3">{service.title}</h3>
                    <p className="text-slate-400 text-sm mb-5 leading-relaxed">{service.description}</p>
                    {(service.features||[]).length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {service.features.map((f,j)=>(
                          <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                            <ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0"/>{f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="pt-4 flex justify-between items-center text-xs" style={{borderTop:'1px solid rgba(99,102,241,0.12)'}}>
                      <div><div className="text-slate-600 mb-0.5">Timeline</div><div className="font-semibold text-slate-300">{service.timeline}</div></div>
                      <div className="text-right"><div className="text-slate-600 mb-0.5">Starting from</div><div className="font-semibold text-amber-400">{service.starting_price}</div></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-3">Our Delivery Process</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A proven six-step methodology that takes you from idea to production with confidence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-stagger">
            {steps.map((s,i)=>(
              <div key={i} className="card p-7 flex gap-5">
                <div className="step-number flex-shrink-0">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-3">Industry Expertise</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Tailored AI solutions for each sector's unique opportunities and challenges.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 reveal-stagger">
            {industries.map(({name,icon:Icon,items},i)=>(
              <div key={i} className="card p-5 text-center">
                <div className="icon-badge w-11 h-11 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-indigo-400"/>
                </div>
                <h3 className="text-slate-200 font-semibold text-sm mb-3">{name}</h3>
                <ul className="space-y-1">
                  {items.map((item,j)=>(<li key={j} className="text-xs text-slate-600">{item}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.2),transparent 70%)'}}/>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 relative">Ready to Get Started?</h2>
            <p className="text-slate-400 mb-7 relative">Let's discuss how AI can solve your business challenges and unlock new growth.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link to="/contact" className="btn-primary">Book a Free Consultation</Link>
              <Link to="/testimonials" className="btn-outline">Client Success Stories</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
