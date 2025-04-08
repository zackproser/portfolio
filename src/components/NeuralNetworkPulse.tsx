'use client'

import { useState, useEffect, useMemo } from "react"

export const NeuralNetworkPulse = () => {
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);
  const [nodeInfo, setNodeInfo] = useState<Record<number, { phrase: string, weight: number }>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [specialLine, setSpecialLine] = useState<{from: number, to: number} | null>(null);

  const phrases = useMemo(() => [
    "VSCode", "IntelliSense", "Git", "Terminal", "Debugger",
    "Copilot", "Autocomplete", "Refactor", "Linter", "Snippets",
    "<div>", "function()", "import React", "useState", "async/await",
    "model", "dataset", "prompt", "LLM", "embedding",
    "transformer", "attention", "sequence", "token", "language",
    "neural network", "deep learning", "machine learning", "AI",
    "data science", "computer vision", "natural language processing",
    "speech recognition", "text generation", "image generation",
    
    "How to Fine-tune Llama 3.1", 
    "Cloud GPU Services Reviewed",
    "RAG Evaluation",
    "Chat with My Data using LangChain",
    "How to Create a Custom Alpaca Dataset",
    "Pinecone Reference Architecture",
    "MNIST PyTorch Hand-Drawn Digit Recognizer",
    "Vector Databases Compared",
    "Build a Chatbot That Knows Your Content",
    "What is LoRA and QLoRA?",
    "Lightning.ai Studio for Fine-tuning",
    "Retrieval Augmented Generation",
    "Run Your Own Tech Blog",
    "AI-assisted Development",
    "Codeium vs ChatGPT",
  ], []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const createRandomSpecialLine = () => {
      const from = Math.floor(Math.random() * 15);
      let to = Math.floor(Math.random() * 15);
      while (to === from) {
        to = Math.floor(Math.random() * 15);
      }
      setSpecialLine({ from, to });
    };

    createRandomSpecialLine();

    const specialLineInterval = setInterval(() => {
      createRandomSpecialLine();
    }, 5000);

    const interval = setInterval(() => {
      setPulseNodes(prevNodes => {
        const newNodes: number[] = [...prevNodes];
        const randomNode: number = Math.floor(Math.random() * 30);
        if (!newNodes.includes(randomNode)) {
          newNodes.push(randomNode);
          setNodeInfo(prevInfo => ({
            ...prevInfo,
            [randomNode]: {
              phrase: phrases[Math.floor(Math.random() * phrases.length)],
              weight: Number(Math.random().toFixed(2))
            }
          }));
        }
        if (newNodes.length > 5) {
          newNodes.shift();
        }
        return newNodes;
      });
    }, 250);

    return () => {
      clearInterval(interval);
      clearInterval(specialLineInterval);
    };
  }, [isMounted, phrases]);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isMounted]);

  const nodes = 15;
  const radius = 240;

  if (!isMounted) {
    return (
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading visualization...</div>
      </div>
    );
  }

  const lines = [];
  for (let i = 0; i < nodes; i++) {
    const angle = (i / nodes) * 2 * Math.PI;
    const x1 = radius * Math.cos(angle) + radius;
    const y1 = radius * Math.sin(angle) + radius;
    
    for (let j = 0; j < nodes; j++) {
      const angle2 = (j / nodes) * 2 * Math.PI;
      const x2 = radius * Math.cos(angle2) + radius;
      const y2 = radius * Math.sin(angle2) + radius;
      lines.push({ i, j, x1, y1, x2, y2 });
    }
  }

  const svgContent = (
    <>
      {lines.map(({ i, j, x1, y1, x2, y2 }) => {
        const isSpecialLine = specialLine && 
          ((specialLine.from === i && specialLine.to === j) || 
           (specialLine.from === j && specialLine.to === i));
        
        return (
          <line
            key={`${i}-${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#CBD5E0"
            strokeWidth="1"
            className={`transition-all duration-300 ${
              isSpecialLine ? 'stroke-blue-300 stroke-[3px]' : 
              pulseNodes.includes(i) || pulseNodes.includes(j) ? 'stroke-blue-500 stroke-[2px]' : ''
            }`}
          />
        );
      })}

      {[...Array(nodes)].map((_, i) => {
        const angle = (i / nodes) * 2 * Math.PI;
        const x = radius * Math.cos(angle) + radius;
        const y = radius * Math.sin(angle) + radius;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={pulseNodes.includes(i) ? 12 : 8}
            className={`transition-all duration-300 ${
              specialLine && (specialLine.from === i || specialLine.to === i)
                ? 'fill-blue-300'
                : pulseNodes.includes(i) 
                  ? 'fill-blue-600' 
                  : 'fill-blue-400'
            }`}
          />
        );
      })}
    </>
  );

  return (
    <div className={`relative w-[500px] h-[500px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <svg className="absolute top-0 left-0 w-full h-full">
        {typeof window !== 'undefined' && svgContent}
      </svg>

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
            <div className="bg-blue-100 text-blue-900 px-1 rounded text-xs font-bold animate-pulse mb-1">
              {nodeInfo[i]?.weight}
            </div>
            <div className="bg-blue-600 text-white px-1 rounded text-xs font-bold animate-pulse max-w-[140px] text-center">
              {nodeInfo[i]?.phrase}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 