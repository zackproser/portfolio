'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"
import { BlogPostCard } from "@/components/BlogPostCard"

const NeuralNetworkPulse = () => {
  const [pulseNodes, setPulseNodes] = useState([]);
  const [nodeInfo, setNodeInfo] = useState({});

  const phrases = [
    "Activation", "Backprop", "Gradient", "Layer", "Neuron",
    "Deep learning", "AI", "ML", "Neural net", "Tensor",
    "Embedding", "Feature", "Epoch", "Batch", "Optimizer"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseNodes(prevNodes => {
        const newNodes = [...prevNodes];
        const randomNode = Math.floor(Math.random() * 30);
        if (!newNodes.includes(randomNode)) {
          newNodes.push(randomNode);
          // Generate random info for the pulsing node
          setNodeInfo(prevInfo => ({
            ...prevInfo,
            [randomNode]: {
              weight: Math.random().toFixed(2),
              phrase: phrases[Math.floor(Math.random() * phrases.length)]
            }
          }));
        }
        return newNodes.slice(-5);  // Keep only the last 5 pulses
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const nodes = 30;
  const radius = 240;

  return (
    <div className="relative w-[600px] h-[600px]">
      {/* Render lines first so they appear behind nodes */}
      {[...Array(nodes)].map((_, i) => {
        const angle = (i / nodes) * 2 * Math.PI;
        const x1 = radius * Math.cos(angle) + radius;
        const y1 = radius * Math.sin(angle) + radius;
        return [...Array(nodes)].map((_, j) => {
          const angle2 = (j / nodes) * 2 * Math.PI;
          const x2 = radius * Math.cos(angle2) + radius;
          const y2 = radius * Math.sin(angle2) + radius;
          return (
            <svg key={`${i}-${j}`} className="absolute top-0 left-0 w-full h-full">
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#4B5563"
                strokeWidth="1"
                className={`transition-all duration-300 ${
                  pulseNodes.includes(i) || pulseNodes.includes(j) ? 'stroke-green-400' : ''
                }`}
              />
            </svg>
          );
        });
      })}
      
      {/* Render nodes */}
      {[...Array(nodes)].map((_, i) => {
        const angle = (i / nodes) * 2 * Math.PI;
        const x = radius * Math.cos(angle) + radius;
        const y = radius * Math.sin(angle) + radius;
        return (
          <div
            key={i}
            className={`absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              pulseNodes.includes(i) ? 'scale-150 bg-green-400' : ''
            }`}
            style={{ left: x, top: y }}
          />
        );
      })}

      {/* Render info labels on top */}
      {pulseNodes.map(i => {
        const angle = (i / nodes) * 2 * Math.PI;
        const x = radius * Math.cos(angle) + radius;
        const y = radius * Math.sin(angle) + radius;
        return (
          <div
            key={`info-${i}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: x, top: y - 30 }}
          >
            <div className="bg-yellow-300 text-purple-900 px-1 rounded text-xs font-bold animate-pulse mb-1">
              {nodeInfo[i]?.weight}
            </div>
            <div className="bg-purple-600 text-yellow-300 px-1 rounded text-xs font-bold animate-pulse">
              {nodeInfo[i]?.phrase}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function HomepageClientComponent({ mlProjects, aiDev, refArchitectures }) {
  const [email, setEmail] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)
  const referrer = usePathname()

  const sendFormSubmissionEvent = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      window.gtag("event", "sign_up", {
        method: "newsletter",
      })
    }

    track("newsletter-signup", {
      method: "newsletter",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      email,
      referrer,
    }

    try {
      await fetch("/api/form", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      sendFormSubmissionEvent()
      setFormSuccess(true)
      setEmail("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">Modern Coding</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-white hover:text-yellow-300 transition-colors" href="#">
            Research
          </Link>
          <Link className="text-sm font-medium text-white hover:text-yellow-300 transition-colors" href="#">
            Projects
          </Link>
          <Link className="text-sm font-medium text-white hover:text-yellow-300 transition-colors" href="#">
            AI Dev
          </Link>
          <Link className="text-sm font-medium text-white hover:text-yellow-300 transition-colors" href="#">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-1 space-y-4 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Applied Machine Learning
                </h1>
                <p className="text-lg text-gray-200 md:text-xl">
                  Practical demos and explanations of embeddings, vector databases, neural networks. Reference architectures and projects showing MLOPS in the real world.
                </p>
                <div className="w-full max-w-sm space-y-2">
                  {formSuccess ? (
                    <p className="text-green-400 font-semibold">Neural Network Activated! 🤖🧠❗ Thank you for joining our AI research community.</p>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-grow"
                        required
                      />
                      <Button type="submit" className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 transition-colors">
                        Subscribe
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-gray-300">
                    Stay updated with our latest AI breakthroughs and insights.
                  </p>
                </div>
              </div>
              <div className="flex-1 md:w-1/2 flex justify-center">
                <NeuralNetworkPulse />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Machine Learning Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mlProjects.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">AI Assisted Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiDev.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Reference Architectures and Demos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refArchitectures.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-gray-800 text-white">
        {/* ... footer content ... */}
      </footer>
    </div>
  )
}