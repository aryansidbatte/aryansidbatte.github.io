import { useEffect, useRef } from 'react'
import type { Project } from '../content/projects'

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // 1. ESC key handler — stable onClose via ref
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  useEffect(() => {
    if (!project) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [project])

  // 2. Focus close button on open
  useEffect(() => {
    if (project) closeButtonRef.current?.focus()
  }, [project])

  // 3. Body scroll lock — restore previous value
  useEffect(() => {
    if (!project) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [project])

  // 4. Focus trap — keep Tab inside the dialog
  useEffect(() => {
    if (!project) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = Array.from(
        document.querySelector('[role="dialog"]')?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [project])

  if (!project) return null

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="modal-backdrop"
        className="fixed inset-0 bg-black/40 backdrop-blur-[8px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={[
          'fixed z-50 bg-surface overflow-y-auto overscroll-contain',
          // Desktop: centered overlay
          'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
          'md:w-full md:max-w-lg md:max-h-[80vh] md:rounded-xl',
          // Mobile: bottom sheet
          'bottom-0 left-0 right-0 max-h-[90svh] rounded-t-xl',
          'md:bottom-auto',
        ].join(' ')}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="font-bold text-primary text-xl">
              {project.title}
            </h2>
            <button
              ref={closeButtonRef}
              aria-label="Close"
              onClick={onClose}
              className="text-muted hover:text-primary transition-colors ml-4 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Stack tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.stack.map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] text-muted bg-page px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Description + outcome */}
          <p className="text-secondary text-sm leading-relaxed mb-2">
            {project.description}
          </p>
          <p className="text-secondary text-sm leading-relaxed mb-6">
            {project.outcome}
          </p>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary border border-border rounded-md px-4 py-2 hover:opacity-60 transition-opacity"
            >
              GitHub ↗
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-secondary border border-border rounded-md px-4 py-2 hover:opacity-60 transition-opacity"
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
