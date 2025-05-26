'use client'

import { useState, useEffect } from 'react';
import { FiInfo, FiBook, FiTool, FiCode, FiChevronDown, FiChevronRight, FiSearch, FiTarget, FiMap } from 'react-icons/fi';
import Image from 'next/image';
import embedDiagram from '@/images/neural-network-transform.webp';
import { track } from '@vercel/analytics';
import NewsletterWrapper from '@/components/NewsletterWrapper';

// Enhanced demo embeddings with realistic async behavior
async function generateRealEmbedding(text: string): Promise<number[]> {
  // Simulate realistic API call timing
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  // Use enhanced demo embeddings that are more sophisticated
  return generateEnhancedDemoEmbedding(text);
}

// More sophisticated demo embedding generation
function generateEnhancedDemoEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(8).fill(0);
  
  // Enhanced semantic rules with more nuanced scoring
  words.forEach(word => {
    // Sentiment dimension (0) - more nuanced
    const positiveWords = ['happy', 'joy', 'love', 'good', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent', 'delightful'];
    const negativeWords = ['sad', 'angry', 'hate', 'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'furious', 'miserable'];
    
    positiveWords.forEach(pw => {
      if (word.includes(pw) || pw.includes(word)) embedding[0] += 0.7;
    });
    negativeWords.forEach(nw => {
      if (word.includes(nw) || nw.includes(word)) embedding[0] -= 0.7;
    });
    
    // Animal dimension (1) - broader coverage
    const animalWords = ['dog', 'cat', 'puppy', 'kitten', 'pet', 'animal', 'wolf', 'bear', 'lion', 'tiger', 'elephant', 'mouse', 'ant', 'bird', 'fish'];
    animalWords.forEach(aw => {
      if (word.includes(aw) || aw.includes(word)) embedding[1] += 0.8;
    });
    
    // Technology dimension (2) - expanded
    const techWords = ['computer', 'software', 'code', 'programming', 'tech', 'digital', 'algorithm', 'data', 'AI', 'robot', 'internet', 'app'];
    techWords.forEach(tw => {
      if (word.includes(tw) || tw.includes(word)) embedding[2] += 0.8;
    });
    
    // Food dimension (3) - more comprehensive
    const foodWords = ['food', 'eat', 'cooking', 'recipe', 'meal', 'restaurant', 'pizza', 'burger', 'delicious', 'tasty', 'hungry', 'dinner'];
    foodWords.forEach(fw => {
      if (word.includes(fw) || fw.includes(word)) embedding[3] += 0.8;
    });
    
    // Size dimension (4) - more precise
    const bigWords = ['big', 'large', 'huge', 'giant', 'massive', 'enormous', 'vast'];
    const smallWords = ['small', 'tiny', 'little', 'mini', 'micro', 'miniature'];
    
    bigWords.forEach(bw => {
      if (word.includes(bw) || bw.includes(word)) embedding[4] += 0.7;
    });
    smallWords.forEach(sw => {
      if (word.includes(sw) || sw.includes(word)) embedding[4] -= 0.7;
    });
    
    // Time dimension (5) - past vs future
    const pastWords = ['past', 'history', 'old', 'ancient', 'yesterday', 'before', 'previous'];
    const futureWords = ['future', 'tomorrow', 'new', 'modern', 'next', 'upcoming', 'advanced'];
    
    pastWords.forEach(pw => {
      if (word.includes(pw) || pw.includes(word)) embedding[5] -= 0.6;
    });
    futureWords.forEach(fw => {
      if (word.includes(fw) || fw.includes(word)) embedding[5] += 0.6;
    });
    
    // Formality dimension (6)
    const informalWords = ['hello', 'hi', 'hey', 'cool', 'awesome', 'yeah', 'ok'];
    const formalWords = ['greetings', 'salutations', 'excellent', 'magnificent', 'distinguished'];
    
    informalWords.forEach(iw => {
      if (word.includes(iw) || iw.includes(word)) embedding[6] -= 0.5;
    });
    formalWords.forEach(fw => {
      if (word.includes(fw) || fw.includes(word)) embedding[6] += 0.5;
    });
    
    // Action dimension (7)
    const actionWords = ['run', 'jump', 'move', 'action', 'active', 'dynamic', 'fast', 'quick'];
    const stillWords = ['still', 'quiet', 'calm', 'peaceful', 'static', 'motionless'];
    
    actionWords.forEach(aw => {
      if (word.includes(aw) || aw.includes(word)) embedding[7] += 0.8;
    });
    stillWords.forEach(sw => {
      if (word.includes(sw) || sw.includes(word)) embedding[7] -= 0.8;
    });
  });
  
  // Add deterministic but varied randomness based on text
  let seed = text.length;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) % 1000000;
  }
  
  // Normalize and add slight variation
  return embedding.map((val, i) => {
    const random = ((seed * (i + 1)) % 1000) / 1000 * 0.2 - 0.1;
    return Math.max(-1, Math.min(1, val + random));
  });
}

// Simple deterministic embedding generation for demo purposes
function generateDemoEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(8).fill(0); // Use 8 dimensions for simplicity
  
  // Simple rules to make embeddings meaningful for demo
  words.forEach(word => {
    // Sentiment dimension (0)
    if (['happy', 'joy', 'love', 'good', 'great', 'wonderful'].includes(word)) embedding[0] += 0.8;
    if (['sad', 'angry', 'hate', 'bad', 'terrible', 'awful'].includes(word)) embedding[0] -= 0.8;
    
    // Animal dimension (1)
    if (['dog', 'cat', 'puppy', 'kitten', 'pet', 'animal'].includes(word)) embedding[1] += 0.9;
    
    // Technology dimension (2)
    if (['computer', 'software', 'code', 'programming', 'tech', 'digital'].includes(word)) embedding[2] += 0.9;
    
    // Food dimension (3)
    if (['food', 'eat', 'cooking', 'recipe', 'meal', 'restaurant'].includes(word)) embedding[3] += 0.9;
    
    // Size dimension (4)
    if (['big', 'large', 'huge', 'giant', 'massive'].includes(word)) embedding[4] += 0.7;
    if (['small', 'tiny', 'little', 'mini', 'micro'].includes(word)) embedding[4] -= 0.7;
    
    // Time dimension (5)
    if (['past', 'history', 'old', 'ancient', 'yesterday'].includes(word)) embedding[5] -= 0.6;
    if (['future', 'tomorrow', 'new', 'modern', 'next'].includes(word)) embedding[5] += 0.6;
    
    // Formality dimension (6)
    if (['hello', 'hi', 'hey', 'cool', 'awesome'].includes(word)) embedding[6] -= 0.5;
    if (['greetings', 'salutations', 'excellent', 'magnificent'].includes(word)) embedding[6] += 0.5;
    
    // Action dimension (7)
    if (['run', 'jump', 'move', 'action', 'active', 'dynamic'].includes(word)) embedding[7] += 0.8;
    if (['still', 'quiet', 'calm', 'peaceful', 'static'].includes(word)) embedding[7] -= 0.8;
  });
  
  // Add some randomness based on text length and characters for uniqueness
  let seed = text.length;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) % 1000000;
  }
  
  // Normalize and add slight randomness
  return embedding.map((val, i) => {
    const random = ((seed * (i + 1)) % 1000) / 1000 * 0.3 - 0.15;
    return Math.max(-1, Math.min(1, val + random));
  });
}

// Calculate cosine similarity
function calculateSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
}

// Simple 2D projection for visualization (using first two meaningful dimensions)
function projectTo2D(embedding: number[]): { x: number, y: number } {
  // Use a combination of dimensions to create meaningful 2D coordinates
  // X-axis: Sentiment + Technology vs Animals + Food
  const x = (embedding[0] + embedding[2]) - (embedding[1] + embedding[3]);
  // Y-axis: Size + Action vs Time + Formality  
  const y = (embedding[4] + embedding[7]) - (embedding[5] + embedding[6]);
  
  // Scale more dramatically to spread points out and center for SVG
  return { x: x * 80 + 250, y: y * 80 + 200 }; // Increased scale and canvas size
}

// 2D Semantic Space Visualizer
const SemanticSpaceVisualizer = ({ currentText, currentEmbedding }: { 
  currentText: string, 
  currentEmbedding: number[] 
}) => {
  // Predefined examples to show clustering with more diverse and contrasting examples
  const examples = [
    { text: "happy dog", category: "positive animals" },
    { text: "joyful puppy", category: "positive animals" },
    { text: "sad cat", category: "negative animals" },
    { text: "angry wolf", category: "negative animals" },
    { text: "computer programming", category: "technology" },
    { text: "software development", category: "technology" },
    { text: "delicious pizza", category: "food" },
    { text: "tasty burger", category: "food" },
    { text: "huge elephant", category: "large animals" },
    { text: "massive whale", category: "large animals" },
    { text: "tiny ant", category: "small animals" },
    { text: "little mouse", category: "small animals" },
    { text: "ancient history", category: "past time" },
    { text: "future technology", category: "future time" },
  ];

  const examplePoints = examples.map(example => ({
    ...example,
    embedding: generateDemoEmbedding(example.text),
    position: projectTo2D(generateDemoEmbedding(example.text))
  }));

  const currentPosition = currentEmbedding.length > 0 ? projectTo2D(currentEmbedding) : null;

  const getCategoryColor = (category: string) => {
    const colors = {
      "positive animals": "#10b981", // green
      "negative animals": "#ef4444", // red
      "technology": "#3b82f6", // blue
      "food": "#f59e0b", // amber
      "large animals": "#8b5cf6", // purple
      "small animals": "#ec4899", // pink
      "past time": "#6b7280", // gray
      "future time": "#06b6d4", // cyan
    };
    return colors[category as keyof typeof colors] || "#6b7280";
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Semantic Space Map</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This 2D map shows how different concepts cluster together based on their meaning. 
          Similar concepts appear closer together.
        </p>
      </div>

             <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
         <svg width="500" height="400" className="w-full h-auto">
          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
                     {/* Axis labels */}
           <text x="250" y="25" textAnchor="middle" className="text-xs fill-zinc-500">
             Tech/Sentiment ← → Animals/Food
           </text>
           <text x="25" y="200" textAnchor="middle" className="text-xs fill-zinc-500" transform="rotate(-90, 25, 200)">
             Size/Action ← → Time/Formality
           </text>
          
          {/* Example points */}
          {examplePoints.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.position.x}
                cy={point.position.y}
                r="6"
                fill={getCategoryColor(point.category)}
                opacity="0.7"
                className="hover:opacity-100 transition-opacity"
              />
              <text
                x={point.position.x}
                y={point.position.y - 10}
                textAnchor="middle"
                className="text-xs fill-zinc-600 dark:fill-zinc-300 pointer-events-none"
                fontSize="10"
              >
                {point.text}
              </text>
            </g>
          ))}
          
          {/* Current user input */}
          {currentPosition && (
            <g>
              <circle
                cx={currentPosition.x}
                cy={currentPosition.y}
                r="8"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
                className="animate-pulse"
              />
              <text
                x={currentPosition.x}
                y={currentPosition.y - 15}
                textAnchor="middle"
                className="text-xs font-bold fill-red-600 dark:fill-red-400"
                fontSize="11"
              >
                {currentText}
              </text>
            </g>
          )}
        </svg>
        
                 {/* Legend */}
         <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
           {Object.entries({
             "positive animals": "#10b981",
             "negative animals": "#ef4444", 
             "technology": "#3b82f6",
             "food": "#f59e0b",
             "large animals": "#8b5cf6",
             "small animals": "#ec4899",
             "past time": "#6b7280",
             "future time": "#06b6d4"
           }).map(([category, color]) => (
            <div key={category} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                {category.replace(" ", " ")}
              </span>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600 border border-white"></div>
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">Your text</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
        💡 <strong>What you&apos;re seeing:</strong> Words with similar meanings cluster together in this space. 
        The closer two points are, the more similar their meanings. Your text appears as a red dot 
        showing where it fits in this semantic landscape.
      </div>
    </div>
  );
};

// Simple embedding visualizer component
const EmbeddingVisualizer = ({ embedding, text }: { embedding: number[], text: string }) => {
  const dimensionNames = [
    'Sentiment', 'Animals', 'Technology', 'Food', 
    'Size', 'Time', 'Formality', 'Action'
  ];
  
  const getColorForValue = (value: number) => {
    const intensity = Math.abs(value);
    const hue = value >= 0 ? 120 : 0; // Green for positive, red for negative
    return `hsl(${hue}, 70%, ${50 + intensity * 30}%)`;
  };
  
  return (
    <div className="space-y-3">
      <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg">
        <h4 className="font-medium mb-2">Text: &quot;{text}&quot;</h4>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          See how this text is represented as numbers that capture different aspects of meaning:
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {embedding.map((value, index) => (
          <div key={index} className="text-center">
            <div className="text-xs font-medium mb-1">{dimensionNames[index]}</div>
            <div 
              className="h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: getColorForValue(value) }}
            >
              {value.toFixed(2)}
            </div>
            <div className="text-xs mt-1 text-zinc-500">
              {Math.abs(value) > 0.3 ? (value > 0 ? 'Strong +' : 'Strong -') : 'Neutral'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-2 rounded">
        💡 <strong>How to read this:</strong> Each number represents how much this text relates to that concept. 
        Positive numbers (green) mean strong presence, negative numbers (red) mean absence or opposite, 
        and values near zero mean neutral/irrelevant.
      </div>
    </div>
  );
};

// Similarity comparison component
const SimilarityComparison = ({ text1, text2, embedding1, embedding2 }: {
  text1: string, text2: string, embedding1: number[], embedding2: number[]
}) => {
  const similarity = calculateSimilarity(embedding1, embedding2);
  const percentage = Math.round((similarity + 1) * 50); // Convert from [-1,1] to [0,100]
  
  const getSimilarityDescription = (sim: number) => {
    if (sim > 0.8) return { text: "Very Similar", color: "text-green-600" };
    if (sim > 0.5) return { text: "Quite Similar", color: "text-green-500" };
    if (sim > 0.2) return { text: "Somewhat Similar", color: "text-yellow-600" };
    if (sim > -0.2) return { text: "Not Very Similar", color: "text-orange-600" };
    return { text: "Very Different", color: "text-red-600" };
  };
  
  const description = getSimilarityDescription(similarity);
  
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h4 className="font-medium mb-3">Similarity Comparison</h4>
      <div className="space-y-2 mb-3">
        <div className="text-sm"><strong>Text 1:</strong> &quot;{text1}&quot;</div>
        <div className="text-sm"><strong>Text 2:</strong> &quot;{text2}&quot;</div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-4">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className={`font-bold ${description.color}`}>
          {description.text}
        </div>
      </div>
      
      <div className="text-xs mt-2 text-zinc-600 dark:text-zinc-400">
        Similarity score: {similarity.toFixed(3)} (Range: -1 to 1, where 1 means identical meaning)
      </div>
    </div>
  );
};

export default function EmbeddingsDemoClient() {
  const [inputText, setInputText] = useState('happy dog');
  const [compareText, setCompareText] = useState('joyful puppy');
  const [embedding1, setEmbedding1] = useState<number[]>([]);
  const [embedding2, setEmbedding2] = useState<number[]>([]);
  const [expandedSections, setExpandedSections] = useState([false, false, false]);
  const [showComparison, setShowComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus] = useState<'ready'>('ready'); // Using enhanced demo embeddings

  // Generate embeddings when text changes
  useEffect(() => {
    if (inputText.trim()) {
      setIsLoading(true);
      generateRealEmbedding(inputText).then((embedding) => {
        setEmbedding1(embedding);
        setIsLoading(false);
      });
    }
  }, [inputText]);

  useEffect(() => {
    if (compareText.trim()) {
      generateRealEmbedding(compareText).then((embedding) => {
        setEmbedding2(embedding);
      });
    }
  }, [compareText]);

  const toggleSection = (index: number) => {
    const newExpanded = [...expandedSections];
    newExpanded[index] = !newExpanded[index];
    setExpandedSections(newExpanded);
  };

  const handleExampleSelect = (text: string) => {
    setInputText(text);
    track('embeddings_example_selected', { text });
  };

  const handleComparisonExample = (text1: string, text2: string) => {
    setInputText(text1);
    setCompareText(text2);
    setShowComparison(true);
    track('embeddings_comparison_example', { text1, text2 });
  };

  // Educational content sections
  const educationalSections = [
    {
      title: "What are Embeddings?",
      icon: <FiInfo className="text-blue-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Embeddings are like a &quot;fingerprint&quot; for text - they convert words and sentences into lists of numbers 
            that capture their meaning. Similar meanings get similar numbers.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Think of it like this:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Each word gets a unique &quot;address&quot; in a mathematical space</li>
            <li>Words with similar meanings live in the same &quot;neighborhood&quot;</li>
            <li>Computers can find related concepts by looking at nearby &quot;addresses&quot;</li>
              <li>This powers search engines, recommendations, and AI assistants</li>
            </ul>
          </div>
          <div className="flex justify-center py-2">
            <Image 
              src={embedDiagram}
              alt="Text-to-embedding process diagram" 
              className="max-w-full h-auto rounded-lg shadow-md"
              width={400}
              height={200}
            />
          </div>
        </div>
      )
    },
    {
      title: "How Do They Work?",
      icon: <FiTool className="text-orange-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            AI models learn to create embeddings by reading millions of texts and discovering patterns 
            in how words are used together.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Learning Process</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Models learn that &quot;dog&quot; and &quot;puppy&quot; often appear in similar contexts, 
                so they assign them similar embedding values.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Multiple Dimensions</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Each dimension captures different aspects: sentiment, topic, formality, etc. 
                Real embeddings have hundreds of dimensions.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Real-World Applications",
      icon: <FiSearch className="text-green-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Embeddings power many AI applications you use every day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🔍 Smart Search</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Search for "car" and find results about "automobile" or "vehicle" 
                even if they don't contain the exact word.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🤖 AI Assistants</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                ChatGPT and similar tools use embeddings to understand your questions 
                and find relevant information to answer them.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">📱 Recommendations</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Netflix, Spotify, and shopping sites use embeddings to suggest 
                content similar to what you've enjoyed before.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2">🌐 Translation</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Google Translate uses embeddings to understand that "hello" in English 
                has the same meaning as "hola" in Spanish.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 space-y-8">
      {/* Learning Progress */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2">
        {educationalSections.map((section, index) => (
          <button 
            key={index}
            onClick={() => toggleSection(index)}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              expandedSections[index] 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            <span className="whitespace-nowrap">{section.title}</span>
            <span className="ml-1">
              {expandedSections[index] ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
            </span>
          </button>
        ))}
      </div>

      {/* Educational Content Sections */}
      {educationalSections.map((section, index) => (
        expandedSections[index] && (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
              {section.title}
            </h3>
            {section.content}
          </div>
        )
      ))}

      {/* Main Interactive Demo */}
      <div className="space-y-6">
        <div className="flex items-center">
          <FiCode className="text-purple-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
            See Text Become Numbers
          </h3>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Type any text below to see how it gets converted into an embedding - a list of numbers that captures its meaning.
            <strong className="text-blue-600 dark:text-blue-400"> Your text will appear as a red dot on the semantic map below!</strong>
          </p>
          
          {/* Model Status Indicator */}
          <div className="flex items-center space-x-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              modelStatus === 'ready' ? 'bg-green-500' : 
              modelStatus === 'loading' ? 'bg-yellow-500 animate-pulse' : 
              'bg-orange-500'
            }`}></div>
            <span className="text-zinc-500 dark:text-zinc-400">
              Using enhanced demo embeddings with realistic behavior
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white pr-10"
              placeholder="Type any word or phrase..."
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {/* Example buttons */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Try these examples to see how different types of text create different embeddings:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "happy dog", "angry wolf", "computer programming", "delicious pizza",
                "tiny ant", "huge elephant", "ancient history", "future technology"
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleSelect(example)}
                  className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Semantic Space Visualization */}
        {embedding1.length > 0 && (
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center mb-4">
              <FiMap className="text-indigo-500 mr-2" size={20} />
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Semantic Space Visualization
              </h4>
            </div>
            <SemanticSpaceVisualizer currentText={inputText} currentEmbedding={embedding1} />
          </div>
        )}

        {/* Embedding Visualization */}
        {embedding1.length > 0 && (
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <EmbeddingVisualizer embedding={embedding1} text={inputText} />
          </div>
        )}

        {/* Similarity Comparison Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTarget className="text-green-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Compare Meanings
              </h3>
            </div>
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
            >
              {showComparison ? 'Hide' : 'Show'} comparison
              {showComparison ? <FiChevronDown className="ml-1" /> : <FiChevronRight className="ml-1" />}
            </button>
          </div>

          {showComparison && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter a second text to see how similar its meaning is to the first one:
              </p>
              
              <input
                type="text"
                value={compareText}
                onChange={(e) => setCompareText(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white"
                placeholder="Enter text to compare..."
              />

              {/* Comparison example buttons */}
              <div className="space-y-2">
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Try these comparison pairs:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["happy dog", "joyful puppy"],
                    ["sad cat", "angry dog"],
                    ["computer code", "software programming"],
                    ["big elephant", "tiny mouse"]
                  ].map(([text1, text2]) => (
                    <button
                      key={`${text1}-${text2}`}
                      onClick={() => handleComparisonExample(text1, text2)}
                      className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 rounded-md"
                    >
                      "{text1}" vs "{text2}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Similarity visualization */}
              {embedding1.length > 0 && embedding2.length > 0 && (
                <SimilarityComparison 
                  text1={inputText} 
                  text2={compareText}
                  embedding1={embedding1}
                  embedding2={embedding2}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-8">
        <NewsletterWrapper 
          title="Master AI Embeddings & Semantic Search"
          body="Get practical guides on building semantic search, RAG systems, and recommendation engines using embeddings."
          successMessage="Thanks! Check your inbox for embedding resources."
          onSubscribe={() => track('embeddings_newsletter_subscribe')}
          position="embeddings-demo-footer"
        />
      </div>
    </div>
  );
}