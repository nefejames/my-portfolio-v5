import data from './logo.data.json'

// ─── Logo: single source of truth ─────────────────────────────────────────────
// The NEA mark's geometry and colors live in lib/logo.data.json. This module is
// the typed accessor the app reads from (components/AnimatedLogo.tsx). The two
// static assets that can't import TS — public/logo.svg and app/icon.svg — are
// regenerated from the same JSON via `node scripts/generate-logo.mjs`.
//
// To change the logo: edit logo.data.json, then run that script. Done in one place.

export const LOGO = {
  /** The square viewBox side; the mark is drawn on a `size × size` grid. */
  size: data.viewBox,
  cornerRadius: data.cornerRadius,
  strokeWidth: data.strokeWidth,
  accent: data.accent,
  strokeColor: data.strokeColor,
  label: data.label,
  /** One SVG path per pen stroke, in the order a hand would write them. */
  strokes: data.strokes as readonly string[],
} as const
