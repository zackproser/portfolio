"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Brain, Zap, BookOpen, GitBranch, Shield, CheckCircle2, Users, CalendarDays, Trophy, BarChart, Layers, Code } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

function TrainingCalculator() {
  const [engineers, setEngineers] = useState(5)
  const [includeWorkshops, setIncludeWorkshops] = useState(true)
  
  const basePrice = 2000 // price per engineer
  const workshopPrice = 5000 // additional cost for workshops
  
  const totalPrice = engineers * basePrice + (includeWorkshops ? workshopPrice : 0)
  
  return (
    <div className="bg-blue-800/70 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Training Cost Calculator</h3>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-white text-lg" htmlFor="engineers">Number of Engineers: {engineers}</Label>
            <span className="text-white font-medium">${engineers * basePrice}</span>
          </div>
          <Slider 
            id="engineers"
            min={3} 
            max={20} 
            step={1} 
            value={[engineers]} 
            onValueChange={(value: number[]) => setEngineers(value[0])}
            className="mb-6"
          />
          <p className="text-sm text-blue-200">Minimum 3 engineers required to form a cohort</p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-white text-lg" htmlFor="workshops">
              Include Live Workshops
            </Label>
            <span className="text-white font-medium">${includeWorkshops ? workshopPrice : 0}</span>
          </div>
          <RadioGroup 
            defaultValue={includeWorkshops ? "yes" : "no"} 
            onValueChange={(value: string) => setIncludeWorkshops(value === "yes")}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" className="text-white" />
              <Label htmlFor="yes" className="text-white">Yes (+$5,000)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" className="text-white" />
              <Label htmlFor="no" className="text-white">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-blue-200 mt-2">
            Live workshops include hands-on sessions with our experts to implement what your team learns
          </p>
        </div>
        
        <div className="pt-6 border-t border-blue-700">
          <div className="flex justify-between items-center">
            <span className="text-white text-xl">Total Investment:</span>
            <span className="text-white text-2xl font-bold">${totalPrice.toLocaleString()}</span>
          </div>
          <p className="text-sm text-blue-200 mt-2">
            100% money-back guarantee if your team doesn&apos;t ship an AI feature in 90 days
          </p>
        </div>
        
        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-medium">
          Schedule a Consultation
        </Button>
      </div>
    </div>
  )
}

export default function AITrainingClientPage() {
  return (
    <main className="flex min-h-screen flex-col bg-blue-600 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-800 to-blue-700 dark:from-zinc-900 dark:to-zinc-950 py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <Badge className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-300/30 mb-4 px-4 py-1 text-sm font-semibold rounded-full">
                  90-Day AI Transformation Program
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Turn Your Developers Into <span className="text-[#7cc2ff] font-extrabold relative">AI Engineers<span className="absolute -bottom-2 left-0 w-full h-1 bg-[#7cc2ff]/50 rounded-full"></span></span> in 90 Days
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                A structured training program that guarantees your development team will ship production-ready AI features in 90 days — or your money back.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="bg-white hover:bg-white/90 text-blue-700">
                  <Link href="#calculator">
                    Calculate Your Training Cost
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Schedule a Consultation
                </Button>
              </div>
              
              <div className="flex items-center pt-6 gap-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-300" />
                  <span className="text-white">Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-300" />
                  <span className="text-white">Teams of 3-20</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-amber-300" />
                  <span className="text-white">90-day program</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-3xl blur-xl transform scale-95 -rotate-3"></div>
                <div className="relative bg-blue-900/70 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Program Highlights</h3>
                    <Badge className="bg-amber-600 text-white">Proven Process</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-5 w-5 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Foundation Building</h4>
                        <p className="text-white/70 text-sm">Master AI fundamentals including tokenization, embeddings, and vector mathematics</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Code className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Advanced Implementation</h4>
                        <p className="text-white/70 text-sm">Build practical RAG systems, fine-tune models, and design AI architectures</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Production Specialization</h4>
                        <p className="text-white/70 text-sm">Deploy secure, scalable AI systems with vector databases and authorization controls</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-5 w-5 text-green-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Real-World Deployment</h4>
                        <p className="text-white/70 text-sm">Guided implementation of an actual AI feature for your product</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-900 relative">
        <div className="absolute inset-0 bg-blueprint-grid opacity-5"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-300/30 mb-4 px-4 py-1 text-sm font-semibold rounded-full">
              Comprehensive AI Curriculum
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Your AI Engineering Blueprint</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Our structured learning path takes engineers from fundamental concepts to specialized AI implementation techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1: Foundations */}
            <Card className="bg-blue-700 border-blue-600 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-blue-300 text-sm font-medium">MODULE 1</p>
                    <CardTitle className="text-white">Foundations</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">How do LLMs See Text?</h4>
                      <p className="text-white/70 text-sm">Explore tokenization concepts and hands-on experiments</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Embeddings & Vector Mathematics</h4>
                      <p className="text-white/70 text-sm">Master vector representations and dimensional space</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Data Science Fundamentals</h4>
                      <p className="text-white/70 text-sm">Essential tools and workflows for ML development</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-blue-600/50">
                  <h5 className="text-sm font-semibold text-blue-300 mb-2">LEARNING OUTCOMES</h5>
                  <p className="text-white/80">Understand how language models process text and build semantic search capabilities with vector embeddings</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Module 2: Intermediate & Advanced */}
            <Card className="bg-blue-700 border-blue-600 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Code className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-green-300 text-sm font-medium">MODULE 2</p>
                    <CardTitle className="text-white">Implementation & Architecture</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">AI Implementation Strategies</h4>
                      <p className="text-white/70 text-sm">Architectural patterns for robust AI applications</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Practical Machine Learning</h4>
                      <p className="text-white/70 text-sm">Hands-on projects with real-world applications</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Retrieval Augmented Generation</h4>
                      <p className="text-white/70 text-sm">Build AI systems with external knowledge retrieval</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-blue-600/50">
                  <h5 className="text-sm font-semibold text-green-300 mb-2">LEARNING OUTCOMES</h5>
                  <p className="text-white/80">Design and implement production-grade AI systems that leverage external knowledge sources and custom architectures</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Module 3: Specializations */}
            <Card className="bg-blue-700 border-blue-600 text-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-purple-300 text-sm font-medium">MODULE 3</p>
                    <CardTitle className="text-white">Production Specializations</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Scaling Vector Infrastructure</h4>
                      <p className="text-white/70 text-sm">Design database-backed applications that handle millions of queries</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Enterprise Security for AI Systems</h4>
                      <p className="text-white/70 text-sm">Implement fine-grained security controls for AI applications</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Fine-tuning LLMs</h4>
                      <p className="text-white/70 text-sm">Customize pre-trained models for domain-specific tasks</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-blue-600/50">
                  <h5 className="text-sm font-semibold text-purple-300 mb-2">LEARNING OUTCOMES</h5>
                  <p className="text-white/80">Deploy secure, scalable AI infrastructure in production with enterprise-grade controls and customized models</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              All modules include interactive demos, coding exercises, and integration into your team&apos;s actual projects for practical application.
            </p>
            <Button asChild className="bg-white hover:bg-white/90 text-blue-700">
              <Link href="/learning-guide">
                View Detailed Curriculum
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Badge className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-300/30 px-4 py-1 text-sm font-semibold rounded-full">
                Transparent Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Calculate Your Training Investment</h2>
              <p className="text-xl text-white/80 max-w-xl">
                Our training program is designed for teams of 3-20 engineers, with flexible options for live workshops and hands-on implementation support.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">90-Day Money-Back Guarantee</h4>
                    <p className="text-white/70">If your team doesn&apos;t ship a production AI feature within 90 days, you get a full refund</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Access to All Course Materials</h4>
                    <p className="text-white/70">Interactive demos, code samples, video tutorials, and practical exercises</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Weekly Progress Check-ins</h4>
                    <p className="text-white/70">Regular sessions to ensure your team is on track and tackle any challenges</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Hands-On Project Guidance</h4>
                    <p className="text-white/70">Support implementing an actual AI feature for your product during the program</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <TrainingCalculator />
            </div>
          </div>
        </div>
      </section>
      
      {/* Workshop Add-Ons */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-800 dark:bg-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-300/30 mb-4 px-4 py-1 text-sm font-semibold rounded-full">
              Live Workshops
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supercharge Training with Interactive Workshops</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Add live, instructor-led workshops to accelerate your team&apos;s learning with hands-on implementation sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-blue-700/70 backdrop-blur-sm border-blue-600/50 text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">WORKSHOP</p>
                    <CardTitle className="text-white">RAG Implementation Deep Dive</CardTitle>
                  </div>
                  <Badge className="bg-blue-500/30 text-blue-200">4 Hours</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6">
                  Build a complete RAG system from scratch that integrates with your existing codebase and data sources
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Vector database integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Document processing pipeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Context-aware prompt engineering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Relevance and quality metrics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-700/70 backdrop-blur-sm border-blue-600/50 text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">WORKSHOP</p>
                    <CardTitle className="text-white">Vector Database Architecture</CardTitle>
                  </div>
                  <Badge className="bg-blue-500/30 text-blue-200">3 Hours</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6">
                  Design and implement scalable vector search infrastructure optimized for your application needs
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Performance optimization techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Sharding and scaling strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Index design for low latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">High-availability configurations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-700/70 backdrop-blur-sm border-blue-600/50 text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">WORKSHOP</p>
                    <CardTitle className="text-white">Fine-tuning for Your Domain</CardTitle>
                  </div>
                  <Badge className="bg-blue-500/30 text-blue-200">4 Hours</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-6">
                  Create custom LLM fine-tuning datasets and implement efficient training workflows for your use cases
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Dataset preparation techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Parameter-efficient training (LoRA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Evaluation metrics and testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1" />
                    <span className="text-white/80">Model deployment strategies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-950 relative">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10 text-center">
          <Badge className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-300/30 mb-6 px-4 py-1 text-sm font-semibold rounded-full">
            Start Your AI Journey Today
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-zinc-50 mb-6">
            Transform Your Development Team Into AI Engineers
          </h2>
          <p className="text-xl text-white dark:text-zinc-300 max-w-2xl mx-auto mb-10">
            Ship your first production AI feature in 90 days or your money back. Schedule a consultation to discuss your team&apos;s needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white hover:bg-white/90 text-blue-700">
              <Link href="#calculator">
                Calculate Your Training Cost
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
} 