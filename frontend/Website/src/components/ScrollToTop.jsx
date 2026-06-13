import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { prefersReducedMotion } from '../hooks/useInView.js'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}
