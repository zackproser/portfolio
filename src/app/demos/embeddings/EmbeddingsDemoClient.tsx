'use client'

import { useState, useEffect, lazy, Suspense } from 'react';
import { FiInfo, FiBook, FiTool, FiCode, FiDatabase, FiSearch, FiChevronDown, FiChevronRight, FiHelpCircle, FiPlay, FiCheck } from 'react-icons/fi';
import Image from 'next/image';
import embedDiagram from '@/images/neural-network-transform.webp';
import { track } from '@vercel/analytics';
import NewsletterWrapper from '@/components/NewsletterWrapper';
import dynamic from 'next/dynamic';

// Add keyframes for the animation
const animateFadeInUp = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out forwards;
}
`;

// Update VectorSpaceVisualizer import to pass defaultMethod='pca'
const VectorSpaceVisualizer = dynamic(
  () => import('./components/VectorSpaceVisualizer').then(mod => {
    // Return a wrapper component that passes defaultMethod='pca'
    const EnhancedVisualizer = (props: any) => <mod.default defaultMethod="pca" {...props} />;
    return { default: EnhancedVisualizer };
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg h-[450px] flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400">
          Loading vector space visualization...
        </div>
      </div>
    )
  }
);

interface EmbeddingVisualizerProps {
  embeddings: number[];
  inputText: string;
}

interface EmbeddingExampleProps {
  text1: string;
  text2: string;
  similarity: number;
}

const getColorForValue = (value: number) => {
  // Scale from -1 to 1 to hue from 240 (blue) to 0 (red)
  const hue = 120 + (value * 120);
  return `hsl(${hue}, 70%, 60%)`;
};

function getRandomVector(dimension: number = 20): number[] {
  return Array.from({ length: dimension }, () => (Math.random() * 2 - 1));
}

// Mini component to show a portion of the vector in a more readable way
const EmbeddingVisualizer = ({ embeddings, inputText }: EmbeddingVisualizerProps) => {
  // If we have a lot of dimensions, just show a subset
  const displayDimensions = embeddings.slice(0, 20);
  
  // Possible interpretations of dimensions - these are illustrative only
  // Real embeddings don't have such clear semantic interpretations
  const dimensionDescriptions = [
    "Might relate to sentiment (positive/negative)",
    "Could capture subject vs object orientation",
    "May represent formal vs informal language",
    "Possibly related to abstract vs concrete concepts",
    "Could indicate temporal aspects (past/future)",
    "Might represent active vs passive voice",
    "May capture technical vs non-technical language",
    "Possibly related to animate vs inanimate subjects",
    "Could indicate question vs statement structure",
    "Might represent personal vs impersonal language",
    "May capture descriptive vs functional language",
    "Possibly related to numeric vs textual content",
    "Could indicate geographic references",
    "Might represent action vs state descriptions",
    "May capture definiteness/indefiniteness",
    "Possibly related to figurative vs literal language",
    "Could indicate singular vs plural concepts",
    "Might represent hypothetical vs factual statements",
    "May capture domain-specific terminology",
    "Possibly related to narrative vs argumentative text"
  ];
  
  // Function to format dimension values more effectively
  const formatDimensionValue = (value: number) => {
    // For values very close to zero, show more decimal places to reveal actual value
    if (Math.abs(value) < 0.1) {
      return value.toFixed(4);
    }
    
    // For other values, show 2 decimal places
    return value.toFixed(2);
  };
  
  // Calculate the min and max values to determine color scaling
  const minValue = Math.min(...displayDimensions);
  const maxValue = Math.max(...displayDimensions);
  
  return (
    <div className="w-full">
      {/* Show full input text before the visualization */}
      <div className="mb-4 p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
        <h4 className="text-sm font-medium mb-1">Source Text:</h4>
        <p className="text-sm break-words">{inputText || "Your text"}</p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-1 pb-1 border-b border-zinc-200 dark:border-zinc-700">
            {displayDimensions.map((_, index) => (
              <div key={index} className="flex-shrink-0 w-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
                <span className="group relative">
                  Dim {index+1}
                  <span className="absolute hidden group-hover:block bg-zinc-800 text-white text-xs p-2 rounded w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10">
                    {dimensionDescriptions[index] || "This dimension has no specific human interpretation"}
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></span>
                  </span>
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-1 items-center">
            <div className="min-w-[50px] text-sm font-medium pr-2">
              Values:
            </div>
            {displayDimensions.map((value, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 w-12 h-10 flex items-center justify-center text-white text-xs rounded group relative"
                style={{ backgroundColor: getColorForValue(value) }}
                title={`Dimension ${index+1}: ${value.toFixed(6)}`}
              >
                {formatDimensionValue(value)}
                <span className="absolute hidden group-hover:block bg-zinc-800 text-white text-xs p-2 rounded w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10">
                  <span className="font-semibold">Value: {value.toFixed(6)}</span><br/>
                  <span className="text-zinc-300">
                    {value > 0.5 ? "Strongly positive" : 
                     value > 0.1 ? "Moderately positive" : 
                     value > -0.1 ? "Neutral" : 
                     value > -0.5 ? "Moderately negative" : "Strongly negative"}
                  </span><br/>
                  <span className="text-zinc-400 text-[10px]">{dimensionDescriptions[index]}</span>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <details className="mt-1">
        <summary className="cursor-pointer font-medium">What do these dimensions mean?</summary>
        <div className="pl-4 pt-2 space-y-1">
          <p>These dimensions don&apos;t have specific interpretable meanings - they&apos;re learned by the model during training.</p>
          <p>Unlike manually created features, embedding dimensions capture complex patterns that represent various semantic aspects of the text.</p>
          <p>What matters is how these values position the text in the embedding space, creating a mathematical representation of meaning.</p>
          <p className="text-xs italic mt-1">The tooltips show possible interpretations for educational purposes, but real models don&apos;t have such clear semantic dimensions.</p>
        </div>
      </details>
      <p className="mt-1">Real embeddings typically have hundreds or thousands of dimensions - this is just a small sample.</p>
    </div>
  );
};

// Component to show example similarity between embeddings - updated with more concrete examples
const EmbeddingSimilarityExample = ({ text1, text2, similarity }: EmbeddingExampleProps) => {
  const getSimilarityLevel = (value: number) => {
    if (value >= 0.9) return "Very High";
    if (value >= 0.7) return "High";
    if (value >= 0.5) return "Moderate";
    if (value >= 0.3) return "Low";
    return "Very Low";
  };

  const similarityLevel = getSimilarityLevel(similarity);
  
  return (
    <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium text-zinc-800 dark:text-zinc-200">
          <span className="mr-2">Similarity: {(similarity * 100).toFixed(1)}%</span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            similarity >= 0.7 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            similarity >= 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {similarityLevel}
          </span>
        </div>
        <div 
          className="w-16 h-4 rounded-full" 
          style={{
            background: `linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)`,
            backgroundSize: '100% 100%',
            backgroundPosition: `${(similarity * 100)}% 0`
          }}
        >
          <div 
            className="w-3 h-3 rounded-full bg-white border border-zinc-300 dark:border-zinc-500 transform translate-y-0.5" 
            style={{ marginLeft: `calc(${similarity * 100}% - 6px)` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-2 bg-zinc-200 dark:bg-zinc-600 rounded">
          &quot;{text1}&quot;
        </div>
        <div className="p-2 bg-zinc-200 dark:bg-zinc-600 rounded">
          &quot;{text2}&quot;
        </div>
      </div>
    </div>
  );
};

interface QuickStartStepProps {
  number: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const QuickStartStep = ({ number, title, isCompleted, isActive, onClick }: QuickStartStepProps) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center p-3 w-full text-left rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 dark:bg-blue-900' 
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-700'
      }`}
    >
      <div className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
        isCompleted 
          ? 'bg-green-500 text-white' 
          : isActive 
            ? 'bg-blue-500 text-white' 
            : 'bg-zinc-200 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-300'
      }`}>
        {isCompleted ? <FiCheck size={14} /> : <span>{number}</span>}
      </div>
      <span className={`font-medium ${
        isActive ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'
      }`}>
        {title}
      </span>
    </button>
  );
};

const QuickStartTutorial = ({ onStepClick, activeStep, completedSteps }: {
  onStepClick: (step: number) => void;
  activeStep: number;
  completedSteps: boolean[];
}) => {
  const steps = [
    "Enter a word or phrase",
    "Generate its embedding",
    "Explore the vector space",
    "Try different examples"
  ];

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
      <div className="flex items-center mb-3">
        <FiPlay className="text-green-500 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Quick Start Guide</h3>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        Follow these steps to understand how computers translate words into a code they can understand:
      </p>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <QuickStartStep 
            key={index}
            number={index + 1}
            title={step}
            isCompleted={completedSteps[index]}
            isActive={activeStep === index}
            onClick={() => onStepClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default function EmbeddingsDemoClient() {
  const [inputText, setInputText] = useState('');
  const [embeddings, setEmbeddings] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState([false, false, false, false]);
  const [selectedModel, setSelectedModel] = useState('text-embedding-ada-002');
  const [showSimilarityExamples, setShowSimilarityExamples] = useState(false);
  const [demoEmbeddings, setDemoEmbeddings] = useState<{[key: string]: number[]}>({});
  const [quickStartStep, setQuickStartStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false]);
  const [interactedWithDemo, setInteractedWithDemo] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // Move handleExampleSelect declaration above its usage
  const handleExampleSelect = (text: string) => {
    setInputText(text);
    // Mark example step as completed
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[3] = true;
    setCompletedSteps(newCompletedSteps);
    
    // For demo purposes, immediately show embeddings for examples
    if (Object.keys(demoEmbeddings).includes(text.toLowerCase())) {
      setEmbeddings(demoEmbeddings[text.toLowerCase()]);
    } else {
      // For other examples, generate random embeddings
      setEmbeddings(getRandomVector(20));
    }
  };

  useEffect(() => {
    const examples = {
      // Animals - cluster 1
      "dog": getRandomVector(),
      "puppy": getRandomVector(),
      "cat": getRandomVector(),
      "kitten": getRandomVector(),
      "animal": getRandomVector(),
      
      // Technology - cluster 2
      "computer": getRandomVector(),
      "laptop": getRandomVector(),
      "smartphone": getRandomVector(),
      "technology": getRandomVector(),
      
      // Places - cluster 3
      "paris": getRandomVector(),
      "france": getRandomVector(),
      "tokyo": getRandomVector(),
      "japan": getRandomVector(),
      "travel": getRandomVector(),
      
      // Food - cluster 4
      "pizza": getRandomVector(),
      "pasta": getRandomVector(),
      "sushi": getRandomVector(),
      "food": getRandomVector(),
    };
    
    // Create clear semantic clusters by making similar concepts have similar vectors
    // Animal cluster
    const animalBase = examples.animal;
    examples.dog = animalBase.map((v, i) => v * 0.8 + Math.random() * 0.2);
    examples.puppy = examples.dog.map((v, i) => v * 0.9 + Math.random() * 0.1);
    examples.cat = animalBase.map((v, i) => v * 0.7 + Math.random() * 0.3);
    examples.kitten = examples.cat.map((v, i) => v * 0.9 + Math.random() * 0.1);
    
    // Technology cluster
    const techBase = examples.technology;
    examples.computer = techBase.map((v, i) => v * 0.8 + Math.random() * 0.2);
    examples.laptop = examples.computer.map((v, i) => v * 0.9 + Math.random() * 0.1);
    examples.smartphone = techBase.map((v, i) => v * 0.7 + Math.random() * 0.3);
    
    // Places cluster
    const travelBase = examples.travel;
    examples.paris = travelBase.map((v, i) => v * 0.7 + Math.random() * 0.3);
    examples.france = examples.paris.map((v, i) => v * 0.85 + Math.random() * 0.15);
    examples.tokyo = travelBase.map((v, i) => v * 0.65 + Math.random() * 0.35);
    examples.japan = examples.tokyo.map((v, i) => v * 0.85 + Math.random() * 0.15);
    
    // Food cluster
    const foodBase = examples.food;
    examples.pizza = foodBase.map((v, i) => v * 0.75 + Math.random() * 0.25);
    examples.pasta = foodBase.map((v, i) => v * 0.7 + Math.random() * 0.3);
    examples.sushi = foodBase.map((v, i) => v * 0.65 + Math.random() * 0.35);
    
    setDemoEmbeddings(examples);
    
    // Pre-select a default example to show visualization immediately
    handleExampleSelect("dog");
  }, []);

  useEffect(() => {
    const newCompletedSteps = [...completedSteps];
    
    // Step 1: Enter a word or phrase
    if (inputText.trim().length > 0 && !newCompletedSteps[0]) {
      newCompletedSteps[0] = true;
    }
    
    // Step 2: Generate embedding
    if (embeddings.length > 0 && !newCompletedSteps[1]) {
      newCompletedSteps[1] = true;
    }
    
    // Only update state if there are changes
    if (JSON.stringify(newCompletedSteps) !== JSON.stringify(completedSteps)) {
      setCompletedSteps(newCompletedSteps);
    }
    
    // We'll track steps 3 and 4 with manual triggers when user interacts with those sections
  }, [inputText, embeddings]); // Remove completedSteps from dependencies to prevent loop

  // Simplify the useEffect that previously tracked progress
  useEffect(() => {
    // Show newsletter modal after meaningful interaction
    if (embeddings.length > 0 && completedSteps[2] && !showNewsletterModal && !interactedWithDemo) {
      setInteractedWithDemo(true);
      setTimeout(() => {
        setShowNewsletterModal(true);
      }, 2000);
    }
  }, [embeddings, completedSteps, interactedWithDemo, showNewsletterModal]);
  
  // Handle newsletter modal close
  const handleCloseNewsletterModal = () => {
    setShowNewsletterModal(false);
  };

  // Toggle section expansion
  const toggleSection = (index: number) => {
    const newExpandedSections = [...expandedSections];
    newExpandedSections[index] = !newExpandedSections[index];
    setExpandedSections(newExpandedSections);
    
    if (index === 3 && !newExpandedSections[index]) {
      setShowSimilarityExamples(false);
    }
  };

  // Handler for quick start step clicks
  const handleQuickStartStepClick = (step: number) => {
    setQuickStartStep(step);
    
    // Scroll to relevant section based on step
    const scrollTargets = [
      'input-section',     // Step 1: Enter text
      'generate-button',   // Step 2: Generate embedding
      'vector-space-section', // Step 3: Explore vector space
      'examples-section'   // Step 4: Try examples
    ];
    
    const targetElement = document.getElementById(scrollTargets[step]);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Track vector space interaction
  const handleVectorSpaceInteraction = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[2] = true;
    setCompletedSteps(newCompletedSteps);
  };
  
  const handleGenerateEmbeddings = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputText,
          model: selectedModel 
        }),
      });

      const data = await response.json();
      if (data && data.embeddings) {
        setEmbeddings(data.embeddings);
        track('embeddings_generated', { model: selectedModel, textLength: inputText.length });

        // Calculate similarity/dissimilarity with existing embeddings
        const similarities = Object.entries(demoEmbeddings).map(([key, vector]) => ({
          key,
          similarity: calculateSimilarity(data.embeddings, vector)
        }));

        // Log or visualize similarities as needed
        console.log('Similarities:', similarities);
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      setEmbeddings(getRandomVector(20));
    } finally {
      setIsLoading(false);
      setQuickStartStep(2);
    }
  };

  // Calculate cosine similarity between two vectors
  const calculateSimilarity = (vec1: number[], vec2: number[]): number => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (mag1 * mag2);
  };

  // Educational content sections - Updated with simplified analogies
  const educationalSections = [
    {
      title: "What are Embeddings?",
      icon: <FiInfo className="text-blue-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Embeddings translate words into a &apos;code&apos; computers understand, where similar words (e.g., &apos;dog&apos; and &apos;puppy&apos;) are grouped closer in a hidden map.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Why embeddings matter:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>They create a &quot;search by meaning&quot; system (beyond just keywords)</li>
              <li>Allow computers to find similar concepts automatically</li>
              <li>Power recommendation systems (&quot;you might also like...&quot;)</li>
              <li>Help AI systems retrieve knowledge to answer questions accurately</li>
            </ul>
          </div>
          <div className="flex justify-center py-2">
            <Image 
              src={embedDiagram}
              alt="Text-to-embedding process diagram" 
              className="max-w-full h-auto rounded-lg shadow-md"
              width={500}
              height={300}
              style={{ height: 'auto' }}
            />
          </div>
          <div className="text-sm bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="font-medium text-blue-700 dark:text-blue-300">Think of it like this:</span> Imagine a vast library where books are shelved not by author or title, but by meaning. Books about dogs are near books about pets, cooking books near recipe books. This is what embeddings do for AI—organize information by meaning!
          </div>
        </div>
      )
    },
    {
      title: "How Embeddings Work",
      icon: <FiTool className="text-orange-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Embedding models transform text into high-dimensional vectors where semantic similarities become geometric relationships.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Vector Space Mapping</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Words and concepts with similar meanings are placed close together in the vector space. This creates a mathematical representation where semantic relationships become geometric relationships.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Dimensionality</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Most embedding models produce vectors with hundreds or thousands of dimensions. The OpenAI text-embedding-ada-002 model produces 1,536-dimensional vectors. These dimensions capture different semantic features of the text.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Measuring Similarity",
      icon: <FiSearch className="text-purple-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Cosine similarity is the most common way to measure how similar two embeddings are. It measures the cosine of the angle between two vectors.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Similarity in embeddings:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>1.0 (100%) means identical semantic meaning</li>
              <li>0.7-0.9 (70-90%) indicates strong semantic relatedness</li>
              <li>0.4-0.6 (40-60%) suggests moderate similarity</li>
              <li>Below 0.3 (30%) typically means minimal relationship</li>
              <li>0.0 means completely unrelated</li>
            </ul>
          </div>
          <button
            onClick={() => setShowSimilarityExamples(!showSimilarityExamples)}
            className="mt-2 text-blue-600 dark:text-blue-400 text-sm flex items-center"
          >
            {showSimilarityExamples ? 'Hide examples' : 'Show examples'} 
            {showSimilarityExamples ? <FiChevronDown className="ml-1" /> : <FiChevronRight className="ml-1" />}
          </button>
          
          {showSimilarityExamples && (
            <div className="grid grid-cols-1 gap-3 mt-2">
              <EmbeddingSimilarityExample 
                text1="dog" 
                text2="puppy" 
                similarity={0.92} 
              />
              <EmbeddingSimilarityExample 
                text1="computer" 
                text2="laptop" 
                similarity={0.85} 
              />
              <EmbeddingSimilarityExample 
                text1="paris" 
                text2="france" 
                similarity={0.75} 
              />
              <EmbeddingSimilarityExample 
                text1="computer" 
                text2="smartphone" 
                similarity={0.65} 
              />
              <EmbeddingSimilarityExample 
                text1="happy" 
                text2="sad" 
                similarity={0.15} 
              />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Applications",
      icon: <FiDatabase className="text-green-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Embeddings power a wide range of AI applications that require understanding semantic meaning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Semantic Search</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Find relevant documents based on meaning rather than just keywords. Used in advanced search engines and RAG (Retrieval-Augmented Generation) systems.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">RAG Systems</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Retrieval-Augmented Generation enhances LLMs by retrieving relevant information from a knowledge base using embeddings, significantly improving their factual accuracy.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Recommendation Systems</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Suggest similar products, content, or services by finding items with embeddings similar to ones the user has shown interest in.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Content Clustering</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Automatically organize and categorize content by grouping items with similar embeddings, useful for content discovery and organization.
              </p>
            </div>
          </div>
        </div>
      )
    },
  ];

  // Add a section to explain semantic clustering
  const SemanticClusteringExplanation = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
        Understanding Semantic Clustering
      </h3>
      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
        Notice how semantically related words form distinct clusters in the vector space:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-blue-900/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Words vs. Concepts</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Embeddings capture meaning, not just spelling. &quot;Dog&quot; and &quot;puppy&quot; cluster together because they represent similar concepts, not because the words look similar.
          </p>
        </div>
        <div className="bg-white dark:bg-blue-900/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Hierarchy of Meaning</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            More specific concepts (&quot;kitten&quot;) appear closer to their parent category (&quot;cat&quot;) than to other categories (&quot;technology&quot;). This reflects real-world taxonomy.
          </p>
        </div>
        <div className="bg-white dark:bg-blue-900/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Geographic Relationships</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            &quot;Paris&quot; is closer to &quot;France&quot; than to &quot;Japan&quot;, showing how embeddings capture real-world relationships between places and countries.
          </p>
        </div>
        <div className="bg-white dark:bg-blue-900/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Concept Distance</h4>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            The distance between &quot;food&quot; and &quot;animal&quot; clusters shows semantic separation, while terms like &quot;sushi&quot; might show some relationship to &quot;japan&quot; across categories.
          </p>
        </div>
      </div>
    </div>
  );

  // Add predefined phrases for users to select
  const predefinedPhrases = [
    "The quick brown fox jumps over the lazy dog",
    "A fast auburn fox leaps above a sleepy canine",
    "Rapid tan foxes vault over lethargic hounds",
    "Swift chestnut foxes bound over sluggish dogs"
  ];

  // Function to handle phrase selection
  const handlePhraseSelect = (phrase: string) => {
    setInputText(phrase);
    handleGenerateEmbeddings();
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 space-y-8">
      {/* Add the animation style */}
      <style jsx global>{animateFadeInUp}</style>
      
      {/* Vector Space Visualization */}
      <div id="vector-space-section" className="space-y-4">
        <div className="flex items-center mb-4">
          <FiSearch className="text-green-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Vector Space Explorer</h3>
        </div>
        
        <SemanticClusteringExplanation />

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Explore how embeddings position words in a multi-dimensional space, where related concepts naturally cluster together.
        </p>
        
        <VectorSpaceVisualizer 
          embeddings={demoEmbeddings} 
          currentEmbedding={embeddings} 
          currentLabel={inputText || "Your input"}
          onInteraction={handleVectorSpaceInteraction}
        />
        
        {/* Predefined Phrases Section */}
        <div className="mt-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">Select a Phrase to Explore</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            Choose from the following phrases to see how they are positioned in the vector space:
          </p>
          <div className="space-y-3">
            {predefinedPhrases.map((phrase) => (
              <button
                key={phrase}
                className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md"
                onClick={() => handlePhraseSelect(phrase)}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Content Sections */}
      {educationalSections.map((section, index) => (
        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
          <button 
            onClick={() => toggleSection(index)}
            className="flex items-center w-full text-left"
          >
            <span className="mr-2">{section.icon}</span>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-3">
              {section.title}
            </h3>
            <span className="ml-1">
              {expandedSections[index] ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
            </span>
          </button>
          {expandedSections[index] && section.content}
        </div>
      ))}

      {/* Embedding Dimensions */}
      {embeddings.length > 0 && inputText && !Object.keys(demoEmbeddings).includes(inputText.toLowerCase()) && (
        <div id="dimensions-section" className="mt-6 mb-6">
          <div className="flex items-center mb-4">
            <FiCode className="text-purple-500 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Embedding Dimensions</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            See the raw numerical values of the embedding vector across its dimensions.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
            <EmbeddingVisualizer embeddings={embeddings} inputText={inputText} />
          </div>
        </div>
      )}

      {/* Add an input field for user phrases */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-2">Enter a Word or Phrase</h3>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md"
          placeholder="Type a word or phrase..."
        />
        <button
          onClick={handleGenerateEmbeddings}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Visualize
        </button>
      </div>
    </div>
  );
}