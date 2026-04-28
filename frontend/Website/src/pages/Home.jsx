import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Rocket, Bot, LineChart, Building2, Hotel, Hospital, ShoppingCart, Landmark, Factory, MapPin, Phone, Mail, Globe2, ChevronRight, Sparkles, Zap, Shield } from 'lucide-react'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    Boolean(localStorage.getItem('nn_token'))
  )

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics/')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const syncAdminAuthState = () => {
      setIsAdminAuthenticated(Boolean(localStorage.getItem('nn_token')))
    }

    window.addEventListener('storage', syncAdminAuthState)
    window.addEventListener('focus', syncAdminAuthState)
    syncAdminAuthState()

    return () => {
      window.removeEventListener('storage', syncAdminAuthState)
      window.removeEventListener('focus', syncAdminAuthState)
    }
  }, [])

  const features = [
    {
      icon: Rocket,
      title: "Rapid AI Prototyping",
      description: "Validate AI concepts in days with real-world data and business-ready prototypes.",
      benefits: ["Faster time-to-market", "Reduced risk", "Early stakeholder buy-in"]
    },
    {
      icon: Bot,
      title: "Intelligent Virtual Assistant",
      description: "Context-aware AI assistants that understand your business and serve users 24/7.",
      benefits: ["Always-on availability", "Multilingual support", "Seamless integrations"]
    },
    {
      icon: LineChart,
      title: "Enterprise-Scale AI",
      description: "From startup MVP to enterprise-grade systems — scalable, secure, and future-proof.",
      benefits: ["Cloud-native architecture", "Auto-scaling", "SOC 2 ready security"]
    }
  ]

  const industries = [
    { name: "Banking & Finance", icon: Building2, description: "Fraud detection, risk assessment, automated underwriting" },
    { name: "Tourism & Hospitality", icon: Hotel, description: "Personalized itineraries, demand forecasting, booking AI" },
    { name: "Healthcare", icon: Hospital, description: "Medical imaging, patient monitoring, clinical decision support" },
    { name: "Retail & E-commerce", icon: ShoppingCart, description: "Inventory optimization, recommendation engines, analytics" },
    { name: "Government", icon: Landmark, description: "Citizen services, document processing, policy analysis" },
    { name: "Manufacturing", icon: Factory, description: "Quality control, predictive maintenance, supply chain AI" }
  ]

  const whyUs = [
    { icon: Globe2, label: "Local Expertise, Global Standards", desc: "Deep understanding of Nepal's business landscape with international-quality delivery." },
    { icon: Sparkles, label: "Proven Track Record", desc: "Successful deployments across banking, tourism, retail, healthcare, and government." },
    { icon: Zap, label: "Rapid & Transparent", desc: "Fast prototyping, clear communication, and measurable business outcomes every time." },
    { icon: Shield, label: "Enterprise Security", desc: "Production-hardened systems with token auth, rate limiting, and audit trails." }
  ]

  return (
    <div className="min-h-screen page-shell">
      {/* Hero */}
      <section className="hero-gradient py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 50% 0%,rgba(99,102,241,0.12) 0%,transparent 70%)'}}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 animate-fade-in-up"
               style={{background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.3)',color:'#a5b4fc'}}>
            <Sparkles className="w-3.5 h-3.5"/>
            AI-Powered Solutions for Nepal's Future
          </div>
          <h1 className="heading-primary mb-6 animate-fade-in-up">
            Sugam-AI Solutions
            <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-slate-400 font-medium">Kathmandu</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto animate-fade-in-up leading-relaxed">
            We build practical, powerful AI products for Nepali businesses — from rapid prototypes to enterprise-scale systems that deliver real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link to="/contact" className="btn-primary">Start Your AI Journey →</Link>
            <Link to="/case-studies" className="btn-outline">Explore Our Work</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-10 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: stats.case_studies, label: 'Case Studies' },
                { value: '100+', label: 'Happy Clients' },
                { value: stats.blogs, label: 'Articles Published' },
                { value: '5+', label: 'Years Experience' }
              ].map((s, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="text-3xl font-bold mb-1" style={{background:'linear-gradient(135deg,#a5b4fc,#818cf8)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{s.value}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-3">Why Choose Sugam-AI Solutions?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We combine deep local knowledge with global AI standards to deliver solutions that actually work.</p>
          </div>
          <div className="grid-responsive reveal-stagger">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card p-8 animate-fade-in-up">
                  <div className="mb-5 icon-badge w-12 h-12">
                    <Icon className="w-6 h-6 text-indigo-400 m-auto" />
                  </div>
                  <h3 className="heading-tertiary mb-3">{feature.title}</h3>
                  <p className="text-slate-400 mb-5 text-sm leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-slate-400">
                        <ChevronRight className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-3">Industries We Serve</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From traditional sectors to emerging markets — we understand the unique AI opportunities in every vertical.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-stagger">
            {industries.map((industry, index) => {
              const Icon = industry.icon
              return (
                <div key={index} className="card p-6 flex items-start gap-4">
                  <div className="icon-badge w-10 h-10 flex-shrink-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 mb-1">{industry.name}</h3>
                    <p className="text-slate-500 text-sm">{industry.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-10 text-center relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse at 50% -20%,rgba(99,102,241,0.2),transparent 70%)'}}/>
            <h2 className="text-3xl font-bold text-slate-100 mb-4 relative">Ready to Transform with AI?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto relative">Join the growing network of Nepali businesses leveraging AI for real competitive advantage.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
              <Link to={isAdminAuthenticated ? "/admin" : "/contact"} className="btn-primary">
                {isAdminAuthenticated ? 'Go to Admin Dashboard' : 'Get Started Today'}
              </Link>
              <Link to="/services" className="btn-outline">Explore Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us + Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="heading-secondary mb-8">What Sets Us Apart</h2>
              <div className="space-y-6">
                {whyUs.map((item, i) => {
                  const Icon = item.icon
                  return (
                <div key={i} className="flex items-start gap-4 animate-fade-in-up">
                      <div className="icon-badge w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200 mb-1">{item.label}</h3>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="card-elevated p-8">
              <h3 className="heading-tertiary mb-6">Get in Touch</h3>
              <div className="space-y-4 text-slate-400 text-sm">
                {[
                  { icon: MapPin,  text: 'Hattisar, Kathmandu 44600, Nepal' },
                  { icon: Phone,   text: '+977-1-5551234' },
                  { icon: Mail,    text: 'hello@sugamaisolutions.com.np' },
                  { icon: Globe2,  text: 'Serving Kathmandu Valley and beyond' }
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contact" className="btn-primary w-full text-center">Start a Conversation</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
