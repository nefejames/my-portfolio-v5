'use client'

import { useEffect, useState } from 'react'
import AnimatedLogo from '@/components/AnimatedLogo'

// ─── Splash screen ────────────────────────────────────────────────────────────
// Full-screen curtain that draws the NEA signature (~1.3s) then fades. Rendered
// by the homepage only. It plays on a genuine page load — fresh visit, refresh,
// external link — but NOT on in-site client navigations back to the homepage
// (e.g. clicking the navbar logo). Reduced-motion users skip it (animations.css).
//
// `played` is a module-level flag set only after the splash finishes, and only
// on the client (it's touched inside effects/timers, never during server
// render). That gives us exactly the signal we want:
//   • The server never mutates it, so every SSR render includes the curtain —
//     no flash of content before it, and no hydration mismatch.
//   • A full page load starts a fresh JS context (played = false) → it plays.
//   • A client-side navigation reuses the same JS context (played = true) → the
//     curtain never renders, not even for a frame.

const FADE_AT_MS = 1300 // signature finishes ~1.25s in (see AnimatedLogo)
const REMOVE_AT_MS = 1750 // FADE_AT + the 0.45s opacity transition

let played = false

export default function SplashScreen() {
  // On a client-side return to the homepage, played is already true, so the
  // curtain is never rendered. On a real load it starts visible on both server
  // and client (played is false), so SSR and hydration agree.
  const [visible, setVisible] = useState(() => !played)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (played) return
    const fade = setTimeout(() => setFading(true), FADE_AT_MS)
    const remove = setTimeout(() => {
      played = true // marks "already shown this JS session" — skips on client nav
      setVisible(false)
    }, REMOVE_AT_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(remove)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={`nea-splash${fading ? ' nea-splash-out' : ''}`} aria-hidden="true">
      <AnimatedLogo size={96} />
    </div>
  )
}
