import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Code, Database, Server, Zap, CheckCircle2, Github } from "lucide-react"
import TestimonialCarousel from "@/components/testimonial-carousel"
import ProcessTimeline from "@/components/process-timeline"
import TechStack from "@/components/tech-stack"
import EngineeringAnimation from "@/components/engineering-animation"
import ServiceCard from "@/components/ServiceCard"
import CV from "@/components/CV"
import RandomPortrait from "@/components/RandomPortrait"
import NumYearsExperience from "@/components/NumYearsExperience"
import Image from "next/image"
import Link from "next/link"

// Import logos
import logoCloudflare from '@/images/logos/cloudflare.svg'
// import logoGrunty from '@/images/logos/grunty.webp'
import logoPinecone from '@/images/logos/pinecone-logo.webp'
import logoWorkOS from '@/images/logos/workos.svg'

// Import case study images
import legalSemanticSearchImg from '@/images/legal-semantic-search.webp'
import pineconeRefArchImg from '@/images/pinecone-refarch-logo.webp'
import pineconeAssistantImg from '@/images/pinecone-assistant.webp'
import officeOracleImg from '@/images/office-oracle-screenshot.webp'

export const metadata: Metadata = {
  title: "AI Engineering Services | Next.js & Vector Database Expert",
  description: "Specialized AI engineering services for Next.js applications with vector database integration and production infrastructure as code.",
  openGraph: {
    title: "AI Engineering Services | Next.js & Vector Database Expert",
    description: "Specialized AI engineering services for Next.js applications with vector database integration and production infrastructure as code.",
    images: [{ url: "/og-services.png" }],
  },
}

export default function ServicesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-blue-600 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full bg-blue-700 dark:bg-zinc-950 py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-zinc-50 leading-tight">
              I build <span className="text-[#7cc2ff] font-extrabold relative">production-ready<span className="absolute -bottom-2 left-0 w-full h-1 bg-[#7cc2ff]/50 rounded-full"></span></span> AI apps. You launch faster.
            </h1>

            {/* Animation directly under the header */}
            <div className="py-8">
              <div className="mx-auto w-64 h-64 md:w-80 md:h-80 relative">
                <div className="w-full h-full overflow-hidden rounded-full bg-white dark:bg-transparent shadow-xl">
                  <EngineeringAnimation />
                </div>
              </div>
            </div>

            <p className="text-xl text-white dark:text-zinc-300 max-w-2xl mx-auto">
              <span className="inline-flex items-center">
                <span className="text-[#7cc2ff] font-bold text-3xl mr-1">3+</span> 
                years building production AI solutions and vector database integrations.
              </span>
              <span className="block mt-2">
                <span className="text-[#7cc2ff] font-bold text-3xl mr-1">13+</span> 
                years of professional engineering experience.
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-white hover:bg-white/90 text-blue-700">
                <Link href="/calculator">
                  Calculate Your Project Cost
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Schedule a Strategy Call
              </Button>
            </div>
            <p className="text-xl text-white dark:text-zinc-300 max-w-2xl mx-auto mt-4">
              Ready to elevate your product with AI? Let&apos;s chat.
            </p>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-10 px-4 md:px-6 lg:px-8 bg-blue-800 dark:bg-zinc-950 border-t border-b border-blue-700 dark:border-zinc-800">
        <div className="container mx-auto">
          <p className="text-center text-sm text-white font-medium dark:text-zinc-400 mb-8">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoCloudflare}
                  alt="Cloudflare"
                  width={40}
                  height={15}
                  className="opacity-90 hover:opacity-100 transition-opacity brightness-0 invert"
                />
              </div>
              <span className="text-base font-medium text-white dark:text-zinc-100 mt-2">Cloudflare</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src="/images/logos/terragrunt.svg"
                  alt="Gruntwork"
                  width={40}
                  height={15}
                  className="opacity-90 hover:opacity-100 transition-opacity brightness-0 invert"
                />
              </div>
              <span className="text-base font-medium text-white dark:text-zinc-100 mt-2">Gruntwork</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoWorkOS}
                  alt="WorkOS"
                  width={40}
                  height={15}
                  className="opacity-90 hover:opacity-100 transition-opacity brightness-0 invert"
                />
              </div>
              <span className="text-base font-medium text-white dark:text-zinc-100 mt-2">WorkOS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoPinecone}
                  alt="Pinecone"
                  width={40}
                  height={15}
                  className="opacity-90 hover:opacity-100 transition-opacity brightness-0 invert dark:brightness-200 dark:contrast-125"
                />
              </div>
              <span className="text-base font-medium text-white dark:text-zinc-100 mt-2">Pinecone</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-zinc-50">Specialized AI Engineering Services</h2>
            <p className="text-lg text-white dark:text-zinc-400 max-w-2xl mx-auto">
              Now exclusively offering high-impact, project-based engagements — no hourly development work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<Code className="h-10 w-10" />}
              title="Custom Next.js + Vercel AI Solutions"
              description="Deliver fast, scalable AI-driven apps built with Next.js on Vercel using the AI SDK for real-time inference."
            />
            <ServiceCard
              icon={<Database className="h-10 w-10" />}
              title="Production-Ready Vector Database Integration"
              description="Expert implementation of Pinecone, Weaviate, and other vector databases for enterprise-grade semantic search."
            />
            <ServiceCard
              icon={<Zap className="h-10 w-10" />}
              title="Retrieval-Augmented Generation with LLMs"
              description="Build sophisticated RAG systems that combine the power of LLMs with your proprietary data for accurate, contextual responses."
            />
            <ServiceCard
              icon={<Server className="h-10 w-10" />}
              title="Infrastructure as Code for AI"
              description="Scalable, reliable AI infrastructure using AWS, Terraform, and modern DevOps practices for production deployments."
            />
          </div>

          <div className="mt-16 p-6 bg-blue-700 dark:bg-blue-800 rounded-lg backdrop-blur-sm border border-blue-500 dark:border-blue-700">
            <h3 className="text-xl font-semibold mb-3 text-white dark:text-white">Trust & Experience</h3>
            <p className="text-white dark:text-white/80">
              As a former staff-level developer advocate at Pinecone, I built their first AWS-based production example
              that&apos;s now used as a reference architecture. With years of end-to-end experience in AI model integration,
              vector database hosting, and infrastructure as code, I bring rare expertise to your project.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio/Experience Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-zinc-50">Portfolio Highlights</h2>
          <p className="text-lg text-white dark:text-zinc-400 max-w-3xl mb-12">
            Selected projects showcasing my expertise in AI engineering and vector database integration.
          </p>

          <Tabs defaultValue="case-studies" className="w-full">
            <TabsList className="mb-8 bg-blue-800/50 dark:bg-zinc-800">
              <TabsTrigger value="case-studies" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white text-white dark:text-zinc-400">
                Case Studies
              </TabsTrigger>
              <TabsTrigger value="tech-stack" className="data-[state=active]:bg-white data-[state=active]:text-blue-700 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white text-white dark:text-zinc-400">
                Technology Stack
              </TabsTrigger>
            </TabsList>
            <TabsContent value="case-studies">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-zinc-100 dark:bg-blue-800 border-zinc-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Legal Semantic Search Application</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">Fortune 500 Client (NDA)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Image
                        src={legalSemanticSearchImg}
                        alt="Legal Semantic Search"
                        width={500}
                        height={300}
                        className="rounded-md"
                      />
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                      <li>Built an AI-powered legal document search system</li>
                      <li>Reduced research time by 70% for legal team</li>
                      <li>Leverages semantic search across case files</li>
                      <li>Deployed on Vercel with Next.js and Pinecone</li>
                    </ul>
                    <div className="mt-4">
                      <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        <Link href="https://docs.pinecone.io/examples/sample-apps/legal-semantic-search" target="_blank" rel="noopener noreferrer">
                          View Sample App
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-100 dark:bg-blue-800 border-zinc-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Pinecone AWS Reference Architecture</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">Official Reference Architecture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Image
                        src={pineconeRefArchImg}
                        alt="Pinecone Reference Architecture"
                        width={500}
                        height={300}
                        className="rounded-md"
                      />
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                      <li>Developed production-ready integration between AWS and Pinecone</li>
                      <li>Now used as official reference architecture</li>
                      <li>Implemented IaC with Terraform for reproducibility</li>
                      <li>Created comprehensive documentation and tutorials</li>
                    </ul>
                    <div className="mt-4">
                      <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        <Link href="https://github.com/pinecone-io/aws-reference-architecture-pulumi" target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View on GitHub
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-100 dark:bg-blue-800 border-zinc-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Pinecone Assistant Sample App</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">Technical Publication</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Image
                        src={pineconeAssistantImg}
                        alt="Pinecone Assistant"
                        width={500}
                        height={300}
                        className="rounded-md"
                      />
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                      <li>The official Pinecone Assistant frontend client and Next.js template</li>
                      <li>Implemented vector search with Pinecone</li>
                      <li>Built with Next.js and React</li>
                      <li>Used by thousands of developers worldwide</li>
                    </ul>
                    <div className="mt-4">
                      <Button asChild size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                        <Link href="https://docs.pinecone.io/examples/sample-apps/pinecone-assistant" target="_blank" rel="noopener noreferrer">
                          View Sample App
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-100 dark:bg-blue-800 border-zinc-200 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-zinc-900 dark:text-zinc-50">Office Oracle - RAG Chatbot</CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">Personal Project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Image
                        src={officeOracleImg}
                        alt="Office Oracle"
                        width={500}
                        height={300}
                        className="rounded-md"
                      />
                    </div>
                    <ul className="space-y-2 list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                      <li>Built a RAG chatbot trained on The Office TV series</li>
                      <li>Implemented vector search database</li>
                      <li>Created with Next.js and OpenAI</li>
                      <li>Demonstrates context-aware responses and character mimicry</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  <Link href="/projects">
                    See more of my projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="tech-stack">
              <TechStack />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Work History and Profile */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-900">
        <div className="container mx-auto">
          {/* About Me Section - Now First */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white dark:text-zinc-50">About Me</h2>
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              <div className="w-48 h-48 mb-8">
                <RandomPortrait width={192} height={192} />
              </div>
              <p className="text-lg text-white dark:text-zinc-300 text-center max-w-2xl">
                I combine deep technical knowledge with practical experience to deliver 
                solutions that are both innovative and production-ready.
              </p>
              <p className="text-lg text-white dark:text-zinc-300 text-center max-w-2xl mt-4">
                My background spans from large enterprise systems to startup environments, giving me
                a unique perspective on what works at different scales. 
                <br /><br />
                As a full stack open source 
                developer with over <NumYearsExperience /> years of experience, I&apos;ve contributed to 
                various projects that improve developer workflows and system architectures.
              </p>
              <div className="mt-6">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  <Link href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">
                    Check out my GitHub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Professional Experience Section - Now Second */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white dark:text-zinc-50">Professional Experience</h2>
            <div className="max-w-3xl mx-auto bg-zinc-100 dark:bg-blue-800 rounded-xl p-6 md:p-8 shadow-lg">
              <CV />
              <div className="flex flex-wrap justify-center mt-8 gap-4">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  <Link href="/publications">
                    Read my publications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white/90">
                  <Link href="/blog">
                    Read my research
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-zinc-50">Why Work With Me</h2>
            <p className="text-lg text-white dark:text-zinc-400 max-w-2xl mx-auto">
              Specialized expertise in a rapidly evolving field where experience matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white dark:text-zinc-50">Expertise & Specialization</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="text-white dark:text-zinc-50">Laser-Focused Expertise:</strong>
                    <p className="text-white dark:text-zinc-300">
                      Specialized in Next.js + Vercel + AI with a multi-year track record in a space where many are just
                      getting started.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="text-white dark:text-zinc-50">Production-Scale Experience:</strong>
                    <p className="text-white dark:text-zinc-300">
                      Background in building systems that handle real-world scale, reliability, and performance
                      requirements.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <strong className="text-white dark:text-zinc-50">End-to-End Knowledge:</strong>
                    <p className="text-white dark:text-zinc-300">
                      Rare combination of AI model expertise, vector database implementation, and infrastructure as code
                      skills.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-white dark:text-zinc-50">My Process</h3>
              <div className="bg-zinc-100 dark:bg-blue-800 p-6 rounded-xl">
                <ProcessTimeline />
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-zinc-100 dark:bg-blue-800 rounded-lg backdrop-blur-sm border border-zinc-200 dark:border-blue-700">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Project Minimums & Rates</h3>
            <p className="text-zinc-700 dark:text-white/80 mb-4">
              I exclusively take on high-impact projects with a minimum engagement of $20,000. I require 50% payment up front 
              to begin work, with the remaining 50% due upon delivery. This ensures I can deliver the quality and attention 
              your project deserves.
            </p>
            <p className="text-zinc-700 dark:text-white/80">
              For detailed pricing based on your specific requirements, use the Project Calculator or schedule a
              strategy call.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white">
                <Link href="/calculator">
                  Calculate Your Project Cost
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-zinc-50">What Others Say</h2>
            <p className="text-lg text-white dark:text-zinc-400 max-w-2xl mx-auto">
              Feedback from clients and colleagues on my work and expertise.
              <Link href="/testimonials" className="text-[#7cc2ff] underline hover:opacity-90 ml-2">
                View all testimonials →
              </Link>
            </p>
          </div>

          <div className="bg-zinc-100 dark:bg-blue-800 p-8 rounded-xl shadow-lg">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-950 relative">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-zinc-50 mb-6">Ready to Build Your AI-Powered Solution?</h2>
          <p className="text-xl text-white dark:text-zinc-300 max-w-2xl mx-auto mb-10">
            Let&apos;s discuss how my specialized expertise can help bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white hover:bg-white/90 text-blue-700">
              <Link href="/calculator">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Strategy Call
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 