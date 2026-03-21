import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [isScaled, setIsScaled] = useState(false)
  const magneticRefs = useRef<{ el: Element; rect: DOMRect }[]>([])
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    // Desktop only
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('cursor-custom')

    let rafId: number
    let mouseX = 0
    let mouseY = 0

    // Cache magnetic element rects at mount + on resize
    function cacheMagneticRects() {
      magneticRefs.current = Array.from(
        document.querySelectorAll('[data-magnetic]')
      ).map(el => ({ el, rect: el.getBoundingClientRect() }))
    }
    cacheMagneticRects()
    window.addEventListener('resize', cacheMagneticRects)
    window.addEventListener('scroll', cacheMagneticRects, { passive: true })

    // Move cursor dot via rAF — only update DOM when mouse has moved
    let moved = false

    function moveCursor() {
      if (moved && dotRef.current) {
        dotRef.current.style.left = mouseX + 'px'
        dotRef.current.style.top  = mouseY + 'px'
        moved = false
      }
      rafId = requestAnimationFrame(moveCursor)
    }
    rafId = requestAnimationFrame(moveCursor)

    // Mouse position + magnetic pull
    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      moved = true

      magneticRefs.current.forEach(({ el, rect }) => {
        const cx = rect.left + rect.width / 2
        const cy = rect.top  + rect.height / 2
        const pad = 20
        const within =
          mouseX >= rect.left - pad && mouseX <= rect.right + pad &&
          mouseY >= rect.top  - pad && mouseY <= rect.bottom + pad
        const htmlEl = el as HTMLElement
        if (within) {
          // Override any CSS transition (e.g. from [data-reveal]) so the
          // magnetic pull is instant — not eased over 0.5s with stagger delay
          htmlEl.style.transition = 'transform 0.12s ease-out'
          htmlEl.style.transitionDelay = '0ms'
          const dx = Math.max(-12, Math.min(12, (mouseX - cx) * 0.28))
          const dy = Math.max(-12, Math.min(12, (mouseY - cy) * 0.28))
          htmlEl.style.transform = `translate(${dx}px, ${dy}px)`
        } else {
          htmlEl.style.transition = ''
          htmlEl.style.transitionDelay = ''
          htmlEl.style.transform = ''
        }
      })
    }

    // Hover: pill morph or dot scale via delegation
    function onMouseOver(e: MouseEvent) {
      const scaleTarget = (e.target as Element).closest('[data-cursor-scale]')
      if (scaleTarget) { setIsScaled(true); return }
      const target = (e.target as Element).closest('[data-cursor-label]')
      if (target) {
        setLabel((target as HTMLElement).dataset.cursorLabel ?? '')
        setIsHovered(true)
      }
    }

    function onMouseOut(e: MouseEvent) {
      const scaleTarget = (e.target as Element).closest('[data-cursor-scale]')
      if (scaleTarget && !scaleTarget.contains(e.relatedTarget as Node)) {
        setIsScaled(false)
        return
      }
      const target = (e.target as Element).closest('[data-cursor-label]')
      if (target && !target.contains(e.relatedTarget as Node)) {
        setIsHovered(false)
        setLabel('')
        const htmlEl = target as HTMLElement
        if (htmlEl.dataset.magnetic !== undefined) {
          htmlEl.style.transform = ''
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout',  onMouseOut)

    return () => {
      document.documentElement.classList.remove('cursor-custom')
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout',  onMouseOut)
      window.removeEventListener('resize', cacheMagneticRects)
      window.removeEventListener('scroll', cacheMagneticRects)
      document.querySelectorAll('[data-magnetic]').forEach(el => {
        const htmlEl = el as HTMLElement
        htmlEl.style.transition = ''
        htmlEl.style.transitionDelay = ''
        htmlEl.style.transform = ''
      })
    }
  }, [])

  const pillWidth = isScaled ? '16px' : isHovered ? (label ? '68px' : '40px') : '10px'
  const pillHeight = isScaled ? '16px' : isHovered ? '26px' : '10px'
  const pillRadius = isHovered && !isScaled ? '13px' : '50%'

  return (
    <div
      ref={dotRef}
      data-cursor-dot
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: pillWidth,
        height: pillHeight,
        borderRadius: pillRadius,
        background: '#1c1917',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 0 5px rgba(28,25,23,0.06), 0 0 0 12px rgba(28,25,23,0.03), 0 0 22px rgba(28,25,23,0.07)',
        transition: reducedMotion ? 'none' : 'width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.25s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        data-cursor-label-text
        style={{
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#fafaf9',
          opacity: isHovered && label ? 1 : 0,
          transition: 'opacity 0.15s ease',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {label}
      </span>
    </div>
  )
}
