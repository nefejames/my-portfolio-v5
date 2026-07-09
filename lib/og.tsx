import { ImageResponse } from 'next/og'
import { SITE } from './site'
import { LOGO } from './logo'

// Shared 1200×630 social-card renderer. Used by every opengraph-image and
// twitter-image route so the editorial look (indigo on warm paper) stays
// consistent. Uses the runtime's bundled default font — no remote font fetch.

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

const INDIGO = '#4F46E5' // brand mark fill (white "N" sits on it)
const ACCENT = '#818CF8' // brighter indigo for text/accents on the dark card
const INK = '#F4F4F5'
const MUTED = '#A1A1AA'
const PAPER = '#0F0F12'

export function renderOgImage({
  title,
  eyebrow,
  badge,
}: {
  title: string
  /** Small label above the title. Defaults to the site owner's name. */
  eyebrow?: string
  /** Optional pill in the top-right, e.g. "Blog" or a client name. */
  badge?: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: PAPER,
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: brand mark + optional badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* The real NEA mark, from the single source (lib/logo.data.json). */}
            <svg width="44" height="44" viewBox={`0 0 ${LOGO.size} ${LOGO.size}`}>
              <rect
                width={LOGO.size}
                height={LOGO.size}
                rx={LOGO.cornerRadius}
                fill={LOGO.accent}
              />
              {LOGO.strokes.map((d) => (
                <path
                  key={d}
                  d={d}
                  stroke={LOGO.strokeColor}
                  strokeWidth={LOGO.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              ))}
            </svg>
            <span style={{ fontSize: '26px', color: INK, fontWeight: 600 }}>{SITE.name}</span>
          </div>
          {badge ? (
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#C7D2FE',
                background: '#1E1B4B',
                padding: '10px 22px',
                borderRadius: '9999px',
              }}
            >
              {badge}
            </span>
          ) : null}
        </div>

        {/* Title block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '24px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: ACCENT,
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            {eyebrow ?? SITE.jobTitle}
          </span>
          <span
            style={{
              fontSize: title.length > 70 ? '56px' : '68px',
              lineHeight: 1.1,
              color: INK,
              fontWeight: 700,
              maxWidth: '1000px',
            }}
          >
            {title}
          </span>
        </div>

        {/* Footer accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '6px', borderRadius: '3px', background: ACCENT }} />
          <span style={{ fontSize: '22px', color: MUTED }}>{SITE.url.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
