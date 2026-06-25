import { ImageResponse } from 'next/og'
import { SITE } from './site'

// Shared 1200×630 social-card renderer. Used by every opengraph-image and
// twitter-image route so the editorial look (indigo on warm paper) stays
// consistent. Uses the runtime's bundled default font — no remote font fetch.

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = 'image/png'

const INDIGO = '#4F46E5'
const INK = '#111827'
const MUTED = '#6B7280'
const PAPER = '#FAFAF7'

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
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: INDIGO,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '26px',
                fontWeight: 700,
              }}
            >
              N
            </div>
            <span style={{ fontSize: '26px', color: INK, fontWeight: 600 }}>{SITE.name}</span>
          </div>
          {badge ? (
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: INDIGO,
                background: '#EEF2FF',
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
              color: INDIGO,
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
          <div style={{ width: '56px', height: '6px', borderRadius: '3px', background: INDIGO }} />
          <span style={{ fontSize: '22px', color: MUTED }}>{SITE.url.replace(/^https?:\/\//, '')}</span>
        </div>
      </div>
    ),
    { ...ogSize },
  )
}
