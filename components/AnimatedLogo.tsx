import type { CSSProperties } from 'react'

// ─── Animated NEA mark ────────────────────────────────────────────────────────
// Same geometry as public/logo.svg, but the letters "hand-write" themselves
// stroke by stroke on page load — a signature, which is the brand. The indigo
// tile pops in first, then the nine strokes draw in writing order (N → E → A),
// staggered via the --d custom property. Keyframes + reduced-motion fallback
// live in globals.css (.nea-logo). Static logo.svg stays for favicons/OG.

// One path per pen stroke, in the order a hand would write them.
const STROKES = [
  // N
  'M12 10L12 36',
  'M12 10L68 36',
  'M68 10L68 36',
  // E
  'M12 46L12 70',
  'M12 46L36 46',
  'M12 58L31 58',
  'M12 70L36 70',
  // A
  'M44 70L56 46L68 70',
  'M49 60L63 60',
]

const TILE_POP_S = 0.2 // letters start once the tile has mostly landed
const STAGGER_S = 0.13

export default function AnimatedLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      role="img"
      aria-label="NEA"
      className="nea-logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="nea-bg" width="80" height="80" rx="14" fill="var(--accent)" />
      {STROKES.map((d, i) => (
        <path
          key={d}
          className="nea-stroke"
          d={d}
          // Normalizes every stroke's length to 1 so dasharray/dashoffset
          // animate uniformly without measuring real path lengths.
          pathLength={1}
          stroke="white"
          strokeWidth={6.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ '--d': `${(TILE_POP_S + i * STAGGER_S).toFixed(2)}s` } as CSSProperties}
        />
      ))}
    </svg>
  )
}
