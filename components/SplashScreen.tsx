'use client'

import { useEffect, useState } from 'react'
import AnimatedLogo from '@/components/AnimatedLogo'

// ─── Splash screen ────────────────────────────────────────────────────────────
// Full-screen curtain that lets the NEA signature draw itself (~1.5s) before
// revealing the site, once per browser session. The repeat-visit skip happens
// pre-paint via an inline script in app/layout.tsx that sets
// html[data-splash-seen] (CSS hides the curtain), so there is no flash while
// React hydrates. Reduced-motion users never see it (globals.css).

const FADE_AT_MS = 1600 // signature finishes ~1.54s in (see AnimatedLogo)
const REMOVE_AT_MS = 2100 // FADE_AT + the 0.45s opacity transition

export const SPLASH_SEEN_KEY = 'nea-splash-seen'

export default function SplashScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // The inline <script> already hid the curtain for repeat visitors; just
    // skip the timers. try/catch: sessionStorage can throw (privacy modes).
    try {
      if (sessionStorage.getItem(SPLASH_SEEN_KEY)) {
        setGone(true)
        return
      }
      sessionStorage.setItem(SPLASH_SEEN_KEY, '1')
    } catch {
      /* run the splash without the once-per-session guard */
    }

    const fade = setTimeout(() => setFading(true), FADE_AT_MS)
    const remove = setTimeout(() => setGone(true), REMOVE_AT_MS)
    return () => {
      clearTimeout(fade)
      clearTimeout(remove)
    }
  }, [])

  if (gone) return null

  return (
    <div className={`nea-splash${fading ? ' nea-splash-out' : ''}`} aria-hidden="true">
      <AnimatedLogo size={96} />
    </div>
  )
}
