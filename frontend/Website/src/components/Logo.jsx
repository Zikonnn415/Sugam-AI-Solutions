import React from 'react'

// Custom SVG logo — geometric neural network node, indigo/violet palette
export default function Logo({ size = 32 }) {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <svg width={px} height={px} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#logo-bg)"/>
      {/* Neural-node paths */}
      <circle cx="20" cy="20" r="4.5" fill="#818cf8"/>
      <circle cx="8"  cy="12" r="3"   fill="#6366f1" opacity="0.85"/>
      <circle cx="32" cy="12" r="3"   fill="#6366f1" opacity="0.85"/>
      <circle cx="8"  cy="28" r="3"   fill="#a5b4fc" opacity="0.75"/>
      <circle cx="32" cy="28" r="3"   fill="#a5b4fc" opacity="0.75"/>
      <circle cx="20" cy="7"  r="2.5" fill="#fbbf24" opacity="0.9"/>
      <circle cx="20" cy="33" r="2.5" fill="#fbbf24" opacity="0.7"/>
      {/* Connection lines */}
      <line x1="20" y1="15.5" x2="20"  y2="9.5"  stroke="#fbbf24" strokeWidth="1.2" opacity="0.6"/>
      <line x1="16" y1="18"   x2="11"  y2="13.5" stroke="#818cf8" strokeWidth="1"   opacity="0.5"/>
      <line x1="24" y1="18"   x2="29"  y2="13.5" stroke="#818cf8" strokeWidth="1"   opacity="0.5"/>
      <line x1="16" y1="22"   x2="11"  y2="26.5" stroke="#a5b4fc" strokeWidth="1"   opacity="0.5"/>
      <line x1="24" y1="22"   x2="29"  y2="26.5" stroke="#a5b4fc" strokeWidth="1"   opacity="0.5"/>
      <line x1="20" y1="24.5" x2="20"  y2="30.5" stroke="#fbbf24" strokeWidth="1.2" opacity="0.5"/>
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%"   stopColor="#312e81"/>
          <stop offset="100%" stopColor="#1e1b4b"/>
        </linearGradient>
      </defs>
    </svg>
  )
}
