const skills = [
  'Content Strategy',
  'SEO & Keyword Research',
  'Technical Writing',
  'React & Next.js',
  'Ahrefs / SEMrush / Clearscope',
  'Case Studies',
  'Email Marketing',
  'Landing Page Copy',
  'Social Media Campaigns',
  'Google Analytics',
]

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4F46E5] mb-4">
              About
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-8">
              Developer by background.
              <br />
              Writer by craft.
            </h2>
            <div className="flex flex-col gap-4 text-[#6B7280] text-base leading-relaxed">
              <p>
                I'm Nefe — a content marketer and SEO manager with over four years of experience
                creating content that earns rankings, builds authority, and drives measurable
                business outcomes.
              </p>
              <p>
                My background in software development means I can go deep on technical topics
                without losing the thread — whether I'm writing a tutorial for developers, a
                whitepaper for a CTO, or a newsletter for a fintech product.
              </p>
              <p>
                I've worked with companies like LogRocket, Prismic, AltexSoft, and Dojah, and
                been published in Smashing Magazine. I'm comfortable owning a full content
                strategy or slotting in as a skilled individual contributor.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B7280] mb-6">
              Skills &amp; tools
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm font-medium px-3 py-1.5 border border-[#E5E7EB] text-[#374151] rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-[#E5E7EB]">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6B7280] mb-4">
                Certifications
              </p>
              <p className="text-sm text-[#374151] font-medium">
                Udacity Digital Marketing Nanodegree
              </p>
              <p className="text-xs text-[#6B7280] mt-1">October 2023 – Present</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
