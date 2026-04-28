import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'

const API = 'http://127.0.0.1:8000/api/inquiries/'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', country:'', job_title:'', job_details:'' })
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const onChange = e => {
    const { name, value } = e.target
    setForm({...form, [name]: value})
    if (errors[name]) setErrors({...errors, [name]: ''})
  }

  const validateForm = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email'
    if (!form.job_details.trim()) errs.job_details = 'Please describe your project'
    else if (form.job_details.trim().length < 20) errs.job_details = 'Please provide at least 20 characters of detail'
    if (form.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(form.phone)) errs.phone = 'Please enter a valid phone number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true); setStatus(null)
    try {
      const res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Failed') }
      setStatus('success')
      setForm({ name:'', email:'', phone:'', company:'', country:'', job_title:'', job_details:'' })
    } catch(err) { setStatus('error') }
    finally { setIsSubmitting(false) }
  }

  const formFields = [
    { key:'name',      label:'Full Name',      type:'text',  required:true },
    { key:'email',     label:'Email Address',  type:'email', required:true },
    { key:'phone',     label:'Phone Number',   type:'tel',   required:false },
    { key:'company',   label:'Company Name',   type:'text',  required:false },
    { key:'country',   label:'Country',        type:'text',  required:false },
    { key:'job_title', label:'Job Title',      type:'text',  required:false },
  ]

  const contactInfo = [
    { icon: MapPin,  title: 'Office', text: 'Hattisar, Kathmandu 44600, Nepal' },
    { icon: Phone,   title: 'Phone',  text: '+977-1-5551234' },
    { icon: Mail,    title: 'Email',  text: 'hello@sugamaisolutions.com.np' },
    { icon: Clock,   title: 'Hours',  text: 'Sun–Thu: 9 AM–6 PM · Fri: 9 AM–1 PM' },
  ]

  return (
    <div className="max-w-5xl mx-auto section-end page-shell px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="py-12 text-center">
        <h1 className="heading-secondary mb-3">Let's Build Something Together</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Tell us about your project and we'll get back to you within 24 hours with a personalised plan.</p>
      </section>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Form */}
        <div className="md:col-span-3 card p-8">
          <h2 className="text-lg font-semibold text-slate-200 mb-6">Send a Message</h2>

          {status === 'success' && (
            <div className="alert-success mb-6 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"/>
              <span>Your inquiry has been received! We'll respond within 24 hours.</span>
            </div>
          )}
          {status === 'error' && (
            <div className="alert-error mb-6">Submission failed. Please try again or email us directly.</div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {formFields.map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="form-label">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
                  <input
                    name={key} value={form[key]} onChange={onChange} type={type}
                    placeholder={type === 'email' ? 'you@company.com' : `Enter ${label.toLowerCase()}`}
                    className={`form-input${errors[key] ? ' border-red-500' : ''}`}
                  />
                  {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}
            </div>
            <div>
              <label className="form-label">Project Details <span className="text-red-400">*</span></label>
              <textarea
                name="job_details" value={form.job_details} onChange={onChange}
                className={`form-textarea h-32${errors.job_details ? ' border-red-500' : ''}`}
                placeholder="Describe your project goals, timeline, and any specific challenges..."
              />
              {errors.job_details && <p className="text-red-400 text-xs mt-1">{errors.job_details}</p>}
              <p className="text-slate-600 text-xs mt-1">{form.job_details.length}/500</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
              {isSubmitting ? <><span className="loading-spinner mr-2"/>Sending...</> : 'Send Message →'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-2 space-y-5 reveal-stagger">
          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-200 mb-5">Contact Information</h3>
            <div className="space-y-5">
              {contactInfo.map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="icon-badge w-9 h-9 flex-shrink-0 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-indigo-400"/>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{title}</div>
                    <div className="text-sm text-slate-300">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-base font-semibold text-slate-200 mb-4">Why Work with Us?</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {[
                '24-hour response guarantee',
                'Free initial consultation',
                'Local expertise, global standards',
                'Transparent pricing and timelines',
                'Post-launch support included'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
