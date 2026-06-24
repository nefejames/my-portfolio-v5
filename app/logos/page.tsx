import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logo Exploration — NEA',
  robots: { index: false },
}

function Card({ id, name, el }: { id: number; name: string; el: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col items-center gap-4 hover:border-[#4F46E5] hover:shadow-md transition-all">
      <div className="w-24 h-24 flex items-center justify-center">{el}</div>
      <div className="text-center">
        <div className="text-xl font-bold text-[#4F46E5]">#{id}</div>
        <div className="text-xs text-[#9CA3AF] mt-0.5">{name}</div>
      </div>
    </div>
  )
}

export default function LogosPage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">NEA Logo Exploration</h1>
          <p className="text-[#6B7280]">48 directions across three series — just tell me the number</p>
        </div>

        {/* ── Series III: The Shortlist ───────────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#059669]">Series III</span>
            <span className="text-sm text-[#9CA3AF]">One stroke = writer · #41–48</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2 mb-6">
            The N's diagonal carries calligraphic weight — thin where the pen touches down, thick where it lifts. Everything else is geometric and clean.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">

          {/* 41 — Bare wordmark, tapered N diagonal */}
          <Card id={41} name="The Mark" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M12 18L12 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M38 18L38 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              {/* Tapered diagonal: fine point at (12,16), thick at bottom-right */}
              <path d="M12 16L42 80L34 84Z" fill="#4F46E5" />
              <path d="M46 18L46 82M46 18L66 18M46 50L62 50M46 82L66 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M72 82L82 18L92 82M76 60L88 60" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 42 — Indigo badge */}
          <Card id={42} name="Badge" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="18" fill="#4F46E5" />
              <path d="M12 18L12 82" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M38 18L38 82" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M12 16L42 80L34 84Z" fill="white" />
              <path d="M46 18L46 82M46 18L66 18M46 50L62 50M46 82L66 82" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M72 82L82 18L92 82M76 60L88 60" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 43 — Midnight */}
          <Card id={43} name="Midnight" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="18" fill="#0F172A" />
              <path d="M12 18L12 82" stroke="#A5B4FC" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M38 18L38 82" stroke="#A5B4FC" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M12 16L42 80L34 84Z" fill="#A5B4FC" />
              <path d="M46 18L46 82M46 18L66 18M46 50L62 50M46 82L66 82" stroke="#A5B4FC" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M72 82L82 18L92 82M76 60L88 60" stroke="#A5B4FC" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 44 — Thin strokes, dramatic taper */}
          <Card id={44} name="High Contrast" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M12 18L12 82" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
              <path d="M38 18L38 82" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
              {/* Wider thick end for more dramatic contrast */}
              <path d="M12 16L45 79L31 85Z" fill="#4F46E5" />
              <path d="M46 18L46 82M46 18L66 18M46 50L62 50M46 82L66 82" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
              <path d="M72 82L82 18L92 82M76 60L88 60" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 45 — Stacked, tapered diagonal on N */}
          <Card id={45} name="Stacked" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="18" fill="#4F46E5" />
              <path d="M12 10L12 42" stroke="white" strokeWidth="7" strokeLinecap="round" />
              <path d="M88 10L88 42" stroke="white" strokeWidth="7" strokeLinecap="round" />
              {/* N diagonal tapered across full width */}
              <path d="M12 9L91 38L87 46Z" fill="white" />
              <path d="M12 54L12 90M12 54L40 54M12 72L36 72M12 90L40 90" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54 90L71 54L88 90M60 77L82 77" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 46 — A crossbar tapers (pen stroke enters from left) */}
          <Card id={46} name="A-Stroke" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 18L8 82M8 18L32 82M32 18L32 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 18L40 82M40 18L60 18M40 50L56 50M40 82L60 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              {/* A — legs only, no crossbar stroke */}
              <path d="M68 82L80 18L92 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Tapered crossbar: point at left (pen down), width at right */}
              <path d="M62 58L88 55.5L88 60.5Z" fill="#4F46E5" />
            </svg>
          } />

          {/* 47 — Ink dot at pen-down point */}
          <Card id={47} name="Ink Touch" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M12 18L12 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M38 18L38 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M12 16L42 80L34 84Z" fill="#4F46E5" />
              {/* Tiny ink dot where pen first touched paper */}
              <circle cx="12" cy="15" r="3.5" fill="#4F46E5" />
              <path d="M46 18L46 82M46 18L66 18M46 50L62 50M46 82L66 82" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M72 82L82 18L92 82M76 60L88 60" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          {/* 48 — N alone as standalone mark */}
          <Card id={48} name="N Mark" el={
            <svg viewBox="0 0 50 100" fill="none" className="w-full h-full">
              <path d="M6 12L6 88" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
              <path d="M44 12L44 88" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" />
              {/* Tapered diagonal at full height */}
              <path d="M6 11L47 84L39 88Z" fill="#4F46E5" />
            </svg>
          } />

        </div>

        {/* ── Series I: Geometric ─────────────────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5]">Series I</span>
            <span className="text-sm text-[#9CA3AF]">Geometric · #1–20</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-16">

          <Card id={1} name="Stacked Block" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="18" fill="#4F46E5" />
              <path d="M12 10L12 42M12 10L88 42M88 10L88 42" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 54L12 90M12 54L40 54M12 72L36 72M12 90L40 90" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54 90L70 54L86 90M60 77L80 77" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={2} name="Circle Badge" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#4F46E5" />
              <path d="M8 30L8 70M8 30L28 70M28 30L28 70" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 30L36 70M36 30L54 30M36 50L51 50M36 70L54 70" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 70L72 30L82 70M65.5 57L78.5 57" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={3} name="Thin Architect" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M6 15L6 85M6 15L28 85M28 15L28 85" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 15L38 85M38 15L58 15M38 50L55 50M38 85L58 85" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 85L79 15L90 85M72 60L86 60" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={4} name="Heavy Slab" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 14L8 86M8 14L32 86M32 14L32 86" stroke="#1E1B4B" strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M44 14L44 86M44 14L64 14M44 50L62 50M44 86L64 86" stroke="#1E1B4B" strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" />
              <path d="M74 86L83 14L92 86M77 60L89 60" stroke="#1E1B4B" strokeWidth="13" strokeLinecap="square" strokeLinejoin="miter" />
            </svg>
          } />

          <Card id={5} name="N Hero" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 8L8 92M8 8L92 92M92 8L92 92" stroke="#4F46E5" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M64 14L64 34M64 14L82 14M64 24L80 24M64 34L82 34" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 88L24 66L32 88M19 81L29 81" stroke="#4F46E5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={6} name="Pill Gradient" el={
            <svg viewBox="0 0 160 80" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="g6" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <rect width="160" height="80" rx="40" fill="url(#g6)" />
              <path d="M22 18L22 62M22 18L46 62M46 18L46 62" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M58 18L58 62M58 18L78 18M58 40L76 40M58 62L78 62" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M90 62L104 18L118 62M95 47L113 47" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={7} name="Corner Cut" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M0 0L68 0L100 32L100 100L0 100Z" fill="#4F46E5" />
              <path d="M68 0L100 32" stroke="white" strokeWidth="1.5" opacity="0.4" />
              <path d="M10 32L10 80M10 32L32 80M32 32L32 80" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 32L40 80M40 32L60 32M40 56L57 56M40 80L60 80" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 80L78 32L88 80M71 60L85 60" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={8} name="Open Frame" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect x="4" y="4" width="92" height="92" rx="14" stroke="#4F46E5" strokeWidth="3" />
              <path d="M14 26L14 74M14 26L34 74M34 26L34 74" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 26L42 74M42 26L62 26M42 50L59 50M42 74L62 74" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M70 74L80 26L90 74M74 57L86 57" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={9} name="Ascending" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M4 52L4 92M4 52L24 92M24 52L24 92" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 32L32 72M32 32L52 32M32 52L49 52M32 72L52 72" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 52L72 8L84 52M64 34L80 34" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="1" y="95" width="22" height="3" rx="1.5" fill="#4F46E5" opacity="0.35" />
              <rect x="29" y="75" width="22" height="3" rx="1.5" fill="#4F46E5" opacity="0.35" />
              <rect x="57" y="55" width="30" height="3" rx="1.5" fill="#4F46E5" opacity="0.35" />
            </svg>
          } />

          <Card id={10} name="Triple Tile" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect x="2" y="20" width="28" height="60" rx="7" fill="#4F46E5" />
              <rect x="36" y="20" width="28" height="60" rx="7" fill="#4F46E5" />
              <rect x="70" y="20" width="28" height="60" rx="7" fill="#4F46E5" />
              <path d="M8 30L8 70M8 30L24 70M24 30L24 70" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 30L42 70M42 30L58 30M42 50L56 50M42 70L58 70" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M76 70L84 30L92 70M79 56L89 56" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={11} name="Tall Column" el={
            <svg viewBox="0 0 60 160" fill="none" className="w-full h-full">
              <rect width="60" height="160" rx="14" fill="#4F46E5" />
              <path d="M10 12L10 46M10 12L50 46M50 12L50 46" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 60L10 100M10 60L50 60M10 80L44 80M10 100L50 100" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 148L30 114L50 148M16 134L44 134" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={12} name="Diamond" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M50 4L96 50L50 96L4 50Z" fill="#4F46E5" />
              <path d="M20 54L20 72M20 54L36 72M36 54L36 72" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 54L42 72M42 54L58 54M42 63L56 63M42 72L58 72" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M64 72L72 54L80 72M67 65L77 65" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={13} name="Neon Dark" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <defs>
                <filter id="glow13">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <rect width="100" height="100" rx="18" fill="#020617" />
              <g filter="url(#glow13)">
                <path d="M10 20L10 80M10 20L34 80M34 20L34 80" stroke="#818CF8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42 20L42 80M42 20L62 20M42 50L59 50M42 80L62 80" stroke="#818CF8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M70 80L80 20L90 80M73.5 59L86.5 59" stroke="#818CF8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          } />

          <Card id={14} name="Split Diagonal" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect width="100" height="100" rx="18" fill="#EEF2FF" />
              <clipPath id="clip14"><path d="M0 0L100 0L0 100Z" /></clipPath>
              <rect width="100" height="100" rx="18" fill="#4F46E5" clipPath="url(#clip14)" />
              <path d="M8 18L8 60M8 18L30 60M30 18L30 60" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52 40L52 82M52 40L72 40M52 61L69 61M52 82L72 82" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M78 82L88 40L98 82M81.5 64L94.5 64" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={15} name="Code Brackets" el={
            <svg viewBox="0 0 140 80" fill="none" className="w-full h-full">
              <rect width="140" height="80" rx="14" fill="#0F172A" />
              <path d="M18 18L8 40L18 62" stroke="#818CF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M122 18L132 40L122 62" stroke="#818CF8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M28 18L28 62M28 18L48 62M48 18L48 62" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M56 18L56 62M56 18L74 18M56 40L72 40M56 62L74 62" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 62L92 18L102 62M86 46L98 46" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M110 66L114 14" stroke="#818CF8" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
            </svg>
          } />

          <Card id={16} name="Layered Shadow" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M14 25L14 82M14 25L36 82M36 25L36 82" stroke="#C7D2FE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M44 25L44 82M44 25L64 25M44 53L61 53M44 82L64 82" stroke="#C7D2FE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M72 82L82 25L92 82M75.5 60L88.5 60" stroke="#C7D2FE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 20L10 77M10 20L32 77M32 20L32 77" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 20L40 77M40 20L60 20M40 48L57 48M40 77L60 77" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 77L78 20L88 77M71.5 55L84.5 55" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={17} name="Hexagon" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M50 4L90 27L90 73L50 96L10 73L10 27Z" fill="#4F46E5" />
              <path d="M18 40L18 64M18 40L34 64M34 40L34 64" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 40L40 64M40 40L58 40M40 52L55 52M40 64L58 64" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M64 64L72 40L80 64M67 57L77 57" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={18} name="Stamp Seal" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="white" stroke="#4F46E5" strokeWidth="7" />
              <circle cx="50" cy="50" r="37" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="4 3" />
              <path d="M16 40L16 64M16 40L32 64M32 40L32 64" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 40L38 64M38 40L56 40M38 52L53 52M38 64L56 64" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 64L70 40L78 64M65 56L75 56" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={19} name="Bold Underline" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M6 16L6 72M6 16L30 72M30 16L30 72" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 16L38 72M38 16L60 16M38 44L57 44M38 72L60 72" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 72L79 16L90 72M72 50L86 50" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="2" y="82" width="96" height="10" rx="5" fill="#4F46E5" />
            </svg>
          } />

          <Card id={20} name="Serif Touch" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 18L8 80M8 18L32 80M32 18L32 80" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 18L13 18M3 80L13 80M27 18L37 18M27 80L37 80" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
              <path d="M44 18L44 80M44 18L64 18M44 49L61 49M44 80L64 80" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M39 18L49 18M39 80L49 80" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
              <path d="M72 80L82 18L92 80M76 58L88 58" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M67 80L77 80M87 80L97 80" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
            </svg>
          } />

        </div>

        {/* ── Series II: The Writer ───────────────────────────────────── */}
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#E11D48]">Series II</span>
            <span className="text-sm text-[#9CA3AF]">The Writer · #21–40</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">

          <Card id={21} name="Nib Split" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M6 18L6 82M6 18L30 82M30 18L30 82" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 18L38 82M38 18L58 18M38 50L55 50M38 82L58 82" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 82L80 14L94 82M70 58L90 58" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="80" y1="14" x2="80" y2="58" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
              <circle cx="80" cy="12" r="4" fill="#4F46E5" />
            </svg>
          } />

          <Card id={22} name="Live Cursor" el={
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
              <rect width="120" height="80" rx="12" fill="#0F172A" />
              <path d="M8 14L8 66M8 14L28 66M28 14L28 66" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 14L36 66M36 14L54 14M36 40L51 40M36 66L54 66" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 66L72 14L82 66M65.5 46L78.5 46" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="89" y="12" width="7" height="54" rx="3.5" fill="#4F46E5" />
              <line x1="8" y1="72" x2="96" y2="72" stroke="#1E293B" strokeWidth="1.5" />
            </svg>
          } />

          <Card id={23} name="Fountain Pen" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M6 10L6 50M6 10L24 50M24 10L24 50" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 10L30 50M30 10L48 10M30 30L45 30M30 50L48 50" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M54 50L63 10L72 50M57 34L69 34" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 70L78 64L86 74L78 84L12 78Z" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" strokeLinejoin="round" />
              <path d="M70 64L68 56L74 56L76 64" fill="#4F46E5" opacity="0.5" />
              <line x1="26" y1="65" x2="26" y2="83" stroke="#4F46E5" strokeWidth="2" opacity="0.5" />
              <path d="M86 74L100 74M90 68L100 74L90 80" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          } />

          <Card id={24} name="Pencil" el={
            <svg viewBox="0 0 200 70" fill="none" className="w-full h-full">
              <rect x="36" y="8" width="130" height="54" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2.5" />
              <path d="M36 8L6 35L36 62Z" fill="#FEF08A" stroke="#4F46E5" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M14 35L6 35" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
              <rect x="152" y="8" width="14" height="54" fill="#FCA5A5" stroke="#4F46E5" strokeWidth="2.5" />
              <path d="M48 18L48 52M48 18L64 52M64 18L64 52" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M72 18L72 52M72 18L90 18M72 35L87 35M72 52L90 52" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M98 52L108 18L118 52M101 39L115 39" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={25} name="Quill Mark" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <ellipse cx="30" cy="28" rx="18" ry="24" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" transform="rotate(-20 30 28)" />
              <path d="M16 18L30 28M14 28L30 32M18 38L30 34" stroke="#4F46E5" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <path d="M44 18L30 28M46 28L30 32M42 38L30 34" stroke="#4F46E5" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <path d="M30 46L36 72L30 90" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M30 90L26 82" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
              <path d="M52 32L52 72M52 32L72 32M52 52L68 52M52 72L72 72" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M78 72L87 32L96 72M81 55L93 55" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={26} name="Ink Drop" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 10L8 46M8 10L26 46M26 10L26 46" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 10L32 46M32 10L50 10M32 28L47 28M32 46L50 46" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M56 46L65 10L74 46M59 32L71 32" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M50 60 C36 60 26 69 26 80 C26 91 37 98 50 98 C63 98 74 91 74 80 C74 69 64 60 50 60Z" fill="#4F46E5" />
              <path d="M50 54L44 62M50 54L56 62" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="40" cy="72" rx="4" ry="6" fill="white" opacity="0.25" transform="rotate(-20 40 72)" />
            </svg>
          } />

          <Card id={27} name="Ruled Lines" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <line x1="4" y1="30" x2="96" y2="30" stroke="#C7D2FE" strokeWidth="1.5" />
              <line x1="4" y1="50" x2="96" y2="50" stroke="#C7D2FE" strokeWidth="1.5" />
              <line x1="4" y1="70" x2="96" y2="70" stroke="#C7D2FE" strokeWidth="1.5" />
              <line x1="4" y1="90" x2="96" y2="90" stroke="#C7D2FE" strokeWidth="1.5" />
              <line x1="18" y1="4" x2="18" y2="96" stroke="#FCA5A5" strokeWidth="1.5" opacity="0.8" />
              <path d="M22 34L22 70M22 34L42 70M42 34L42 70" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M48 34L48 70M48 34L66 34M48 52L63 52M48 70L66 70" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M72 70L81 34L90 70M75 56L87 56" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={28} name="Edit Caret" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 16L8 64M8 16L30 64M30 16L30 64" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 16L38 64M38 16L58 16M38 40L55 40M38 64L58 64" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 64L76 16L86 64M69.5 46L82.5 46" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 90L50 72L82 90" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="28" y1="96" x2="72" y2="96" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          } />

          <Card id={29} name="Brush Stroke" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M4 42 C4 36 10 30 18 30 L82 28 C90 27 97 32 97 40 L97 60 C97 68 90 74 82 73 L18 71 C10 70 4 64 4 58Z" fill="#4F46E5" />
              <path d="M4 46 C0 42 0 56 4 54" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
              <path d="M97 38 C102 36 102 64 97 62" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" />
              <path d="M12 40L12 60M12 40L28 60M28 40L28 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 40L34 60M34 40L52 40M34 50L49 50M34 60L52 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M58 60L68 40L78 60M61 52L75 52" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={30} name="Typewriter Keys" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <rect x="4" y="22" width="28" height="56" rx="6" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2.5" />
              <rect x="8" y="26" width="20" height="48" rx="4" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="4" y="72" width="28" height="6" rx="3" fill="#4F46E5" opacity="0.15" />
              <rect x="36" y="22" width="28" height="56" rx="6" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2.5" />
              <rect x="40" y="26" width="20" height="48" rx="4" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="36" y="72" width="28" height="6" rx="3" fill="#4F46E5" opacity="0.15" />
              <rect x="68" y="22" width="28" height="56" rx="6" fill="#F8FAFC" stroke="#4F46E5" strokeWidth="2.5" />
              <rect x="72" y="26" width="20" height="48" rx="4" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
              <rect x="68" y="72" width="28" height="6" rx="3" fill="#4F46E5" opacity="0.15" />
              <path d="M10 34L10 66M10 34L26 66M26 34L26 66" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 34L42 66M42 34L58 34M42 50L56 50M42 66L58 66" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M74 66L82 34L90 66M77 54L87 54" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={31} name="Open Quote" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M10 54 C10 40 18 28 30 24 L26 34 C20 38 18 44 20 50 C22 56 28 58 32 56 C38 53 40 44 36 38 C32 32 24 32 18 36Z" fill="#4F46E5" opacity="0.15" />
              <path d="M10 54 C10 40 18 28 30 24 L26 34 C20 38 18 44 20 50 C22 56 28 58 32 56 C38 53 40 44 36 38 C32 32 24 32 18 36Z" stroke="#4F46E5" strokeWidth="1.5" />
              <path d="M36 54 C36 40 44 28 56 24 L52 34 C46 38 44 44 46 50 C48 56 54 58 58 56 C64 53 66 44 62 38 C58 32 50 32 44 36Z" fill="#4F46E5" opacity="0.15" />
              <path d="M36 54 C36 40 44 28 56 24 L52 34 C46 38 44 44 46 50 C48 56 54 58 58 56 C64 53 66 44 62 38 C58 32 50 32 44 36Z" stroke="#4F46E5" strokeWidth="1.5" />
              <path d="M14 66L14 88M14 66L26 88M26 66L26 88" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 66L32 88M32 66L46 66M32 77L44 77M32 88L46 88" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52 88L60 66L68 88M55 80L65 80" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M76 66 C80 62 86 66 84 72 C82 76 78 76 76 74" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" fill="none" />
              <circle cx="78" cy="80" r="3" fill="#4F46E5" opacity="0.6" />
            </svg>
          } />

          <Card id={32} name="Pilcrow" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M6 82L6 18L22 18 C34 18 42 26 42 38 C42 50 34 58 22 58L16 58L16 82Z" fill="#4F46E5" />
              <line x1="22" y1="58" x2="22" y2="82" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
              <path d="M52 18L52 82M52 18L72 18M52 50L68 50M52 82L72 82" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M78 82L88 18L98 82M81.5 60L94.5 60" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={33} name="Ink Splatter" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <circle cx="8" cy="20" r="3" fill="#4F46E5" opacity="0.3" />
              <circle cx="18" cy="10" r="2" fill="#4F46E5" opacity="0.2" />
              <circle cx="92" cy="25" r="4" fill="#4F46E5" opacity="0.25" />
              <circle cx="82" cy="12" r="2.5" fill="#4F46E5" opacity="0.2" />
              <circle cx="6" cy="75" r="2" fill="#4F46E5" opacity="0.2" />
              <circle cx="94" cy="80" r="3" fill="#4F46E5" opacity="0.25" />
              <circle cx="50" cy="6" r="2" fill="#4F46E5" opacity="0.15" />
              <circle cx="44" cy="90" r="3" fill="#4F46E5" opacity="0.2" />
              <circle cx="26" cy="8" r="1.5" fill="#4F46E5" opacity="0.3" />
              <circle cx="78" cy="90" r="1.5" fill="#4F46E5" opacity="0.3" />
              <path d="M10 22L10 78M10 22L32 78M32 22L32 78" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 22L40 78M40 22L60 22M40 50L57 50M40 78L60 78" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M68 78L78 22L88 78M71.5 57L84.5 57" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={34} name="Script Flow" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 82L8 18L32 82L32 18" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M32 18 C36 14 38 14 42 18" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M42 18L42 82" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M42 18L62 18" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M42 50L59 50" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M42 82L62 82" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M42 82 C50 88 60 88 68 82" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M68 82L80 18L92 82" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M72 60L88 60" stroke="#4F46E5" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M92 82 C98 80 102 76 100 70" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 3" opacity="0.6" fill="none" />
            </svg>
          } />

          <Card id={35} name="Red Pen" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 20L8 80M8 20L30 80M30 20L30 80" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 20L38 80M38 20L58 20M38 50L55 50M38 80L58 80" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 80L76 20L86 80M69.5 58L82.5 58" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 90L74 10" stroke="#E11D48" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
              <path d="M70 12L80 6L76 18Z" fill="#E11D48" opacity="0.85" />
            </svg>
          } />

          <Card id={36} name="N Pen Stroke" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <path d="M8 18L8 82" stroke="#4F46E5" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M40 18L40 82" stroke="#4F46E5" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M8 22L12 18L42 76L38 82Z" fill="#4F46E5" />
              <path d="M38 82L30 92L40 84" fill="#4F46E5" />
              <path d="M38 82L30 92" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
              <path d="M50 18L50 82M50 18L70 18M50 50L66 50M50 82L70 82" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M76 82L86 18L96 82M79.5 60L92.5 60" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={37} name="Bookmark" el={
            <svg viewBox="0 0 80 100" fill="none" className="w-full h-full">
              <path d="M4 4L76 4L76 96L40 78L4 96Z" fill="#4F46E5" />
              <path d="M12 12L68 12" stroke="white" strokeWidth="1.5" opacity="0.3" />
              <path d="M10 24L10 60M10 24L28 60M28 24L28 60" stroke="white" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M34 24L34 60M34 24L52 24M34 42L49 42M34 60L52 60" stroke="white" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M58 60L66 24L74 60M61 46L71 46" stroke="white" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={38} name="Open Book" el={
            <svg viewBox="0 0 120 100" fill="none" className="w-full h-full">
              <path d="M6 16 C6 14 20 10 58 14 L58 86 C20 82 6 86 6 84Z" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M62 14 C100 10 114 14 114 16 L114 84 C114 86 100 82 62 86Z" fill="white" stroke="#4F46E5" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M58 14C58 14 60 50 58 86" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M62 14C62 14 60 50 62 86" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="14" y1="34" x2="50" y2="34" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3" />
              <line x1="14" y1="46" x2="50" y2="46" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3" />
              <line x1="14" y1="58" x2="50" y2="58" stroke="#4F46E5" strokeWidth="1.5" opacity="0.3" />
              <path d="M68 24L68 60M68 24L82 60M82 24L82 60" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M86 24L86 60M86 24L100 24M86 42L98 42M86 60L100 60" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M104 60L110 24L116 60M106.5 46L113.5 46" stroke="#4F46E5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={39} name="Double Quotes" el={
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <text x="2" y="62" fontSize="80" fontFamily="Georgia, serif" fill="#4F46E5" opacity="0.12" fontWeight="bold">"</text>
              <text x="46" y="98" fontSize="80" fontFamily="Georgia, serif" fill="#4F46E5" opacity="0.12" fontWeight="bold">"</text>
              <path d="M14 30L14 70M14 30L34 70M34 30L34 70" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M40 30L40 70M40 30L60 30M40 50L57 50M40 70L60 70" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 70L76 30L86 70M69.5 53L82.5 53" stroke="#4F46E5" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />

          <Card id={40} name="Ink Trail" el={
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full">
              <rect width="120" height="80" rx="14" fill="#F8FAFC" stroke="#E5E7EB" strokeWidth="1.5" />
              <path d="M10 12L10 68M10 12L28 68M28 12L28 68" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M36 12L36 68M36 12L54 12M36 40L51 40M36 68L54 68" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 68L72 12L82 68M65.5 46L78.5 46" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M82 68 C90 64 96 58 100 52" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M100 52 C104 46 108 40 110 34" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
              <path d="M110 34 C112 28 114 22 114 18" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.2" />
              <circle cx="114" cy="16" r="1.5" fill="#4F46E5" opacity="0.15" />
            </svg>
          } />

        </div>
      </div>
    </div>
  )
}
