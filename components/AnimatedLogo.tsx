'use client'

import { useState, type CSSProperties } from 'react'
import { LOGO } from '@/lib/logo'

// ─── Animated NEA mark ────────────────────────────────────────────────────────
// The NEA letters "hand-write" themselves stroke by stroke — a signature, which
// is the brand. The indigo tile pops in first, then the strokes draw in writing
// order (N → E → A), staggered via the --d custom property. Hovering the mark
// replays the whole signature (the SVG remounts via `key`, restarting its CSS
// animations). All keyframes + the reduced-motion fallback live in
// app/animations.css (.nea-logo).
//
// Geometry/colors come from lib/logo.ts (single source — see lib/logo.data.json).
// The favicon (app/icon.svg) and public/logo.svg regenerate from that same JSON.

// Draw pacing. Keep in sync with the splash timing in SplashScreen.tsx: the
// last stroke finishes at TILE_POP_S + (n-1)*STAGGER_S + stroke-duration(0.3s).
const TILE_POP_S = 0.15 // letters start once the tile has mostly landed
const STAGGER_S = 0.1

export default function AnimatedLogo({ size = 36 }: { size?: number }) {
  // Bumping the key remounts the SVG, which restarts every CSS animation in
  // it — the hover-replay. (Reduced-motion users: animations.css disables the
  // keyframes, so a remount just re-renders the finished mark. Harmless.)
  const [run, setRun] = useState(0)

  return (
    <svg
      key={run}
      onPointerEnter={() => setRun((r) => r + 1)}
      width={size}
      height={size}
      viewBox={`0 0 ${LOGO.size} ${LOGO.size}`}
      fill="none"
      role="img"
      aria-label={LOGO.label}
      className="nea-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="nea-bg"
        width={LOGO.size}
        height={LOGO.size}
        rx={LOGO.cornerRadius}
        fill="var(--accent)"
      />
      {LOGO.strokes.map((d, i) => (
        <path
          key={d}
          className="nea-stroke"
          d={d}
          // Normalizes every stroke's length to 1 so dasharray/dashoffset
          // animate uniformly without measuring real path lengths.
          pathLength={1}
          stroke={LOGO.strokeColor}
          strokeWidth={LOGO.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ '--d': `${(TILE_POP_S + i * STAGGER_S).toFixed(2)}s` } as CSSProperties}
        />
      ))}
    </svg>
  )
}
