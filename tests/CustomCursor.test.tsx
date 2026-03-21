import { render, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CustomCursor from '../src/components/CustomCursor'

// jsdom doesn't support matchMedia — mock it
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: query === '(pointer: fine)', // simulate desktop
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

afterEach(() => {
  document.documentElement.classList.remove('cursor-custom')
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: query === '(pointer: fine)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

describe('CustomCursor', () => {
  it('renders dot and label elements', () => {
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('[data-cursor-dot]')).toBeTruthy()
    expect(container.querySelector('[data-cursor-label-text]')).toBeTruthy()
  })

  it('adds cursor-custom class to html element on mount', () => {
    render(<CustomCursor />)
    expect(document.documentElement.classList.contains('cursor-custom')).toBe(true)
  })

  it('removes cursor-custom class from html on unmount', () => {
    const { unmount } = render(<CustomCursor />)
    unmount()
    expect(document.documentElement.classList.contains('cursor-custom')).toBe(false)
  })

  it('does not add cursor-custom class on touch devices', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    render(<CustomCursor />)
    expect(document.documentElement.classList.contains('cursor-custom')).toBe(false)
  })

  it('shows label text when data-cursor-label element is hovered', () => {
    const { container } = render(
      <div>
        <CustomCursor />
        <button data-cursor-label="View">card</button>
      </div>
    )
    const btn = container.querySelector('[data-cursor-label="View"]')!
    act(() => {
      btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })
    const labelSpan = document.querySelector('[data-cursor-label-text]') as HTMLElement
    expect(labelSpan?.textContent).toBe('View')
  })
})
