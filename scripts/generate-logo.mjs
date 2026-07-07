// Regenerates the two static logo assets from the single source of truth,
// lib/logo.data.json:
//   • public/logo.svg  — standalone brand mark
//   • app/icon.svg     — the favicon (Next.js file convention)
//
// The animated navbar/splash logo reads the JSON directly via lib/logo.ts, so it
// never needs regeneration. Run this after editing logo.data.json:
//
//   node scripts/generate-logo.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const logo = JSON.parse(readFileSync(join(root, 'lib/logo.data.json'), 'utf8'))

// Group the flat stroke list into one <path> per letter (N=3, E=4, A=2) purely
// so the static file stays readable; visually identical to nine separate paths.
const groups = [logo.strokes.slice(0, 3), logo.strokes.slice(3, 7), logo.strokes.slice(7)]

function svg(size) {
  const paths = groups
    .map(
      (g) =>
        `  <path d="${g.join('')}"\n        stroke="${logo.strokeColor}" stroke-width="${logo.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('\n')
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${logo.viewBox} ${logo.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${logo.label}">
  <rect width="${logo.viewBox}" height="${logo.viewBox}" rx="${logo.cornerRadius}" fill="${logo.accent}"/>
${paths}
</svg>
`
}

writeFileSync(join(root, 'public/logo.svg'), svg(48))
writeFileSync(join(root, 'app/icon.svg'), svg(48))
console.log('Regenerated public/logo.svg and app/icon.svg from lib/logo.data.json')
