import { useEffect, useRef } from 'react'

const SKILLS = [
  { label: 'Python',     slug: 'python' },
  { label: 'C#',         slug: 'sharp' },
  { label: 'JavaScript', slug: 'javascript' },
  { label: 'TypeScript', slug: 'typescript' },
  { label: 'Shell',      slug: 'gnubash' },
  { label: 'Unity',      slug: 'unity' },
  { label: 'SQLite',     slug: 'sqlite' },
  { label: 'Git',        slug: 'git' },
  { label: 'Astro',      slug: 'astro' },
  { label: 'Tailwind',   slug: 'tailwindcss' },
]

export default function SkillsInteractive() {
  const pillRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pills = pillRefs.current.filter(Boolean) as HTMLElement[]

    if (reducedMotion) {
      pills.forEach(pill => pill.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )

    pills.forEach(pill => observer.observe(pill))
    return () => observer.disconnect()
  }, [])

  return (
    <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
      {SKILLS.map((skill, i) => (
        <li
          key={skill.label}
          ref={el => { pillRefs.current[i] = el }}
          data-reveal
          data-magnetic
          data-cursor-scale
          aria-label={skill.label}
          className="bg-surface border border-border rounded-lg px-4 py-2.5 flex items-center gap-2 cursor-default"
          style={{ transitionDelay: `${Math.min(i * 80, 400)}ms` }}
        >
          <img
            src={`https://cdn.simpleicons.org/${skill.slug}/1c1917`}
            alt=""
            aria-hidden="true"
            width={14}
            height={14}
            loading="lazy"
          />
          <span className="text-xs text-primary font-medium">{skill.label}</span>
        </li>
      ))}
    </ul>
  )
}
