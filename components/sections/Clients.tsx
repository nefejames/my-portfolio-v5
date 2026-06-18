const clients = [
  'LogRocket',
  'Smashing Magazine',
  'Prismic',
  'AltexSoft',
  'Strapi',
  'ButterCMS',
  'Dojah',
  'LoginRadius',
  'Bird Eats Bug',
]

export default function Clients() {
  return (
    <section className="border-y border-[#E5E7EB] py-14">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#6B7280] text-center mb-10">
          Published in
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
          {clients.map((name) => (
            <span
              key={name}
              className="text-base font-semibold text-[#9CA3AF] hover:text-[#4F46E5] transition-colors cursor-default"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
