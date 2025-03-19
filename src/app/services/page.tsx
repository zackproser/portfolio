import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Code, Database, Server, Zap } from "lucide-react"
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
import logoGrunty from '@/images/logos/grunty.webp'
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
    <main className="flex min-h-screen flex-col bg-black">
      {/* Hero Section */}
      <section className="relative w-full bg-black py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              I build <span className="text-[#7cc2ff] font-extrabold relative">production-ready<span className="absolute -bottom-2 left-0 w-full h-1 bg-[#7cc2ff]/50 rounded-full"></span></span> AI apps with Next.js. You launch faster.
            </h1>

            {/* Animation directly under the header */}
            <div className="py-8">
              <div className="mx-auto w-64 h-64 md:w-80 md:h-80 relative">
                <div className="w-full h-full overflow-hidden rounded-full">
                  <EngineeringAnimation />
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
              <Button asChild size="lg" className="bg-[#7cc2ff] hover:bg-[#7cc2ff]/90 text-white">
                <Link href="/calculator">
                  Calculate Your Project Cost
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[#7cc2ff]/70 text-[#7cc2ff] hover:bg-[#7cc2ff]/10">
                Schedule a Strategy Call
              </Button>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mt-4">
              Ready to elevate your product with AI? Let&apos;s build your Next.js solution together.
            </p>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-10 px-4 md:px-6 lg:px-8 bg-black border-t border-b border-white/10">
        <div className="container mx-auto">
          <p className="text-center text-sm text-gray-400 mb-8">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoCloudflare}
                  alt="Cloudflare"
                  width={40}
                  height={15}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-base font-medium text-white mt-2">Cloudflare</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoGrunty}
                  alt="Gruntwork"
                  width={40}
                  height={15}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-base font-medium text-white mt-2">Gruntwork</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoWorkOS}
                  alt="WorkOS"
                  width={40}
                  height={15}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-base font-medium text-white mt-2">WorkOS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-6 relative flex items-center justify-center">
                <Image
                  src={logoPinecone}
                  alt="Pinecone"
                  width={40}
                  height={15}
                  className="opacity-90 hover:opacity-100 transition-opacity filter brightness-200 contrast-125"
                />
              </div>
              <span className="text-base font-medium text-white mt-2">Pinecone</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Specialized AI Engineering Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

          <div className="mt-16 p-6 bg-orange-950/40 rounded-lg backdrop-blur-sm border border-orange-600/20">
            <h3 className="text-xl font-semibold mb-3">Trust & Experience</h3>
            <p className="text-muted-foreground">
              As a former staff-level developer advocate at Pinecone, I built their first AWS-based production example
              that&apos;s now used as a reference architecture. With years of end-to-end experience in AI model integration,
              vector database hosting, and infrastructure as code, I bring rare expertise to your project.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio/Experience Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Portfolio Highlights</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mb-12">
            Selected projects showcasing my expertise in AI engineering and vector database integration.
          </p>

          <Tabs defaultValue="case-studies" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="tech-stack">Technology Stack</TabsTrigger>
            </TabsList>
            <TabsContent value="case-studies">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-orange-950/30 border-orange-600/20">
                  <CardHeader>
                    <CardTitle>Legal Semantic Search Application</CardTitle>
                    <CardDescription>Fortune 500 Client (NDA)</CardDescription>
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
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Built an AI-powered legal document search system</li>
                      <li>Reduced research time by 70% for legal team</li>
                      <li>Implemented RAG with custom vector embeddings</li>
                      <li>Deployed on Vercel with Next.js and Pinecone</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-950/30 border-orange-600/20">
                  <CardHeader>
                    <CardTitle>Pinecone AWS Reference Architecture</CardTitle>
                    <CardDescription>Official Reference Architecture</CardDescription>
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
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Developed production-ready integration between AWS and Pinecone</li>
                      <li>Now used as official reference architecture</li>
                      <li>Implemented IaC with Terraform for reproducibility</li>
                      <li>Created comprehensive documentation and tutorials</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-950/30 border-orange-600/20">
                  <CardHeader>
                    <CardTitle>Pinecone Assistant Sample App</CardTitle>
                    <CardDescription>Technical Publication</CardDescription>
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
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Developed official sample application for RAG chatbot</li>
                      <li>Implemented vector search with Pinecone</li>
                      <li>Built with Next.js and React</li>
                      <li>Used by thousands of developers worldwide</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-950/30 border-orange-600/20">
                  <CardHeader>
                    <CardTitle>Office Oracle - RAG Chatbot</CardTitle>
                    <CardDescription>Personal Project</CardDescription>
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
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Built a RAG chatbot trained on The Office TV series</li>
                      <li>Implemented vector search database</li>
                      <li>Created with Next.js and OpenAI</li>
                      <li>Demonstrates context-aware responses and character mimicry</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center mt-8 gap-4">
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto">
          {/* About Me Section - Now First */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Me</h2>
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              <div className="w-48 h-48 mb-8">
                <RandomPortrait width={192} height={192} />
              </div>
              <p className="text-lg text-muted-foreground text-center max-w-2xl">
                I combine deep technical knowledge with practical experience to deliver 
                solutions that are both innovative and production-ready.
              </p>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mt-4">
                My background spans from large enterprise systems to startup environments, giving me
                a unique perspective on what works at different scales. 
                <br /><br />
                As a full stack open source 
                developer with over <NumYearsExperience /> years of experience, I&apos;ve contributed to 
                various projects that improve developer workflows and system architectures.
              </p>
              <div className="mt-6">
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Professional Experience</h2>
            <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-xl p-6 md:p-8 shadow-lg">
              <CV />
              <div className="flex flex-wrap justify-center mt-8 gap-4">
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Link href="/publications">
                    Read my publications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Me</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized expertise in a rapidly evolving field where experience matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Expertise & Specialization</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 bg-primary/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-foreground">Laser-Focused Expertise:</strong>
                    <p className="text-muted-foreground">
                      Specialized in Next.js + Vercel + AI with a multi-year track record in a space where many are just
                      getting started.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 bg-primary/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-foreground">Production-Scale Experience:</strong>
                    <p className="text-muted-foreground">
                      Background in building systems that handle real-world scale, reliability, and performance
                      requirements.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 bg-primary/20 p-1 rounded-full">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong className="text-foreground">End-to-End Knowledge:</strong>
                    <p className="text-muted-foreground">
                      Rare combination of AI model expertise, vector database implementation, and infrastructure as code
                      skills.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">My Process</h3>
              <ProcessTimeline />
            </div>
          </div>

          <div className="mt-16 p-8 bg-orange-950/30 rounded-lg backdrop-blur-sm border border-orange-600/20">
            <h3 className="text-xl font-semibold mb-4">Project Minimums & Rates</h3>
            <p className="text-muted-foreground mb-4">
              I exclusively take on high-impact projects with a minimum engagement of $20,000. I require 50% payment up front 
              to begin work, with the remaining 50% due upon delivery. This ensures I can deliver the quality and attention 
              your project deserves.
            </p>
            <p className="text-muted-foreground">
              For detailed pricing based on your specific requirements, use the Project Calculator or schedule a
              strategy call.
            </p>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-[#7cc2ff] hover:bg-[#7cc2ff]/90 text-white">
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Others Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Feedback from clients and colleagues on my work and expertise.
              <Link href="/testimonials" className="text-primary hover:underline ml-2">
                View all testimonials →
              </Link>
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 lg:px-8 bg-black relative">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build Your AI-Powered Solution?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Let&apos;s discuss how my specialized expertise can help bring your vision to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-[#7cc2ff] text-white hover:bg-[#7cc2ff]/90">
              <Link href="/calculator">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-[#7cc2ff] text-[#7cc2ff] hover:bg-[#7cc2ff]/10">
              Schedule a Strategy Call
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 