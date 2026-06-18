export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#EEF2FF]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
          Get in touch
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">
          Let's work together
        </h2>
        <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-10">
          Open to full-time roles, freelance projects, and long-term content partnerships.
          If you need content that ranks and converts, let's talk.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="mailto:nefejames1@gmail.com"
            className="px-8 py-3 bg-[#4F46E5] text-white text-sm font-medium rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            nefejames1@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/nefe-emadamerho-atori"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 border border-[#C7D2FE] text-[#4F46E5] text-sm font-medium rounded-lg hover:bg-white transition-colors"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </section>
  )
}
