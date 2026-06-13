import logoSrc from '../assets/bgremovelogo.png'

export default function Logo({ size, variant = 'header', className = '' }) {
  const style = size != null
    ? { height: typeof size === 'number' ? `${size}px` : size, width: 'auto' }
    : undefined

  return (
    <img
      src={logoSrc}
      alt="Sugam-AI Solutions — Kathmandu"
      className={[
        'site-logo object-contain object-left select-none',
        variant === 'header' ? 'site-logo-header' : 'site-logo-footer',
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      draggable={false}
    />
  )
}
