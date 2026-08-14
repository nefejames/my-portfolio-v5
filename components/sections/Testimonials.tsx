const testimonials: {
  name: string
  role: string
  quote: string
  initials: string
  photo?: string
}[] = [
  {
    name: 'Anton Borysov',
    role: 'Marketing Director, AltexSoft',
    initials: 'AB',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/anton.jpeg',
    quote:
      'Nefe is an excellent technical copywriter. On my team at AltexSoft, he consistently translated complex engineering topics — like AI systems and legacy modernization — into clear, accurate articles for senior technical audiences. Because he has a strong grasp of software development, his work is always technically precise. He required minimal oversight and reliably delivered well-researched, ready-to-publish content. Nefe would be a strong, practical asset to any marketing team that needs to communicate effectively with developers and engineering leaders.',
  },
  {
    name: 'Liudmyla Semyvolos',
    role: 'IT Journalist & Editor, AltexSoft',
    initials: 'LS',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/liudmyla.jpeg',
    quote:
      'I worked with Nefe as his editor for two years. During this time, I saw him grow into a strong professional who can independently produce thoughtful, in-depth articles on highly technical subjects. As an editor, I was especially impressed by his ability to learn quickly, his productivity, and his reliability with deadlines. I sincerely recommend him as an experienced IT journalist who can turn complex technical ideas into clear, accessible, and engaging content.',
  },
  {
    name: 'Oleksandr Kolisnykov',
    role: 'Content Strategist, AltexSoft',
    initials: 'OK',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/oleksandr.jpeg',
    quote:
      'I loved working with Nefe! He was able to take complex, unfamiliar topics and turn them into clear, useful explanations without losing their substance. If he was covering a product or platform, he would actually test it himself — sometimes even building a small prototype — so his writing was based on real understanding rather than surface-level research. Nefe is disciplined, reliable, and great with deadlines. I\'d happily recommend him for both writing and strategic marketing roles.',
  },
  {
    name: 'Linda Nguyen',
    role: 'Creative Copywriter, AltexSoft',
    initials: 'LN',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/linda.png',
    quote:
      'I\'ve worked with Nefe for over two years, and he is one of those people who can make even the most complex technical topics accessible and engaging. The best way to appreciate his work is to read a few of his articles yourself — they\'re exceptionally well researched, thoughtfully structured, and often go much deeper than the average technical content you\'ll find online. Just as importantly, Nefe is a great teammate. Any team would benefit from both his expertise and his professionalism.',
  },
  {
    name: 'Lea Thomas',
    role: 'Founder, AI Development Systems',
    initials: 'LT',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/lea.jpeg',
    quote:
      'Nefe embodies professionalism and would be an asset to any company. The quality of his work speaks for itself. His technical articles were frequently top traffic drivers. I appreciated being able to trust that he\'d always deliver ahead of schedule and give his best. I truly hope to work with him again in the future.',
  },
  {
    name: 'Grace Miller',
    role: 'Freelance Client, Prismic',
    initials: 'GM',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/grace%20miller.jpeg',
    quote:
      'As a freelance technical writer for Prismic\'s blog, Nefe has been an outstanding contributor. He\'s not only reliable and timely with his work, but he\'s also great to work with. He implements feedback well and applies SEO practices that go above and beyond expectations. His research and content are always thorough, high-quality, and well-composed. If you\'re looking for a freelancer to work with, you\'ll be lucky to work with Nefe.',
  },
  {
    name: 'Hanna Filatova',
    role: 'L&D Manager, AltexSoft',
    initials: 'HF',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/hanna.jpeg',
    quote:
      'I had the pleasure of working with Nefe for 2 years and can confidently say he is an outstanding technical writer. He consistently turns complex topics into clear, engaging articles that resonate with both technical and non-technical audiences. Nefe has mastered the art of visualizing intricate concepts and explaining them through practical, well-chosen examples that make the material immediately actionable.',
  },
  {
    name: 'Olga Pereverzieva',
    role: 'Tech Journalist, AltexSoft',
    initials: 'OP',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/olga.jpeg',
    quote:
      'I had the pleasure of working with Nefe and found him to be consistently friendly, professional, and eager to learn. He approaches new challenges with curiosity and a positive attitude, always looking for opportunities to expand his knowledge and improve his skills. Nefe is reliable, easy to work with, and communicates well with colleagues. I am confident he will be a valuable asset to any team.',
  },
  {
    name: 'Success Eriamiantoe',
    role: 'Technical Writer, Hackmamba',
    initials: 'SE',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/success.jpeg',
    quote:
      'I highly recommend Nefe as a technical writer and content writer. I have enjoyed working with him at Hackmamba for over a year and have been consistently impressed with his exceptional skills and dedication. His ability to communicate complex technical concepts and produce high-quality content is commendable. He is a reliable team player who consistently meets deadlines and exceeds expectations.',
  },
  {
    name: 'Divine Orji',
    role: 'Software Engineer & Creator',
    initials: 'DO',
    photo: 'https://hdfqv9nqsbc5flin.public.blob.vercel-storage.com/testimonials/divine.png',
    quote:
      'Nefe is very good at research and brainstorming topics that will resonate with the current questions developers are asking. It\'s always a pleasure working on projects with him.',
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
          Letters of love from people I&apos;ve worked for and with
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
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.photo}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-text)] text-sm font-semibold flex items-center justify-center shrink-0">
                      {t.initials}
                    </div>
                  )}
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
