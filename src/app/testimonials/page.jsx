import Image from 'next/image'
import Link from 'next/link'
import { generateOgUrl } from '@/utils/ogUrl'

const img = {
  jim: 'https://zackproser.b-cdn.net/images/jim-brikman.webp',
  john: 'https://zackproser.b-cdn.net/images/john-funge.webp',
  sachin: 'https://zackproser.b-cdn.net/images/sachin-fernandes.webp',
  philina: 'https://zackproser.b-cdn.net/images/philina.webp',
  leo: 'https://zackproser.b-cdn.net/images/leo-scott.webp',
  joery: 'https://zackproser.b-cdn.net/images/joery.webp',
  evelyn: 'https://zackproser.b-cdn.net/images/evelyn-tam.webp',
  venkat: 'https://zackproser.b-cdn.net/images/venkat.webp',
  george: 'https://zackproser.b-cdn.net/images/george.webp',
  steven: 'https://zackproser.b-cdn.net/images/steven-fusco.webp',
  tomL: 'https://zackproser.b-cdn.net/images/tom-luechtefeld.webp',
  tomLand: 'https://zackproser.b-cdn.net/images/tom-landesman.webp',
  christian: 'https://zackproser.b-cdn.net/images/christian-paulus.webp',
  anthony: 'https://zackproser.b-cdn.net/images/anthony-davanzo.webp',
}

const data = {
  title: 'Testimonials — Zachary Proser',
  description: 'Fourteen on the record — engineers, PMs, designers, CEOs, professors — on what it is like to work with Zachary Proser.',
}

const ogUrl = generateOgUrl(data)

export const metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: 'https://zackproser.com/testimonials' },
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Modern Coding',
    images: [{ url: ogUrl }],
    locale: 'en_US',
    type: 'website',
  },
}

const featured = {
  quote: 'When I ran your software, I felt joy.',
  name: 'Jim Brikman',
  role: 'Co-founder of Gruntwork, OpenTofu · Author, Terraform Up & Running',
  roleEm: 'Terraform Up & Running',
  monogram: 'JB',
  image: img.jim,
}

const testimonials = [
  {
    id: 1, size: 'lg', kind: 'Engineering', company: 'Cloudflare',
    name: 'Sachin Fernandes', role: 'Technical Lead at Cloudflare', monogram: 'SF', image: img.sachin,
    body: "I have worked with Zack on multiple projects. Every one of these encounters with him has not only made me a better engineer, but a better person. He is a brilliant engineer who truly cares about his code and the people who use it. He has the remarkable ability to pick apart hard problems (technical or otherwise) and put together a solution that benefits everyone. He is articulate, thoughtful, kind and exceptionally intelligent. Zack is also one of the only people I have ever met to have a real world implementation of an AI bot. His talents are as rare as they get and I unequivocally recommend him.",
  },
  {
    id: 2, size: 'default', kind: 'Leadership', company: 'DataTribe',
    name: 'John Funge', role: 'Chief Product Officer at DataTribe', monogram: 'JF', image: img.john,
    body: "Zack is very resourceful, entrepreneurial and scrappy. He'll figure out a way of getting whatever it is done. As well as technical skills, Zack is rounded. He can write and he has broad interests — such as visual arts. Zack has a lot of initiative and will proactively take action when he sees something that needs to be done. I'd be remiss if I didn't mention Zack's work ethic. He never shied away from our demanding hours and would regularly spend the little after-work time he had deepening his technical skills. Lastly, Zack has a great sense of humor and is one of those folks that just makes work more fun. He's someone you want on your team.",
  },
  {
    id: 3, size: 'sm', kind: 'Engineering', company: 'Kryptowire',
    name: 'Steven Fusco', role: 'Senior Engineering Manager at Kryptowire', monogram: 'SF', image: img.steven,
    body: 'Zack is a great addition to any development team. He thinks fast, adapts to shifting requirements, and has proven he can quickly ramp up on the latest technologies to put them to good use.',
  },
  {
    id: 4, size: 'default', kind: 'Data / ML', company: 'Proofpoint',
    name: 'Tom Landesman', role: 'Staff Data Scientist at Proofpoint', monogram: 'TL', image: img.tomLand,
    body: "Take a look at the span of job titles, levels of seniority, and teams reflected in Zack's other recommendations. It's clear Zack brings the same level of near-crazy passion and dedication from his art to every aspect of his professional work. Whether it was cross-team collaboration, picking up a new technology, or complex problem solving, Zack excelled without skipping a beat. From my view, Zack's most impressive, and all-too-rare, trait is deep introspection. Given a problematic shortcoming or knowledge gap, he wields this introspection to quickly diagnose and navigate past situations that would pose as major hurdles to most people. Teapot approved, A+.",
  },
  {
    id: 5, size: 'sm', kind: 'Marketing', company: 'MariaDB',
    name: 'Evelyn Tam', role: 'Senior Communications Manager at MariaDB', monogram: 'ET', image: img.evelyn,
    body: 'Having a dedicated developer for a Marketing team is hard to come by, especially if they are a good one. Working with Zack at Cloudmark was the best. He always had a collaborative, team player mentality and exceeded expectations on all assigned projects, even those that required a quick turnaround. More importantly, Zack had great communications skills — from proactively providing a project status to any red flags during initial conversations. I would work with Zack again in a heartbeat.',
  },
  {
    id: 6, size: 'lg', kind: 'Marketing × Eng', company: 'HashiCorp',
    name: 'Anthony Davanzo', role: 'Technical Product Marketing Manager at HashiCorp', monogram: 'AD', image: img.anthony,
    body: "Zack is exactly the type of engineer you want on your team. He's smart, collaborative, and tremendously effective. Zack and I worked together building tools and websites to drive revenue and customer success. When challenging ideas were presented, Zack would jump at the opportunity to learn without any hint of hesitation to take on difficulty. Personally, he's kind, willing to help, and keeps a good sense of humor.",
  },
  {
    id: 7, size: 'default', kind: 'Design', company: 'Asana',
    name: 'Philina Fan', role: 'Product Designer at Asana', monogram: 'PF', image: img.philina,
    body: 'In my nearly two years at Cloudflare, I have had the pleasure of working closely with Zack. He is one of the most hardworking and self-motivated individuals I have ever met. He constantly does outstanding work and will go above and beyond on any project that he is part of. He has also always been a kind and patient teacher to me, whenever I had any inquiries about implementation. He is someone I would highly recommend for any future opportunities as he would be a valuable asset to any team he joins.',
  },
  {
    id: 8, size: 'sm', kind: 'Research', company: 'Insilica',
    name: 'Tom Luechtefeld', role: 'CEO at Insilica', monogram: 'TL', image: img.tomL,
    body: 'Zack helped us build web applications for our cancer clinical trial research studies. He was a pleasure to work with, I frequently come back to ask his advice on our other web development projects. If you have an opportunity to work with Zack you should take it.',
  },
  {
    id: 9, size: 'default', kind: 'Product', company: 'Cohesity',
    name: 'Christian Paulus', role: 'VP Product Marketing at Cohesity', monogram: 'CP', image: img.christian,
    body: 'I worked closely with Zack at Cloudflare. Zack was clearly the most talented, skilled and hard working developer in his team. I frequently tapped his brain for technical questions and he was always there to help. He is a true pleasure to work with and I can highly recommend him.',
  },
  {
    id: 10, size: 'sm', kind: 'Leadership', company: 'DataTribe',
    name: 'Leo Scott', role: 'Chief Innovation Officer at DataTribe', monogram: 'LS', image: img.leo,
    body: "Zack is an all-round business athlete. Whether he's helping to brainstorm viral marketing strategies or working on your development team he's going to provide a ton of value. He's a fast learner and a hard worker, and is fun to work with.",
  },
  {
    id: 11, size: 'default', kind: 'PM', company: 'Cloudflare',
    name: 'Joery van Druten', role: 'Project Manager at Cloudflare', monogram: 'JD', image: img.joery,
    body: 'I had the pleasure to work with Zack on several platform and web-services projects. Zack is extremely self-driven, coachable and always has the intention to move forward seeking to improve. He is very detail oriented and will not stop until he delivered what was asked for. He is very knowledgeable and has the patience to explain technical challenges to non-technical co-workers and stakeholders in such a way that they understand what is going on. Zack moved on to a different team where there is more room for him to grow and I have no doubt that he will succeed there as well. I would definitely recommend Zack to any team or company and if there is an opportunity, I would love to work with him again.',
  },
  {
    id: 12, size: 'sm', kind: 'Product', company: 'Okta',
    name: 'Venkat Viswanathan', role: 'Group Product Manager at Okta', monogram: 'VV', image: img.venkat,
    body: 'I had the opportunity to work with Zack at Cloudflare. Zack is very hard working and self motivated. Whenever he is given a new task he puts in the effort to learn and successfully complete it. But the most important quality I admire is he makes sure he shares that knowledge with everyone and always willing to help. Zack is amazing to work with and a great asset to the team.',
  },
  {
    id: 13, size: 'default', kind: 'Executive', company: 'Cloudmark',
    name: 'George Riedel', role: 'CEO at Cloudmark · Professor at Harvard Business School', monogram: 'GR', image: img.george,
    body: 'Zack was an amazing contributor on the UX frontend for a new product we were launching. It was both a new market (Enterprise) and a new product (Spear phishing). As a result — it required a fair amount of intuitive design experience and iterative patience. Zack and his colleagues were instrumental in getting early versions of the UX built and adapting it as we developed insights into both how the user might experience things AND how the technology would interpret things. A very strong contributor to a new initiative and a dynamic environment.',
  },
]

const trustedCompanies = [
  'Cloudflare', 'HashiCorp', 'Okta', 'Asana',
  'Cohesity', 'Proofpoint', 'MariaDB',
]

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function TestimonialsPage() {
  return (
    <div className="testimonials-page editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400 pt-6">
            <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <span>Testimonials</span>
          </div>
        </div>

        {/* Monument Hero */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="t-kicker">
              § T · <em>Testimonials</em> · What it&apos;s like to work with me
            </div>

            <div className="mt-2 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <p className="monument-quote">
                  When I ran your s<span className="monument-mark">o</span>ftware, I felt j<span className="monument-mark">o</span>y.
                </p>
                <div className="monument-meta">
                  <span>14 testimonials · 2014 – present</span>
                  <span className="stars">★ ★ ★ ★ ★</span>
                </div>
              </div>

              <div>
                <div className="a-plate">
                  <span className="monogram">{featured.monogram}</span>
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 180px"
                    priority
                  />
                </div>
                <div className="a-name">{featured.name}</div>
                <div className="a-role">
                  Co-founder of Gruntwork, OpenTofu · Author,{' '}
                  <em className="italic">Terraform Up &amp; Running</em>
                </div>
              </div>
            </div>

            {/* Stat slab */}
            <dl className="editorial-stats text-charcoal-50 dark:text-parchment-100 mt-14">
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  14<span className="unit">on record</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Testimonials
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  12<span className="unit">cos</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Incl. Cloudflare, HashiCorp, Okta
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  11<span className="unit">years</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Span of record
                </div>
              </div>
              <div className="editorial-stat">
                <div className="editorial-stat-num">
                  5.0<span className="unit">★ ★ ★ ★ ★</span>
                </div>
                <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                  Average
                </div>
              </div>
            </dl>
          </div>
        </section>

        {/* Section head */}
        <section className="pt-10 pb-2 border-t border-parchment-300 dark:border-slate-700">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <header className="t-section-head">
              <div className="num">§ 01</div>
              <h2>From colleagues, clients and collaborators.</h2>
              <span className="more">A01 — A{pad(testimonials.length)}</span>
            </header>
          </div>
        </section>

        {/* Masonry grid of remaining testimonials */}
        <section className="pt-2 pb-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="news-grid">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className={`news-card ${
                    t.size === 'lg' ? 'size-lg' : t.size === 'sm' ? 'size-sm' : ''
                  }`}
                >
                  <p className="excerpt">{t.body}</p>
                  <div className="attr">
                    <div className="plate">
                      <span>{t.monogram}</span>
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        sizes="44px"
                      />
                    </div>
                    <div className="who">
                      <div className="name">{t.name}</div>
                      <div className="role">{t.role}</div>
                    </div>
                  </div>
                  <div className="ref">
                    <span>A.{pad(t.id)} · {t.kind}</span>
                    <span>{t.company}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trusted-by strip */}
        <section className="trusted">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="trusted-label">
              Clients, colleagues &amp; collaborators have included
            </div>
            <div className="trusted-row">
              {trustedCompanies.map((co) => (
                <div key={co} className="co">{co}</div>
              ))}
              <div className="co">
                <em>Harvard</em>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="t-cta">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="t-cta-inner">
              <div>
                <h2>
                  Want a letter like one of these to write itself about your project?
                </h2>
                <p>
                  I take a small number of consulting and workshop engagements each
                  quarter — applied AI, engineering leadership, product-minded
                  infrastructure. If the quotes above sound like the teammate or
                  collaborator you&apos;re missing, let&apos;s talk.
                </p>
              </div>
              <div className="t-cta-actions">
                <Link href="/contact" className="t-cta-row">
                  <div>
                    <div className="label">Book a consulting call →</div>
                    <div className="sub">30-min intro · usually same-week</div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 whitespace-nowrap">
                    Schedule
                  </span>
                </Link>
                <Link href="/speaking" className="t-cta-row">
                  <div>
                    <div className="label">Run a workshop for your team →</div>
                    <div className="sub">Half-day or multi-day · on-site or remote</div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 whitespace-nowrap">
                    Inquire
                  </span>
                </Link>
                <Link href="/newsletter" className="t-cta-row">
                  <div>
                    <div className="label">Subscribe to Modern Coding ↗</div>
                    <div className="sub">Monthly applied-AI essay · read by 5,000+ engineers</div>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 whitespace-nowrap">
                    Subscribe
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
