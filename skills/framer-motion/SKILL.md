# Framer Motion (Motion) — Animation Skill

Conventions, patterns, and rules for building animations in **this** project.
Read this before building any animation and follow it exactly.

> **Why "Motion" not "Framer Motion"?** Framer Motion was rebranded to **`motion`**.
> This repo uses the `motion` package and imports from **`motion/react`** —
> never `framer-motion`.

---

## 1. Setup & version

- Package: **`motion@12.42.0`** (installed). Import from **`motion/react`**.
- Stack: **Next.js 16 (App Router)**, React 19, TypeScript, **Tailwind v4**
  (no `tailwind.config.js` — design tokens are CSS variables in
  [`app/globals.css`](../../app/globals.css)).

**Gotchas specific to this setup:**

- **`'use client'` is required.** `motion` components use hooks/Context, so any
  file that imports from `motion/react` must start with `'use client'`. Most of
  this app is React Server Components by default — keep animations in small leaf
  client components and let server components render around them.
- Import surface: `import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react'`.
- Don't animate colors with hex literals — this site is themed with CSS variables
  (`--accent`, `--text`, …). Animate `transform`/`opacity`; let color come from
  Tailwind classes/tokens (see Performance rules).

---

## 2. Where animation code lives

| What | Where |
|---|---|
| Shared variants (fadeIn, slideUp, stagger, pathDraw…) | **`lib/animations.ts`** (already exists — import from here) |
| Animated UI components | `components/<area>/…` (`sections/`, `blog/`, `portfolio/`) as **client** components (`'use client'`) |
| Reduced-motion CSS fallbacks | `app/globals.css` already has `@media (prefers-reduced-motion: reduce)` — JS animations use the `useReducedMotion()` hook (below) |

Rule: **shared variants go in `lib/animations.ts`.** Only define variants inline
when they're truly one-off.

---

## 3. Core patterns

### `motion` components
```tsx
'use client'
import { motion } from 'motion/react'

export function FadeHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="text-3xl font-bold text-[var(--text)]"
    >
      {children}
    </motion.h2>
  )
}
```

### `variants` pattern (prefer this for anything reused)
```tsx
'use client'
import { motion } from 'motion/react'
import { fadeInUp } from '@/lib/animations'

export function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show">
      {children}
    </motion.div>
  )
}
```

### `whileInView` — scroll-triggered reveals
Use the shared `inViewOnce` viewport config (runs once, just before fully in view).
```tsx
'use client'
import { motion } from 'motion/react'
import { staggerContainer, staggerItem, inViewOnce } from '@/lib/animations'

export function CardGrid({ items }: { items: { id: string; title: string }[] }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((it) => (
        <motion.li key={it.id} variants={staggerItem} className="…">
          {it.title}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### Hover / micro-interactions
```tsx
<motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
  …
</motion.a>
```

### `useAnimation` — imperative control (sequences, event-driven)
Use only when declarative props/variants can't express it (e.g. chained steps,
animate in response to a non-render event).
```tsx
'use client'
import { useEffect } from 'react'
import { motion, useAnimate } from 'motion/react'

export function Pulse() {
  const [scope, animate] = useAnimate()
  useEffect(() => {
    animate(scope.current, { scale: [1, 1.05, 1] }, { duration: 0.4, ease: [0.22, 1, 0.36, 1] })
  }, [animate, scope])
  return <motion.div ref={scope}>…</motion.div>
}
```

### `AnimatePresence` — enter/exit
Required for exit animations (e.g. the mobile menu, a modal, a toast). Give each
child a stable `key`.
```tsx
'use client'
import { AnimatePresence, motion } from 'motion/react'

export function Drawer({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="drawer"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          …
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Spring vs duration — **use the right one per animation** (mixed)
- **Spring** (`lib/animations.ts → snappySpring`) for interactive & entrance motion
  that should feel physical: hover lifts, scale-ins, slide-ins, drag.
- **Duration + ease** (`snappy`, ease `[0.22, 1, 0.36, 1]`) for simple fades and
  opacity-only transitions where exact timing matters.
- Keep it **snappy**: durations ~`0.15–0.35s`, stiff springs. This site is
  editorial-minimal — motion should feel quick and purposeful, never floaty.

---

## 4. SVG path animation (`pathLength`) — drawing / tracing

Motion special-cases SVG `pathLength` (0 → 1) and handles `strokeDasharray`/
`strokeDashoffset` for you, so you don't compute path lengths manually. The path
must have a visible `stroke` and `fill="none"`. Use the shared `pathDraw` variant.

```tsx
'use client'
import { motion } from 'motion/react'
import { pathDraw, inViewOnce } from '@/lib/animations'

// A line that draws itself in when scrolled into view.
export function DrawnUnderline() {
  return (
    <motion.svg
      viewBox="0 0 200 20"
      fill="none"
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      className="w-40 h-5"
    >
      <motion.path
        d="M2 12 C 50 2, 150 2, 198 12"
        stroke="#818CF8"   /* accent-text; SVG attrs can't read CSS vars */
        strokeWidth={3}
        strokeLinecap="round"
        variants={pathDraw}
      />
    </motion.svg>
  )
}
```

Notes:
- SVG presentation attributes (`stroke`, `fill`) **cannot use `var(--token)`** —
  set the hex directly (match the design token, e.g. accent `#4F46E5`, accent-text
  `#818CF8`), or drive color with `style={{ stroke: 'var(--accent-text)' }}`.
- For multi-stroke marks (e.g. the 404 glyphs), give each `<motion.path>` the
  `pathDraw` variant inside a parent that orchestrates with `staggerChildren`.

---

## 5. Looping animations

Infinite loops use `repeat: Infinity`. Choose `repeatType`:
`"loop"` (restart), `"reverse"` (yo-yo back), `"mirror"` (yo-yo with eased ends).
Keep loops subtle and **always** disable them under reduced motion (section 7/8).

```tsx
'use client'
import { motion } from 'motion/react'

export function FloatingDot() {
  return (
    <motion.span
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]"
    />
  )
}
```

(The 404 page's bobbing "404" is the CSS-keyframe equivalent of this — both
approaches are fine; reach for Motion when state/orchestration is involved.)

---

## 6. Shared variants (in `lib/animations.ts`)

Import these — don't recreate them:

| Export | Use |
|---|---|
| `fadeIn` | opacity-only fade |
| `fadeInUp` | fade + small upward slide (default reveal) |
| `scaleIn` | fade + slight scale (spring) |
| `staggerContainer` / `staggerItem` | orchestrate a group; `whileInView` the container |
| `pathDraw` | SVG line drawing (`pathLength`) |
| `snappy` / `snappySpring` | transition presets (duration vs spring) |
| `inViewOnce` | `viewport` config for scroll reveals |
| `easeOut` | the project's ease-out curve `[0.22, 1, 0.36, 1]` |

---

## 7. Performance rules

1. **Only animate `transform` and `opacity`.** That means `x`, `y`, `scale`,
   `rotate`, and `opacity` — these are GPU-composited and don't trigger layout.
   **Never** animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
   To move/resize, use `x`/`y`/`scale`. For layout changes use Motion's `layout`
   prop (FLIP) rather than animating dimensions.
2. **`will-change` sparingly.** Motion adds it during animation automatically.
   Don't hand-set `will-change` on many/large elements — it costs memory.
3. **Animate leaf nodes, keep trees shallow**, and prefer `whileInView` with
   `viewport={{ once: true }}` so reveals don't re-run on every scroll.
4. **Respect `prefers-reduced-motion`** (next section) — it's also a perf win.

---

## 8. Accessibility — reduced motion

Default: **respect `prefers-reduced-motion` and render a static/instant state.**
For JS animations use the `useReducedMotion()` hook (mirrors the CSS approach
already in `app/globals.css`).

```tsx
'use client'
import { motion, useReducedMotion } from 'motion/react'
import { fadeInUp } from '@/lib/animations'

export function Reveal({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  // When reduced, skip the animation: render the final state immediately.
  return (
    <motion.div
      variants={fadeInUp}
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? undefined : 'show'}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

- `initial={false}` tells Motion to start in the target state (no entrance).
- For **looping/auto-playing** animations, stop them entirely when `reduce` is
  true (don't just shorten them).
- Decorative motion must never gate access to content — content is fully present
  with motion off.

---

## 9. What NOT to do

- ❌ Import from `framer-motion` — it's **`motion/react`** here.
- ❌ Forget `'use client'` on a file that imports `motion/react` (build/runtime error in App Router).
- ❌ Animate `width`/`height`/`top`/`left`/`margin` — use `transform` (`x`/`y`/`scale`) or the `layout` prop.
- ❌ Ignore `prefers-reduced-motion`, or leave infinite loops running under it.
- ❌ Redefine `fadeInUp`/`stagger`/etc. inline — import from `lib/animations.ts`.
- ❌ Slow, floaty, cinematic timing — keep it snappy (~0.15–0.35s).
- ❌ Put `var(--token)` in SVG presentation attributes — use a hex or `style={{ … }}`.
- ❌ Animate huge subtrees or set `will-change` broadly.

---

## 10. Reference prompt (for future sessions)

```
Before building any animation, read /skills/framer-motion/SKILL.md and follow all patterns and rules documented there.
```
