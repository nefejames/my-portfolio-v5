import type { Variants, Transition } from 'motion/react'

// ─── Shared animation variants ────────────────────────────────────────────────
// Central home for reusable Motion variants so animations stay consistent and
// on-brand (snappy, editorial-minimal — short durations, stiff springs). Import
// these instead of redefining variants per component. See
// skills/framer-motion/SKILL.md for usage, rules, and the reduced-motion pattern.
//
// Only animate `transform` (x/y/scale/rotate) and `opacity`. Never animate
// layout properties (width/height/top/left) — see the skill's performance rules.

/** Snappy ease-out curve — quick start, soft settle. */
export const easeOut = [0.22, 1, 0.36, 1] as const

/** Duration-based transition for simple fades. */
export const snappy: Transition = { duration: 0.3, ease: easeOut }

/** Spring for interactive/entrance motion (hover, scale, slide). */
export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.8,
}

/** Viewport config for scroll reveals: run once, a little before fully in view. */
export const inViewOnce = { once: true, amount: 0.2 } as const

// ─── Variants ─────────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: snappy },
}

/** The workhorse reveal: fade + small upward slide. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: snappy },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: snappySpring },
}

/** Parent of a staggered group. Pair with `staggerItem` on each child. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerItem: Variants = fadeInUp

/** SVG line drawing — animate `pathLength` 0 → 1 (see the skill's SVG section). */
export const pathDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 0.8, ease: easeOut }, opacity: { duration: 0.15 } },
  },
}
