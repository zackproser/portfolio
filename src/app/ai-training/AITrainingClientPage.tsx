"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Brain, Shield, CheckCircle2, Users, Trophy, Code, Monitor, Handshake, Zap, GitBranch, MessageSquare, BarChart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import ConsultationForm from "@/components/ConsultationForm"

function TrainingCalculator({ onConsultationClick }: { onConsultationClick: () => void }) {
  const [engineers, setEngineers] = useState(5)
  const [format, setFormat] = useState("cowork")
  
  const pricing: Record<string, { perEngineer: number; base: number; label: string }> = {
    "internal-skills": { perEngineer: 500, base: 5000, label: "Claude Internal Skills (1 day)" },
    "cowork": { perEngineer: 600, base: 5000, label: "Claude Cowork (1 day)" },
    "full": { perEngineer: 2000, base: 5000, label: "Full 90-Day Program" },
  }
  
  const selected = pricing[format]
  const totalPrice = engineers * selected.perEngineer + selected.base
  
  return (
    <div className="bg-blue-800/70 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Estimate Your Investment</h3>
      
      <div className="space-y-8">
        <div>
          <Label className="text-white text-lg mb-3 block">Training Format</Label>
          <RadioGroup 
            defaultValue="cowork" 
            onValueChange={(value: string) => setFormat(value)}
            className="space-y-3"
          >
            {Object.entries(pricing).map(([key, val]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={key} className="text-white" />
                <Label htmlFor={key} className="text-white">{val.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label className="text-white text-lg" htmlFor="engineers">Engineers: {engineers}</Label>
            <span className="text-white font-medium">${(engineers * selected.perEngineer).toLocaleString()}</span>
          </div>
          <Slider 
            id="engineers"
            min={3} 
            max={20} 
            step={1} 
            value={[engineers]} 
            onValueChange={(value: number[]) => setEngineers(value[0])}
            className="mb-2"
          />
          <p className="text-sm text-blue-200">3-15 is ideal. Larger teams: let&apos;s talk.</p>
        </div>
        
        <div className="pt-6 border-t border-blue-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/70">Base fee</span>
            <span className="text-white">${selected.base.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/70">{engineers} engineers × ${selected.perEngineer}</span>
            <span className="text-white">${(engineers * selected.perEngineer).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-blue-700">
            <span className="text-white text-xl">Estimated Total:</span>
            <span className="text-white text-2xl font-bold">${totalPrice.toLocaleString()}</span>
          </div>
          <p className="text-sm text-blue-200 mt-2">
            Exact pricing depends on scope. This is a ballpark — let&apos;s talk about what your team needs.
          </p>
        </div>
        
        <Button 
          className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-medium"
          onClick={onConsultationClick}
        >
          Schedule a Call
        </Button>
      </div>
    </div>
  )
}

export default function AITrainingClientPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  
  return (
    <main className="flex min-h-screen flex-col bg-blue-600 dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-b from-blue-800 to-blue-700 dark:from-zinc-900 dark:to-zinc-950 py-16 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="container mx-auto relative z-10 max-w-4xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Team Has AI Tools.<br />
              <span className="text-[#7cc2ff]">Now What?</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Everyone has Copilot. Someone tried Cursor. But the gap between &quot;we have AI tools&quot; and actually shipping faster? Bigger than anyone wants to admit.
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              I run hands-on training that turns strong engineers into faster ones. Not theory. Not slides about the future. We write code together and your team leaves knowing how to work differently.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-blue-700"
                onClick={() => setIsConsultationOpen(true)}
              >
                Let&apos;s Talk About Your Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="#calculator">
                  See Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">The Job Changed. The Craft Didn&apos;t.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-lg text-white/80">
                  AI writes the code now. So what do your engineers do? The same things that always mattered: decide what to build, design how it fits together, and make sure it actually works.
                </p>
                <p className="text-lg text-white/80">
                  Ten years of experience didn&apos;t stop being useful. You just apply it differently. Less typing, more thinking. Less grunt work, more building.
                </p>
              </div>
              <div className="bg-blue-800/50 rounded-xl p-6 space-y-4">
                <h3 className="text-white font-semibold text-lg">What I&apos;ve seen work:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Engineers shipping in a week what used to take a quarter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Solo engineers maintaining 20+ repos with AI workflows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Internal tools that took months, built in days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Teams codifying their best workflows into shareable, version-controlled skills</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Formats */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-zinc-950 dark:to-zinc-900">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-300/30 mb-4 px-4 py-1 text-sm font-semibold rounded-full">
              Flexible Formats
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose How You Want to Work</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              One intensive day, a structured multi-month program, or something in between. We scope it on the intro call.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Claude Internal Skills */}
            <Card className="bg-blue-800/70 backdrop-blur-sm border-blue-600/50 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-green-300" />
                  </div>
                  <Badge className="bg-green-500/30 text-green-200">1 Day</Badge>
                </div>
                <CardTitle className="text-white text-xl">Claude Internal Skills</CardTitle>
                <CardDescription className="text-white/70">
                  We pick a real workflow your team needs, build it into a shareable Claude skill together, and everyone leaves with a working capability they can iterate on.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Your team&apos;s actual workflow, not a toy example</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Version-controlled, shareable across the org</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Everyone leaves with something that works</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">In-person or remote</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Claude Cowork */}
            <Card className="bg-blue-800/70 backdrop-blur-sm border-blue-600/50 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Handshake className="h-5 w-5 text-amber-300" />
                  </div>
                  <Badge className="bg-amber-500/30 text-amber-200">1 Day</Badge>
                </div>
                <CardTitle className="text-white text-xl">Claude Cowork</CardTitle>
                <CardDescription className="text-white/70">
                  I pair with your engineers on their actual AI challenges. We ship real code, solve real problems, and your team levels up by doing — not watching.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Hands-on pairing on your actual codebase</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Unblock AI integration challenges live</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Ship production code by end of day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Architecture review included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Full Program */}
            <Card className="bg-blue-800/70 backdrop-blur-sm border-blue-600/50 text-white relative overflow-hidden ring-2 ring-blue-400/50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-blue-300" />
                  </div>
                  <Badge className="bg-blue-500/30 text-blue-200">90 Days</Badge>
                </div>
                <CardTitle className="text-white text-xl">Full AI Engineering Program</CardTitle>
                <CardDescription className="text-white/70">
                  The comprehensive program. Foundations through production deployment. Your team ships a real AI feature or you get your money back.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Structured 6-module curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Live workshops + async learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">Teams of 3-20 engineers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 mt-1 flex-shrink-0" />
                    <span className="text-white/80">100% money-back guarantee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Your Team Will Learn */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-900 relative">
        <div className="absolute inset-0 bg-blueprint-grid opacity-5"></div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-300/30 mb-4 px-4 py-1 text-sm font-semibold rounded-full">
              Curriculum
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Your Team Will Learn</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              A baseline curriculum tailored to your team&apos;s stack, experience, and goals. We go deeper wherever you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Module 1 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-200">1</span>
                  </div>
                  <CardTitle className="text-white text-lg">The AI Mindset</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">Before touching tools — how to think about working with AI. What changes, what doesn&apos;t, and why engineering experience matters more now.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">From writing code to directing agents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Addressing the fear and FUD head-on</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Where AI excels vs. where humans matter</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Module 2 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-200">2</span>
                  </div>
                  <CardTitle className="text-white text-lg">Context is Everything</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">The difference between &quot;make this work&quot; and &quot;build this well&quot; is the context you provide. We cover the tools your team already has.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Prompt engineering for real codebases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Structuring context for quality output</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Claude Code, Copilot, Cursor — your stack</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Module 3 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-amber-200">3</span>
                  </div>
                  <CardTitle className="text-white text-lg">Build It Live</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">We build something real together, in real-time. Not slides about best practices. Actual code, actual problems, actual shipping.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Pick a real feature, build it start to finish</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Everyone codes along with their own tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">See what &quot;fast&quot; actually looks like</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Module 4 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-200">4</span>
                  </div>
                  <CardTitle className="text-white text-lg">Architecture-First Thinking</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">When code is cheap, design matters more. How to think about systems, tradeoffs, and the decisions AI can&apos;t make for you.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Systems design when generation is free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Speccing work for better agent output</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Avoiding &quot;it works but it&apos;s a mess&quot;</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Module 5 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-red-200">5</span>
                  </div>
                  <CardTitle className="text-white text-lg">Review, Verify, Ship</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">Reading code is the job now. How to evaluate what AI wrote, catch the subtle bugs, and test code you didn&apos;t write.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-red-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Code review patterns for AI-generated code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-red-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Common failure modes and how to spot them</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-red-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Testing strategies for code you didn&apos;t type</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Module 6 */}
            <Card className="bg-blue-700 border-blue-600 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-200">6</span>
                  </div>
                  <CardTitle className="text-white text-lg">Working in Parallel</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-white/70 text-sm">How to run multiple workstreams at once with agents doing the heavy lifting. This is where the output multiplier kicks in.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Running multiple agents on different tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">Managing context across workstreams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80">When to parallelize and when to focus</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/70 max-w-2xl mx-auto">
              All modules adapt to your team&apos;s stack and tools. Custom deep-dives available — RAG systems, Claude skills, agent architecture, whatever your team needs.
            </p>
          </div>
        </div>
      </section>

      {/* For Engineering Leaders */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-800 dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">For Engineering Leaders</h2>
          <p className="text-lg text-white/70 mb-12">
            You got the mandate: adopt AI. But what does that actually mean for your team? How do you measure it? This covers how to think about AI adoption as a leader.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-300" />
                </div>
                <h3 className="text-white font-semibold">First 30 Days</h3>
              </div>
              <p className="text-white/70">Team adopts new workflows. AI usage shifts from autocomplete to agentic coding. PR velocity starts climbing.</p>
            </div>
            
            <div className="bg-blue-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="text-white font-semibold">60 Days</h3>
              </div>
              <p className="text-white/70">Engineers are self-sufficient. Internal conventions established. The team has a shared language for how they work with AI.</p>
            </div>
            
            <div className="bg-blue-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-blue-300" />
                </div>
                <h3 className="text-white font-semibold">90 Days</h3>
              </div>
              <p className="text-white/70">Shipping velocity is measurably higher. Engineers tackle projects they would&apos;ve deprioritized before. The team wonders how they worked without this.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Walk Away With */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">What Your Team Walks Away With</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 items-start bg-blue-800/50 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Code className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Working Examples</h3>
                <p className="text-white/70">The code your team built during the session — real examples to reference, not throwaway demos.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-blue-800/50 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <GitBranch className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">AI Workflow Playbook</h3>
                <p className="text-white/70">Written guide covering workflows, patterns, and prompts — tailored to your stack.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-blue-800/50 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Team Conventions Template</h3>
                <p className="text-white/70">Starting point for internal AI usage guidelines — review standards, quality gates, tool recommendations.</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start bg-blue-800/50 rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg">Follow-Up Session</h3>
                <p className="text-white/70">30-60 days after training, we regroup. Address new questions, reinforce what stuck, troubleshoot what didn&apos;t.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Instructor */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-600 dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <div className="md:col-span-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-2xl blur-xl transform scale-95"></div>
                <Image
                  src="https://zackproser.b-cdn.net/images/zack-holding-mic.webp"
                  alt="Zack Proser presenting at a training session"
                  width={400}
                  height={500}
                  className="relative rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Meet Your Instructor</h2>
              <p className="text-lg text-white/80">
                I&apos;m Zack Proser — Applied AI at WorkOS, previously Staff DevRel at Pinecone, Cloudflare, and Gruntwork. 14 years shipping production systems, 50+ conference talks, and I built the internal training program at WorkOS that taught the team to build and share Claude skills.
              </p>
              <p className="text-lg text-white/80">
                I use AI to ship everything I build — from production features to open source tools to the content on this site. I&apos;m not teaching theory. I&apos;m teaching how I actually work, every day.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Badge className="bg-blue-500/20 text-blue-200 border-blue-300/30">50+ Conference Talks</Badge>
                <Badge className="bg-green-500/20 text-green-200 border-green-300/30">Applied AI @ WorkOS</Badge>
                <Badge className="bg-amber-500/20 text-amber-200 border-amber-300/30">Ex-Pinecone, Cloudflare, Gruntwork</Badge>
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-300/30">Open Source Maintainer</Badge>
              </div>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/about">Full Bio →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Is This Right for Your Team */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-blue-800 dark:bg-zinc-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Is This Right for Your Team?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-8">
              <h3 className="text-green-300 font-semibold text-xl mb-6">Great Fit</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">Teams of 3-20 engineers shipping a product</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">Leadership said &quot;use AI&quot; but nobody explained how</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">Engineers using Copilot for autocomplete but not much else</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <span className="text-white/80">Eng managers who need to measure and report on AI adoption</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-8">
              <h3 className="text-red-300 font-semibold text-xl mb-6">Not a Fit</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-300 mt-0.5 flex-shrink-0">✕</span>
                  <span className="text-white/80">Looking for a course on building AI/ML models</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-300 mt-0.5 flex-shrink-0">✕</span>
                  <span className="text-white/80">Non-technical teams or 1:1 coaching</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-300 mt-0.5 flex-shrink-0">✕</span>
                  <span className="text-white/80">Teams already shipping daily with agentic workflows</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-zinc-900 dark:to-zinc-950">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Badge className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-300/30 px-4 py-1 text-sm font-semibold rounded-full">
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white">What&apos;s the Investment?</h2>
              <p className="text-xl text-white/80">
                Use the calculator for a ballpark. Exact numbers depend on team size, format, and what we cover. Let&apos;s talk about it on a call.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Team-based Pricing</h3>
                    <p className="text-white/70">3-15 engineers is the sweet spot. Larger teams, we&apos;ll work it out.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-6 w-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Your Stack, Your Problems</h3>
                    <p className="text-white/70">Curriculum adapts to your languages, frameworks, and actual projects.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">Money-back Guarantee</h3>
                    <p className="text-white/70">Full 90-day program: your team ships an AI feature or you get your money back.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <TrainingCalculator onConsultationClick={() => setIsConsultationOpen(true)} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 lg:px-8 bg-blue-700 dark:bg-zinc-950 relative">
        <div className="absolute inset-0 bg-grid-white/[0.1] dark:bg-grid-white/[0.05] bg-[size:60px_60px]" />

        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Let&apos;s Talk About Your Team
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            30 minutes. No pitch deck. We&apos;ll figure out if this is a good fit and what your team actually needs.
          </p>
          <Button 
            size="lg" 
            className="bg-white hover:bg-white/90 text-blue-700"
            onClick={() => setIsConsultationOpen(true)}
          >
            Schedule a Call
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      <ConsultationForm isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </main>
  )
}
