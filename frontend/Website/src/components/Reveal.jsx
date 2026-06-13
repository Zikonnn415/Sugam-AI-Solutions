import { useInView } from '../hooks/useInView.js'

export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  duration,
  once = true,
  threshold,
  rootMargin,
}) {
  const [ref, visible] = useInView({ once, threshold, rootMargin })

  const style = {
    '--reveal-delay': `${delay}ms`,
    ...(duration != null ? { '--reveal-duration': `${duration}ms` } : {}),
  }

  return (
    <Tag
      ref={ref}
      className={[
        'reveal',
        `reveal-${variant}`,
        visible && 'reveal-visible',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </Tag>
  )
}

export function RevealStagger({
  children,
  className = '',
  as: Tag = 'div',
  step = 75,
  once = true,
  threshold,
  rootMargin,
}) {
  const [ref, visible] = useInView({ once, threshold, rootMargin })

  return (
    <Tag
      ref={ref}
      className={[
        'reveal-stagger-scroll',
        visible && 'reveal-stagger-visible',
        className,
      ].filter(Boolean).join(' ')}
      style={{ '--stagger-step': `${step}ms` }}
    >
      {children}
    </Tag>
  )
}
