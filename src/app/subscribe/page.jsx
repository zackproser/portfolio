'use client'

import Image from 'next/image'
import Newsletter from '@/components/Newsletter'

const logoCloudflare = 'https://zackproser.b-cdn.net/images/logos/cloudflare.svg'
const logoGruntwork = 'https://zackproser.b-cdn.net/images/logos/terragrunt.svg'
const logoPinecone = 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.webp'

export default function SubscribePage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-800 dark:to-blue-900" aria-labelledby="subscribe-hero-title">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 id="subscribe-hero-title" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-50 dark:text-blue-100">
                Join 2,500+ Engineers Shipping Real AI Systems
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100/90">
                Get the free hands-on tutorial: Build a &quot;Chat with My Data&quot; app with LangChain, Pinecone, OpenAI and the Vercel AI SDK — plus weekly code-first AI engineering tips.
              </p>

              <div className="mt-8 max-w-xl mx-auto">
                <Newsletter
                  title="Get the free tutorial + weekly tips"
                  body="No fluff. Production-proven patterns for RAG, evals, infra, and delivery."
                  successMessage="Neural Network Activated! 🤖🧠❗ You're in — check your inbox."
                  position="subscribe-hero"
                  tags={['subscribe', 'hero']}
                  className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-lg ring-1 ring-zinc-900/10 dark:ring-white/10"
                />
                <p className="mt-3 text-xs text-white/80">
                  1–2 emails/week. No spam. Unsubscribe anytime.
                </p>
              </div>

              <div className="mt-10">
                <p className="text-sm text-white/80 uppercase font-medium mb-3">Trusted by industry leaders</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-auto flex items-center justify-center">
                      <Image
                        src={logoCloudflare}
                        alt="Cloudflare"
                        height={20}
                        width={80}
                        className="brightness-0 invert"
                      />
                    </div>
                    <span className="text-sm font-medium text-white mt-2">Cloudflare</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-auto flex items-center justify-center">
                      <Image
                        src={logoGruntwork}
                        alt="Gruntwork"
                        height={16}
                        width={60}
                        className="brightness-0 invert scale-75"
                      />
                    </div>
                    <span className="text-sm font-medium text-white mt-2">Gruntwork</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-auto flex items-center justify-center">
                      <Image
                        src={logoPinecone}
                        alt="Pinecone"
                        height={20}
                        width={80}
                        className="brightness-0 invert"
                      />
                    </div>
                    <span className="text-sm font-medium text-white mt-2">Pinecone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
