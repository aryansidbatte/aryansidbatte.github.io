export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseVx: number
}

export function generateParticles(W: number, H: number, count = 560): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: 0,
    vy: 0,
    size: 0.3 + Math.random() * 1.0,
    baseVx: 0.15 + Math.random() * 0.1,
  }))
}

// Scales existing particle positions proportionally when canvas is resized.
// If oldW or oldH is 0 or undefined, regenerates fresh particles.
export function scaleParticles(
  particles: Particle[],
  oldW: number | undefined,
  oldH: number | undefined,
  newW: number,
  newH: number
): Particle[] {
  if (!oldW || !oldH) {
    return generateParticles(newW, newH, particles.length || 560)
  }
  for (const p of particles) {
    p.x *= newW / oldW
    p.y *= newH / oldH
  }
  return particles
}

export const PART_RADIUS = 55
const PART_STRENGTH = 2.5

// Mutates p.vx and p.vy. Safe to call with active=false (no-op).
export function applyPartingForce(
  p: Particle,
  cursorX: number,
  cursorY: number,
  active: boolean
): void {
  if (!active) return
  const dx = p.x - cursorX
  const dy = p.y - cursorY
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d > 0 && d < PART_RADIUS) {
    const f = (1 - d / PART_RADIUS) * PART_STRENGTH
    p.vx += (dx / d) * f
    p.vy += (dy / d) * f
  }
}

// Pulls particle toward (cx, cy) with a clockwise tangential offset.
// Radial and tangential components are equal magnitude, both scaled by strength.
// Guard: no-op if d === 0 (particle exactly at center).
export function applyOrbitForce(
  p: Particle,
  cx: number,
  cy: number,
  strength: number
): void {
  const dx = p.x - cx
  const dy = p.y - cy
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d === 0) return
  // Radial: pull toward center
  const rx = -(dx / d) * strength
  const ry = -(dy / d) * strength
  // Tangential: clockwise perpendicular (-dy/d, dx/d)
  const tx = (-dy / d) * strength
  const ty = (dx / d) * strength
  p.vx += rx + tx
  p.vy += ry + ty
}

// Pushes particle radially away from (cx, cy), scaled by strength.
// Guard: no-op if d === 0.
export function applyExplosionForce(
  p: Particle,
  cx: number,
  cy: number,
  strength: number
): void {
  const dx = p.x - cx
  const dy = p.y - cy
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d === 0) return
  p.vx += (dx / d) * strength
  p.vy += (dy / d) * strength
}

// Advances particle velocity one step toward the wind target.
// t is a monotonically increasing integer frame counter.
export function updateVelocity(p: Particle, t: number): void {
  const wy = p.baseVx * 0.3 + Math.sin(p.x * 0.02 + t * 0.5) * 0.08
  p.vx += (p.baseVx - p.vx) * 0.05
  p.vy += (wy - p.vy) * 0.05
}

// Wraps particle position at canvas edges. Velocity is preserved.
export function wrapEdges(p: Particle, W: number, H: number): void {
  if (p.x > W + 5) p.x = -5
  if (p.x < -5) p.x = W + 5
  if (p.y > H + 5) p.y = -5
  if (p.y < -5) p.y = H + 5
}
