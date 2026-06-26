import { CLIENTS, clientLogo } from '@/lib/clients'

export default function Clients() {
  return (
    <section className="border-y border-[var(--border)] py-14">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[var(--muted)] text-center mb-10">
          Brands I&apos;ve worked for
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          {CLIENTS.map(({ slug, name }) => {
            const logo = clientLogo(slug)
            return logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slug}
                src={logo}
                alt={name}
                className="h-7 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ) : (
              <span
                key={slug}
                className="text-base font-semibold text-[var(--faint)] hover:text-[var(--accent-text)] transition-colors cursor-default"
              >
                {name}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
