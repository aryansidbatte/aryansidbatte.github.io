import { describe, it, expect } from 'vitest'
import {
  generateParticles,
  scaleParticles,
  applyPartingForce,
  applyOrbitForce,
  applyExplosionForce,
  updateVelocity,
  wrapEdges,
  type Particle,
} from '../src/lib/sand-drift'

function makeParticle(overrides: Partial<Particle> = {}): Particle {
  return { x: 100, y: 100, vx: 0, vy: 0, size: 1, baseVx: 0.2, ...overrides }
}

describe('generateParticles', () => {
  it('generates the requested count', () => {
    expect(generateParticles(800, 600, 10)).toHaveLength(10)
  })

  it('defaults to 560 particles', () => {
    expect(generateParticles(800, 600)).toHaveLength(560)
  })

  it('positions all particles within canvas bounds', () => {
    const pts = generateParticles(800, 600, 100)
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(800)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(600)
    }
  })

  it('initialises vx and vy to 0', () => {
    const pts = generateParticles(800, 600, 10)
    for (const p of pts) {
      expect(p.vx).toBe(0)
      expect(p.vy).toBe(0)
    }
  })

  it('size is in [0.3, 1.3]', () => {
    const pts = generateParticles(800, 600, 200)
    for (const p of pts) {
      expect(p.size).toBeGreaterThanOrEqual(0.3)
      expect(p.size).toBeLessThanOrEqual(1.3)
    }
  })

  it('baseVx is in [0.15, 0.25]', () => {
    const pts = generateParticles(800, 600, 200)
    for (const p of pts) {
      expect(p.baseVx).toBeGreaterThanOrEqual(0.15)
      expect(p.baseVx).toBeLessThanOrEqual(0.25)
    }
  })
})

describe('scaleParticles', () => {
  it('regenerates when oldW is undefined', () => {
    const pts = scaleParticles([], undefined, undefined, 800, 600)
    expect(pts).toHaveLength(560)
  })

  it('regenerates when oldW is 0', () => {
    const pts = scaleParticles([], 0, 0, 800, 600)
    expect(pts).toHaveLength(560)
  })

  it('scales positions proportionally on resize', () => {
    const pts = [makeParticle({ x: 400, y: 300 })]
    scaleParticles(pts, 800, 600, 400, 300)
    expect(pts[0].x).toBeCloseTo(200)
    expect(pts[0].y).toBeCloseTo(150)
  })

  it('preserves velocity on resize', () => {
    const pts = [makeParticle({ vx: 0.2, vy: 0.1 })]
    scaleParticles(pts, 800, 600, 400, 300)
    expect(pts[0].vx).toBe(0.2)
    expect(pts[0].vy).toBe(0.1)
  })
})

describe('applyPartingForce', () => {
  it('does nothing when cursor is inactive', () => {
    const p = makeParticle({ x: 100, y: 100, vx: 0, vy: 0 })
    applyPartingForce(p, 100, 100, false)
    expect(p.vx).toBe(0)
    expect(p.vy).toBe(0)
  })

  it('does nothing when cursor is outside radius', () => {
    const p = makeParticle({ x: 200, y: 200, vx: 0.1, vy: 0.1 })
    applyPartingForce(p, 0, 0, true) // d = ~283, > 55
    expect(p.vx).toBe(0.1) // unchanged
    expect(p.vy).toBe(0.1) // unchanged
  })

  it('pushes particle away from cursor when inside radius', () => {
    const p = makeParticle({ x: 60, y: 0, vx: 0, vy: 0 })
    applyPartingForce(p, 30, 0, true) // d = 30, cursor to left
    expect(p.vx).toBeGreaterThan(0) // pushed right (away from cursor)
  })

  it('does not divide by zero when cursor exactly overlaps particle', () => {
    const p = makeParticle({ x: 100, y: 100, vx: 0, vy: 0 })
    expect(() => applyPartingForce(p, 100, 100, true)).not.toThrow()
    expect(p.vx).toBe(0) // d === 0, guard prevents force
    expect(p.vy).toBe(0)
  })
})

describe('applyOrbitForce', () => {
  it('does not divide by zero when particle is exactly at center', () => {
    const p = makeParticle({ x: 100, y: 100, vx: 0, vy: 0 })
    expect(() => applyOrbitForce(p, 100, 100, 1.2)).not.toThrow()
    expect(p.vx).toBe(0)
    expect(p.vy).toBe(0)
  })

  it('applies force when particle is away from center', () => {
    const p = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    applyOrbitForce(p, 100, 100, 1.2)
    expect(p.vx).toBeLessThan(0)
    expect(p.vy).toBeGreaterThan(0)
  })

  it('scales force with strength', () => {
    const p1 = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    const p2 = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    applyOrbitForce(p1, 100, 100, 1.0)
    applyOrbitForce(p2, 100, 100, 2.0)
    expect(Math.abs(p2.vx)).toBeCloseTo(Math.abs(p1.vx) * 2, 5)
    expect(Math.abs(p2.vy)).toBeCloseTo(Math.abs(p1.vy) * 2, 5)
  })

  it('clockwise: particle above center gets rightward tangential push', () => {
    const p = makeParticle({ x: 100, y: 0, vx: 0, vy: 0 })
    applyOrbitForce(p, 100, 100, 1.0)
    expect(p.vx).toBeGreaterThan(0)
  })
})

describe('updateVelocity', () => {
  it('moves vx toward baseVx over time', () => {
    const p = makeParticle({ vx: 0, baseVx: 0.2 })
    updateVelocity(p, 0)
    expect(p.vx).toBeGreaterThan(0)
    expect(p.vx).toBeLessThan(0.2)
  })

  it('does not overshoot baseVx', () => {
    const p = makeParticle({ vx: 0, baseVx: 0.2 })
    for (let i = 0; i < 200; i++) updateVelocity(p, i)
    expect(p.vx).toBeLessThanOrEqual(0.25) // never exceeds max baseVx + wobble
  })

  it('vy settles to a small value driven by wind wobble', () => {
    const p = makeParticle({ vy: 0, baseVx: 0.2 })
    for (let i = 0; i < 100; i++) updateVelocity(p, i)
    expect(Math.abs(p.vy)).toBeLessThan(0.2) // bounded by wobble amplitude
  })
})

describe('applyExplosionForce', () => {
  it('does not divide by zero when particle is exactly at center', () => {
    const p = makeParticle({ x: 100, y: 100, vx: 0, vy: 0 })
    expect(() => applyExplosionForce(p, 100, 100, 6.0)).not.toThrow()
    expect(p.vx).toBe(0)
    expect(p.vy).toBe(0)
  })

  it('pushes particle radially away from center', () => {
    const p = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    applyExplosionForce(p, 100, 100, 6.0)
    expect(p.vx).toBeGreaterThan(0)
    expect(p.vy).toBeCloseTo(0, 1)
  })

  it('pushes particle to the left when it is left of center', () => {
    const p = makeParticle({ x: 0, y: 100, vx: 0, vy: 0 })
    applyExplosionForce(p, 100, 100, 6.0)
    expect(p.vx).toBeLessThan(0)
  })

  it('scales force with strength', () => {
    const p1 = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    const p2 = makeParticle({ x: 200, y: 100, vx: 0, vy: 0 })
    applyExplosionForce(p1, 100, 100, 1.0)
    applyExplosionForce(p2, 100, 100, 3.0)
    expect(p2.vx).toBeCloseTo(p1.vx * 3, 5)
  })
})

describe('wrapEdges', () => {
  it('wraps particle past right edge to left', () => {
    const p = makeParticle({ x: 810 }) // W=800, 810 > 805
    wrapEdges(p, 800, 600)
    expect(p.x).toBe(-5)
  })

  it('wraps particle past left edge to right', () => {
    const p = makeParticle({ x: -6 })
    wrapEdges(p, 800, 600)
    expect(p.x).toBe(805)
  })

  it('wraps particle past bottom edge to top', () => {
    const p = makeParticle({ y: 610 })
    wrapEdges(p, 800, 600)
    expect(p.y).toBe(-5)
  })

  it('wraps particle past top edge to bottom', () => {
    const p = makeParticle({ y: -6 })
    wrapEdges(p, 800, 600)
    expect(p.y).toBe(605)
  })

  it('preserves velocity on wrap', () => {
    const p = makeParticle({ x: 810, vx: 0.3, vy: 0.1 })
    wrapEdges(p, 800, 600)
    expect(p.vx).toBe(0.3)
    expect(p.vy).toBe(0.1)
  })

  it('does not wrap particles still within bounds', () => {
    const p = makeParticle({ x: 400, y: 300 })
    wrapEdges(p, 800, 600)
    expect(p.x).toBe(400)
    expect(p.y).toBe(300)
  })
})
