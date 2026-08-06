'use client'

import { useEffect, useState } from 'react'
import AnimatedLogo from '@/components/AnimatedLogo'

// ─── Splash screen ────────────────────────────────────────────────────────────
// Full-screen curtain that draws the NEA signature (~1.3s) then fades. Rendered
// by the homepage only. It plays on a genuine page load of '/' — fresh visit,
// refresh, external link — but NOT on in-site client navigations to the
// homepage. Reduced-motion users skip it entirely (animations.css).
//
// Two complementary guards:
//
//   _startedOnHome — captured once at module evaluation time. If the JS
//   bundle first runs on any page other than '/' (e.g. the user lands on
//   /blog/foo then clicks the logo), the splash is pre-suppressed because
//   the only path back to '/' is a client-side navigation, not a fresh load.
//
//   played — set to true after the splash finishes. Suppresses it on any
//   later SPA navigation back to '/' within the same JS session.
//
// SSR/hydration safety: both guards default to false/true on the server so
// every SSR render includes the curtain. The module-level expressions only
// run on the client.

const FADE_AT_MS = 1300 // signature finishes ~1.25s in (see AnimatedLogo)
const REMOVE_AT_MS = 1750 // FADE_AT + the 0.45s opacity transition

const _startedOnHome =
  typeof window === 'undefined' ? true : window.location.pathname === '/'

let played = !_startedOnHome

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => !played)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (played) return
    const fade = setTimeout(() => setFading(true), FADE_AT_MS)
    const remove = setTimeout(() => {
      played = true
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
