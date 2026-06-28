'use client'

import { Caveat } from 'next/font/google'
import { motion, useReducedMotion, type Transition } from 'motion/react'

// One handwriting font (none existed in the project; Caveat per the brief).
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

// ─── Layout constants (SVG user units; tuned to the Caveat metrics) ───────────
const VB_W = 600
const VB_H = 250
const FULL_NAME = 'Emadamerho-Atori Nefe'

const L1 = { text: 'Emadamerho-Atori', x: 6, baseline: 84, size: 62, weight: 600, width: 492 }
const L2 = { text: 'Nefe', x: 6, baseline: 212, size: 108, weight: 700, width: 214 }

// Timeline: line 1 (deliberate) → line 2 (shorter) → hold (pause) via repeatDelay.
const D1 = 3.6 // line 1 seconds
const D2 = 1.8 // line 2 seconds
const TOTAL = D1 + D2
const PAUSE = 1.5
const t1 = D1 / TOTAL // normalized split point

const loop: Omit<Transition, 'times'> = {
  duration: TOTAL,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatDelay: PAUSE,
}

// Pen sits a touch above each baseline, riding the leading edge of the reveal.
const penY1 = L1.baseline - 14
const penY2 = L2.baseline - 22

export default function WritingAnimation() {
  const reduce = useReducedMotion()

  const textStyle = { fontFamily: caveat.style.fontFamily } as const

  return (
    <>
      {/* Accessible name — the SVG below is decorative (aria-hidden). */}
      <span className="sr-only">{FULL_NAME}</span>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block w-full max-w-[600px] h-auto"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          {/* Left→right reveal wipes (scaleX is a transform — no layout props). */}
          <clipPath id="wa-clip-1">
            <motion.rect
              x={0}
              y={28}
              width={L1.width + 24}
              height={84}
              style={{ transformBox: 'fill-box', transformOrigin: 'left' }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={reduce ? undefined : { scaleX: [0, 1, 1] }}
              transition={{ ...loop, times: [0, t1, 1] }}
            />
          </clipPath>
          <clipPath id="wa-clip-2">
            <motion.rect
              x={0}
              y={120}
              width={L2.width + 24}
              height={120}
              style={{ transformBox: 'fill-box', transformOrigin: 'left' }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={reduce ? undefined : { scaleX: [0, 0, 1] }}
              transition={{ ...loop, times: [0, t1, 1] }}
            />
          </clipPath>
        </defs>

        {/* Line 1 — accent color */}
        <text
          x={L1.x}
          y={L1.baseline}
          clipPath={reduce ? undefined : 'url(#wa-clip-1)'}
          style={{ ...textStyle, fill: 'var(--accent-text)' }}
          fontSize={L1.size}
          fontWeight={L1.weight}
        >
          {L1.text}
        </text>

        {/* Line 2 — primary color, larger & bolder (the signature) */}
        <text
          x={L2.x}
          y={L2.baseline}
          clipPath={reduce ? undefined : 'url(#wa-clip-2)'}
          style={{ ...textStyle, fill: 'var(--text)' }}
          fontSize={L2.size}
          fontWeight={L2.weight}
        >
          {L2.text}
        </text>

        {/* Pen — minimal nib, geometry pre-tilted with its tip at (0,0) so a plain
            translate rides the writing point. Hidden entirely under reduced motion. */}
        {!reduce && (
          <motion.g
            initial={{ x: L1.x, y: penY1, opacity: 1 }}
            animate={{
              x: [L1.x, L1.x + L1.width, L2.x, L2.x + L2.width],
              y: [penY1, penY1, penY2, penY2],
              opacity: [1, 1, 1, 0],
            }}
            transition={{ ...loop, times: [0, t1, t1, 1] }}
          >
            <g style={{ color: 'var(--text)' }}>
              {/* nib */}
              <path d="M0 0 L7 -9 L12 -4 Z" fill="currentColor" />
              {/* barrel */}
              <path
                d="M10 -6 L30 -32 a4 4 0 0 1 6 6 L16 0 Z"
                fill="currentColor"
              />
              {/* slit */}
              <line x1="2.5" y1="-3" x2="8" y2="-8" stroke="var(--bg)" strokeWidth={1.2} />
            </g>
          </motion.g>
        )}
      </svg>
    </>
  )
}
