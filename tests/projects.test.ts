import { describe, it, expect } from 'vitest'
import { projects } from '../src/content/projects'

describe('projects data', () => {
  it('exports an array', () => {
    expect(Array.isArray(projects)).toBe(true)
  })

  it('every project has required fields', () => {
    for (const p of projects) {
      expect(p.id, `${p.id} missing id`).toBeTruthy()
      expect(p.title, `${p.id} missing title`).toBeTruthy()
      expect(p.description, `${p.id} missing description`).toBeTruthy()
      expect(p.outcome, `${p.id} missing outcome`).toBeTruthy()
      expect(Array.isArray(p.stack), `${p.id} stack must be array`).toBe(true)
      expect(p.stack.length, `${p.id} stack must not be empty`).toBeGreaterThan(0)
      expect(p.github, `${p.id} missing github`).toBeTruthy()
      expect(typeof p.featured, `${p.id} featured must be boolean`).toBe('boolean')
    }
  })

  it('only one project has a caseStudy route', () => {
    const withCaseStudy = projects.filter(p => p.caseStudy)
    expect(withCaseStudy).toHaveLength(1)
    expect(withCaseStudy[0].id).toBe('wayward-suns')
  })

  it('caseStudy project points to correct route', () => {
    const wayward = projects.find(p => p.id === 'wayward-suns')
    expect(wayward?.caseStudy).toBe('/projects/wayward-suns')
  })

  it('featured projects appear before non-featured', () => {
    const firstNonFeatured = projects.findIndex(p => !p.featured)
    const lastFeatured = projects.map(p => p.featured).lastIndexOf(true)
    if (firstNonFeatured !== -1 && lastFeatured !== -1) {
      expect(lastFeatured).toBeLessThan(firstNonFeatured)
    }
  })
})
