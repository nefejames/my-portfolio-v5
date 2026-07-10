'use client'

import { useEffect, useState } from 'react'
import AnimatedLogo from '@/components/AnimatedLogo'

// ─── Splash screen ────────────────────────────────────────────────────────────
// Full-screen curtain that lets the NEA signature draw itself (~1.3s) before
// revealing the page, then fades out. Rendered by the homepage (app/page.tsx)
// only, so it plays on every visit/navigation to the homepage and never on
// inner pages. Reduced-motion users never see it (app/animations.css hides
// .nea-splash). Because it renders server-side too, the curtain is in the
// initial HTML — no flash of content before it appears.

const FADE_AT_MS = 1300 // signature finishes ~1.25s in (see AnimatedLogo)
const REMOVE_AT_MS = 1750 // FADE_AT + the 0.45s opacity transition

export default function SplashScreen() {
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
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
