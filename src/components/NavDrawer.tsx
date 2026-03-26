import { useState, useEffect, useRef } from 'react'

export default function NavDrawer() {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // Focus close button when drawer opens
  useEffect(() => {
    if (open) closeButtonRef.current?.focus()
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  const links = [
    { label: 'Projects', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      {/* Hamburger button — visible on mobile only */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1.5 p-1 md:hidden"
      >
        <span className="block w-5 h-px bg-primary" />
        <span className="block w-5 h-px bg-primary" />
        <span className="block w-5 h-px bg-primary" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed top-0 right-0 h-full w-64 bg-surface z-50 flex flex-col p-6 shadow-xl md:hidden"
        >
          <button
            ref={closeButtonRef}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="self-end text-muted hover:text-primary transition-colors mb-8 text-xl leading-none"
          >
            ✕
          </button>
          <nav className="flex flex-col gap-6">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="text-primary font-medium text-base hover:opacity-60 transition-opacity"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
