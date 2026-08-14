const testimonials: {
  name: string
  role: string
  quote: string
  initials: string
}[] = [
  {
    name: 'Placeholder Name',
    role: 'Role, Company',
    initials: 'PN',
    quote:
      'Testimonial quote goes here. Replace this with the actual testimonial text once collected.',
  },
  {
    name: 'Placeholder Name',
    role: 'Role, Company',
    initials: 'PN',
    quote:
      'Testimonial quote goes here. Replace this with the actual testimonial text once collected.',
  },
  {
    name: 'Placeholder Name',
    role: 'Role, Company',
    initials: 'PN',
    quote:
      'Testimonial quote goes here. Replace this with the actual testimonial text once collected.',
  },
  {
    name: 'Placeholder Name',
    role: 'Role, Company',
    initials: 'PN',
    quote:
      'Testimonial quote goes here. Replace this with the actual testimonial text once collected.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-16">
          What clients say
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8"
            >
              {/* Top row: identity left, quote mark right */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] text-sm font-semibold flex items-center justify-center shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)] leading-tight">
                      {t.name}
                    </p>
                    <p className="text-xs font-medium tracking-widest uppercase text-[var(--muted)] mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
                <span className="text-4xl font-serif leading-none text-[var(--accent-text)] opacity-60 shrink-0 select-none">
                  &ldquo;
                </span>
              </div>

              {/* Quote body */}
              <p className="text-[var(--muted)] leading-relaxed text-sm">
                {t.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
