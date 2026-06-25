export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[var(--accent-subtle)]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent-text)] mb-4">
          Get in touch
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-6">
          Let's work together
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-10">
          Open to full-time roles, freelance projects, and long-term content partnerships.
          If you need content that ranks and converts, let's talk.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:nefejames1@gmail.com"
            className="px-8 py-3 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            nefejames1@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/nefe-emadamerho-atori"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-[var(--accent-text)] text-[var(--accent-text)] text-sm font-medium rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
