import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const ToolComparisonHero = ({ tool1, tool2 }) => {
  const [tool1ImageError, setTool1ImageError] = useState(false)
  const [tool2ImageError, setTool2ImageError] = useState(false)
  
  // Function to generate a gradient based on tool name
  const generateGradient = (name) => {
    // Simple hash function to get consistent colors based on string
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    // Generate colors based on hash
    const hue1 = hash % 360
    const hue2 = (hash * 1.5) % 360
    
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 50%), hsl(${hue2}, 70%, 40%))`
  }
  
  // Function to render tool logo or fallback
  const renderToolLogo = (tool, hasError, setError) => {
    // If we have a logo and no error loading it
    if (tool.icon && !hasError) {
      return (
        <Image 
          src={tool.icon} 
          alt={`${tool.name} logo`} 
          width={80} 
          height={80}
          className="object-contain" 
          onError={() => setError(true)}
        />
      )
    }
    
    // Fallback: Show first letter with gradient background
    const firstLetter = tool.name.charAt(0).toUpperCase()
    const gradient = generateGradient(tool.name)
    
    return (
      <div 
        className="w-full h-full rounded-full flex items-center justify-center text-white"
        style={{ background: gradient }}
      >
        <span className="text-4xl font-bold">{firstLetter}</span>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl p-10 mb-8 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {tool1.name} vs {tool2.name}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          A detailed comparison to help you choose the best tool for your needs.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-4 shadow-lg overflow-hidden">
            {renderToolLogo(tool1, tool1ImageError, setTool1ImageError)}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">{tool1.name}</h2>
          <p className="text-sm text-gray-400">{tool1.category}</p>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">VS</span>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center p-4 shadow-lg overflow-hidden">
            {renderToolLogo(tool2, tool2ImageError, setTool2ImageError)}
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">{tool2.name}</h2>
          <p className="text-sm text-gray-400">{tool2.category}</p>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
          onClick={() => window.open(tool1.website, '_blank')}
        >
          Visit {tool1.name}
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
          onClick={() => window.open(tool2.website, '_blank')}
        >
          Visit {tool2.name}
        </Button>
      </div>
    </div>
  )
}

export default ToolComparisonHero 