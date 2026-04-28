import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function BlogPost(){
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(()=>{
    fetch(`http://127.0.0.1:8000/api/blogs/${id}/`)
      .then(r=>r.json()).then(setPost).catch(()=>{})
  },[id])

  if(!post) return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-500">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 section-end page-shell">
      <Link to="/blog" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4"/> Back to Articles
      </Link>
      {post.cover_image_url && <img src={post.cover_image_url} alt="cover" className="w-full rounded-2xl mb-8 max-h-72 object-cover"/>}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Calendar className="w-3.5 h-3.5"/>
        {new Date(post.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
      </div>
      <h1 className="heading-secondary mb-4">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-slate-400 mb-8 leading-relaxed">{post.excerpt}</p>}
      <div className="text-slate-400 leading-relaxed whitespace-pre-wrap">{post.content}</div>
    </div>
  )
}
