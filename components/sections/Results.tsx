const metrics = [
  {
    stat: '+20%',
    label: 'Search traffic growth',
    context: 'Dojah — through keyword strategy and SEO-optimized content',
  },
  {
    stat: '+500%',
    label: 'Subscriber growth',
    context: 'DojahDigest newsletter — combined LinkedIn and email growth',
  },
  {
    stat: '80%+',
    label: 'Keywords improved',
    context: 'Target keywords moved to top rankings within 12 months',
  },
  {
    stat: '10%+',
    label: 'Gated content conversion',
    context: 'Whitepapers and guides converting above industry average',
  },
]

export default function Results() {
  return (
    <section className="py-24 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Results
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-16">
          Content that moves numbers
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m) => (
            <div key={m.stat} className="flex flex-col gap-2">
              <span className="text-5xl font-bold text-[var(--accent-text)]">{m.stat}</span>
              <span className="text-sm font-semibold text-[var(--text)]">{m.label}</span>
              <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">{m.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
