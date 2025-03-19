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
import Image from "next/image"

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
      <section className="relative w-full bg-black py-24 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge className="px-3 py-1 text-sm bg-primary/20 text-primary border-primary/30 mb-4">
              Zachary Proser
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Next.js AI Engineering for Production-Ready Apps
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
                <span className="text-primary font-bold text-2xl drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)] mr-1">3+</span> 
                years building production AI solutions and vector database integrations.
              </span>
              <span className="block mt-2">
                <span className="text-primary font-bold text-2xl drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)] mr-1">13+</span> 
                years of professional engineering experience.
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Calculate Your Project Cost
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/70 text-primary hover:bg-primary/10">
                Schedule a Strategy Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-10 px-4 md:px-6 lg:px-8 bg-black border-t border-b border-white/10">
        <div className="container mx-auto">
          <p className="text-center text-sm text-gray-400 mb-6">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="w-32 h-12 relative flex items-center justify-center">
              <Image
                src="/images/logos/cloudflare.svg"
                alt="Cloudflare"
                width={128}
                height={48}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="w-32 h-12 relative flex items-center justify-center">
              <Image
                src="/images/logos/gruntwork.svg"
                alt="Gruntwork"
                width={128}
                height={48}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="w-32 h-12 relative flex items-center justify-center">
              <Image
                src="/images/logos/workos.svg"
                alt="WorkOS"
                width={128}
                height={48}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="w-32 h-12 relative flex items-center justify-center">
              <Image
                src="/images/logos/pinecone.svg"
                alt="Pinecone"
                width={128}
                height={48}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-black">
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

          <div className="mt-16 p-6 bg-secondary rounded-lg backdrop-blur-sm border border-primary/20">
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
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-black">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Semantic Search Application</CardTitle>
                    <CardDescription>Fortune 500 Client (NDA)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Built an AI-powered legal document search system</li>
                      <li>Reduced research time by 70% for legal team</li>
                      <li>Implemented RAG with custom vector embeddings</li>
                      <li>Deployed on Vercel with Next.js and Pinecone</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Production AWS & Pinecone Integration</CardTitle>
                    <CardDescription>Reference Architecture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Developed production-ready integration between AWS and Pinecone</li>
                      <li>Now used as official reference architecture</li>
                      <li>Implemented IaC with Terraform for reproducibility</li>
                      <li>Created comprehensive documentation and tutorials</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>RAG Best Practices Guide</CardTitle>
                    <CardDescription>Technical Publication</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Authored comprehensive guide on retrieval-augmented generation</li>
                      <li>Read by 10,000+ developers worldwide</li>
                      <li>Includes practical code examples and architecture patterns</li>
                      <li>Featured in industry newsletters and conferences</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Content Moderation</CardTitle>
                    <CardDescription>SaaS Platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Built real-time content moderation system using AI</li>
                      <li>Processed 1M+ user-generated content pieces daily</li>
                      <li>Reduced false positives by 40% compared to previous system</li>
                      <li>Implemented with Next.js, Vercel AI SDK, and custom models</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="tech-stack">
              <TechStack />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Why Work With Me */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-black">
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

          <div className="mt-16 p-8 bg-secondary rounded-lg backdrop-blur-sm border border-primary/20">
            <h3 className="text-xl font-semibold mb-4">Project Minimums & Rates</h3>
            <p className="text-muted-foreground mb-4">
              I exclusively take on high-impact projects with a minimum engagement of $10,000. This ensures I can
              deliver the quality and attention your project deserves.
            </p>
            <p className="text-muted-foreground">
              For detailed pricing based on your specific requirements, use the Project Calculator or schedule a
              strategy call.
            </p>
            <div className="mt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Calculate Your Project Cost
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Others Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Feedback from clients and colleagues on my work and expertise.
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
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Start Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Schedule a Strategy Call
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-secondary backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
      <CardHeader>
        <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 