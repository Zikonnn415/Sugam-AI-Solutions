import { useCallback, useEffect, useRef, useState } from 'react'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scheduleReveal(onReveal) {
  requestAnimationFrame(() => {
    requestAnimationFrame(onReveal)
  })
}

export function useInView({
  threshold = 0.05,
  rootMargin = '0px 0px -8% 0px',
  once = true,
} = {}) {
  const [node, setNode] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const revealedRef = useRef(false)

  const ref = useCallback((element) => {
    setNode(element)
  }, [])

  useEffect(() => {
    revealedRef.current = false
    setIsVisible(false)

    if (!node) return

    if (prefersReducedMotion()) {
      setIsVisible(true)
      revealedRef.current = true
      return
    }

    let cancelled = false

    const reveal = () => {
      if (cancelled || revealedRef.current) return
      revealedRef.current = true
      scheduleReveal(() => {
        if (!cancelled) setIsVisible(true)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal()
            if (once) observer.disconnect()
          } else if (!once) {
            revealedRef.current = false
            setIsVisible(false)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(node)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [node, threshold, rootMargin, once])

  return [ref, isVisible]
}
