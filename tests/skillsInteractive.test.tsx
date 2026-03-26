import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillsInteractive from '../src/components/SkillsInteractive'

// jsdom doesn't implement IntersectionObserver — mock it
beforeEach(() => {
  const mockObserver = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }
  vi.stubGlobal('IntersectionObserver', vi.fn(function(this: any) {
    Object.assign(this, mockObserver)
  } as any))
  // stub matchMedia (used for prefers-reduced-motion check)
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('SkillsInteractive', () => {
  it('renders all 10 skill pills', () => {
    render(<SkillsInteractive />)
    const pills = screen.getAllByRole('listitem')
    expect(pills).toHaveLength(10)
  })

  it('renders correct label text for each skill', () => {
    render(<SkillsInteractive />)
    const labels = ['Python', 'C#', 'JavaScript', 'TypeScript', 'Shell',
                    'Unity', 'SQLite', 'Git', 'Astro', 'Tailwind']
    labels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  it('each pill has an img with correct Simple Icons CDN src', () => {
    render(<SkillsInteractive />)
    const slugMap: Record<string, string> = {
      Python: 'python', 'C#': 'sharp', JavaScript: 'javascript',
      TypeScript: 'typescript', Shell: 'gnubash', Unity: 'unity',
      SQLite: 'sqlite', Git: 'git', Astro: 'astro', Tailwind: 'tailwindcss',
    }
    Object.entries(slugMap).forEach(([label, slug]) => {
      const pill = screen.getByText(label).closest('li')
      expect(pill).not.toBeNull()
      const img = pill!.querySelector('img')
      expect(img).not.toBeNull()
      expect(img!.getAttribute('src')).toBe(
        `https://cdn.simpleicons.org/${slug}/1c1917`
      )
    })
  })

  it('each pill has data-reveal attribute', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).toHaveAttribute('data-reveal')
    })
  })

  it('each pill has data-magnetic attribute', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).toHaveAttribute('data-magnetic')
    })
  })

  it('each pill has data-cursor-scale attribute', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).toHaveAttribute('data-cursor-scale')
    })
  })

  it('no pill has data-cursor-label attribute', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).not.toHaveAttribute('data-cursor-label')
    })
  })

  it('pills have correct transitionDelay: 0ms, 80ms, capped at 400ms for last', () => {
    render(<SkillsInteractive />)
    const pills = screen.getAllByRole('listitem')
    expect(pills[0]).toHaveStyle({ transitionDelay: '0ms' })
    expect(pills[1]).toHaveStyle({ transitionDelay: '80ms' })
    expect(pills[9]).toHaveStyle({ transitionDelay: '400ms' }) // Math.min(9*80=720, 400)
  })

  it('no pill has role=button', () => {
    render(<SkillsInteractive />)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('each pill has aria-label matching its label text', () => {
    render(<SkillsInteractive />)
    const labels = ['Python', 'C#', 'JavaScript', 'TypeScript', 'Shell',
                    'Unity', 'SQLite', 'Git', 'Astro', 'Tailwind']
    labels.forEach(label => {
      expect(screen.getByRole('listitem', { name: label })).toHaveAttribute('aria-label', label)
    })
  })
})
