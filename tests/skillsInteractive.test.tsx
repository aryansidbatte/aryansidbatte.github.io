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
  it('renders at least one skill pill', () => {
    render(<SkillsInteractive />)
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('each pill has a non-empty label', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill.textContent?.trim()).toBeTruthy()
    })
  })

  it('each pill has an img pointing to the Simple Icons CDN', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      const img = pill.querySelector('img')
      expect(img).not.toBeNull()
      expect(img!.getAttribute('src')).toMatch(/^https:\/\/cdn\.simpleicons\.org\//)
    })
  })

  it('each pill has data-reveal, data-magnetic, and data-cursor-scale', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).toHaveAttribute('data-reveal')
      expect(pill).toHaveAttribute('data-magnetic')
      expect(pill).toHaveAttribute('data-cursor-scale')
    })
  })

  it('no pill has data-cursor-label or role=button', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      expect(pill).not.toHaveAttribute('data-cursor-label')
    })
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('first pill has no delay, second has 80ms delay', () => {
    render(<SkillsInteractive />)
    const pills = screen.getAllByRole('listitem')
    expect(pills[0]).toHaveStyle({ transitionDelay: '0ms' })
    expect(pills[1]).toHaveStyle({ transitionDelay: '80ms' })
  })

  it('each pill has aria-label matching its visible text', () => {
    render(<SkillsInteractive />)
    screen.getAllByRole('listitem').forEach(pill => {
      const label = pill.getAttribute('aria-label')
      expect(label).toBeTruthy()
      expect(pill.textContent).toContain(label)
    })
  })
})
