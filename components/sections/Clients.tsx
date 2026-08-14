import { CLIENTS, clientLogo } from '@/lib/clients'

export default function Clients() {
  return (
    <section className="pb-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          {CLIENTS.map(({ slug, name }) => {
            const logo = clientLogo(slug)
            return logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slug}
                src={logo}
                alt={name}
                className="h-7 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
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
