import Image from 'next/image'

/*
 * Speaker one-sheet — print this page to PDF (Cmd+P) once approved, upload
 * the PDF to the CDN, and switch the /speaking one-sheet CTAs from the
 * request flow to a direct download.
 *
 * DRAFT FOR ZACK'S APPROVAL. Facts sourced from the site and workshop deck;
 * AV needs are marked TODO — do not publish until confirmed.
 */

export const metadata = {
  title: 'Speaker One-Sheet — Zachary Proser',
  robots: { index: false, follow: false },
}

const talks = [
  {
    name: 'DevSecCon Keynote — Modern AI & Security',
    abstract:
      'The conference keynote on modern AI and security — where the real risks and the real gains sit once agents are in the loop.',
  },
  {
    name: 'Skills at Scale',
    abstract:
      'Skill design patterns, cross-agent portability, and team libraries — building production-grade Claude Code skills people actually reuse. Hands-on.',
  },
  {
    name: 'Lifestyles of the AI-Native',
    abstract:
      'One repo, four moves: voice coding, agentic loops and goals, verification gates, scheduled tasks. A live board measures the room’s reclaimed hours and AI-Native score, before and after. Hands-on.',
  },
  {
    name: 'Untethered Productivity',
    abstract:
      'Signal management, context switching, and sustainable agent workflows — the balance between massive AI productivity gains and staying healthy, creative, and sane.',
  },
]

export default function SpeakerOneSheet() {
  return (
    <div className="mx-auto max-w-3xl bg-white text-[#2c3e50] px-10 py-10 print:px-0 print:py-0 font-serif">
      {/* Masthead */}
      <header className="flex items-start justify-between gap-8 border-b-2 border-[#2c3e50] pb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">
            Speaker one-sheet
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mt-2">Zachary Proser</h1>
          <p className="text-[15px] text-[#8b7355] mt-1.5">
            Applied AI, WorkOS · Keynotes &amp; hands-on AI engineering workshops
          </p>
          <p className="text-[14px] mt-3 max-w-[52ch] leading-relaxed">
            <span className="font-semibold">&ldquo;The gold standard for AI Engineer content.&rdquo;</span>{' '}
            — swyx, founder, AI Engineer conferences
          </p>
        </div>
        <div className="relative w-28 h-28 shrink-0 rounded overflow-hidden border border-[#8b7355]/40">
          <Image
            src="https://zackproser.b-cdn.net/images/zack-sketch.webp"
            alt="Zachary Proser"
            fill
            className="object-cover"
          />
        </div>
      </header>

      {/* Bios */}
      <section className="mt-6 grid grid-cols-2 gap-8">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">
            Short bio · read this one
          </h2>
          <p className="text-[13.5px] leading-relaxed mt-2">
            Zack Proser ships AI systems on the Applied AI team at WorkOS, after fourteen
            years as a full-stack engineer in production. He has taught hands-on AI
            engineering workshops at the AI Engineer World&rsquo;s Fair and AI Engineering
            London, keynoted DevSecCon 2025, and writes engineering dispatches read by
            5,000+ engineers.
          </p>
        </div>
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">
            Emcee intro · verbatim
          </h2>
          <p className="text-[13.5px] leading-relaxed mt-2 italic">
            &ldquo;Our next speaker ships AI systems at WorkOS and has spent fourteen years
            writing production code. swyx calls his workshops the gold standard for AI
            Engineer content. He&rsquo;s here to show you what AI-native engineering actually
            looks like — please welcome Zack Proser.&rdquo;
          </p>
        </div>
      </section>

      {/* Talks */}
      <section className="mt-7">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355] border-t border-[#8b7355]/30 pt-4">
          Talks &amp; workshops
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-3">
          {talks.map((talk) => (
            <div key={talk.name}>
              <h3 className="text-[14px] font-bold leading-snug">{talk.name}</h3>
              <p className="text-[12.5px] leading-relaxed text-[#5a5347] mt-1">{talk.abstract}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logistics row */}
      <section className="mt-7 grid grid-cols-3 gap-6 border-t border-[#8b7355]/30 pt-4">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">AV &amp; tech</h2>
          {/* TODO: Zack to confirm AV needs before publishing */}
          <ul className="text-[12.5px] leading-relaxed mt-2 list-none p-0 space-y-1 text-[#5a5347]">
            <li>HDMI/USB-C to projector</li>
            <li>Lavalier or headset mic</li>
            <li>Reliable venue Wi-Fi (live demos)</li>
            <li className="font-mono text-[10px] uppercase tracking-wider text-[#b45309]">TODO: confirm</li>
          </ul>
        </div>
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">Headshots</h2>
          <p className="text-[12.5px] leading-relaxed mt-2 text-[#5a5347]">
            Hi-res headshots and event photography available on request.
          </p>
        </div>
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b7355]">Booking</h2>
          <p className="text-[12.5px] leading-relaxed mt-2 text-[#5a5347]">
            zackproser.com/speaking
            <br />
            zackproser.com/contact
            <br />
            Conference talks: let&rsquo;s talk · Private &amp; corporate: from $7,500
          </p>
        </div>
      </section>

      <footer className="mt-8 border-t-2 border-[#2c3e50] pt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#8b7355] print:mt-6">
        <span>zackproser.com</span>
        <span>Keynotes · Workshops · Enterprise AI enablement</span>
      </footer>
    </div>
  )
}
