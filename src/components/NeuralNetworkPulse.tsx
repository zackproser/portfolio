'use client'

import { useState, useEffect } from "react"

export const NeuralNetworkPulse = () => {
  const [pulseNodes, setPulseNodes] = useState<number[]>([]);
  const [nodeInfo, setNodeInfo] = useState<Record<number, { phrase: string, weight: number }>>({});
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const phrases = [
    "VSCode", "IntelliSense", "Git", "Terminal", "Debugger",
    "Copilot", "Autocomplete", "Refactor", "Linter", "Snippets",
    "<div>", "function()", "import React", "useState", "async/await"
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

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

    return () => clearInterval(interval);
  }, [isMounted, phrases]);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isMounted]);

  const nodes = 15;
  const radius = 240;

  // Don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="w-[600px] h-[600px] flex items-center justify-center">
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

  // Create SVG content only after mounting
  const svgContent = (
    <>
      {lines.map(({ i, j, x1, y1, x2, y2 }) => (
        <line
          key={`${i}-${j}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#A0AEC0"
          strokeWidth="1"
          className={`transition-all duration-300 ${
            pulseNodes.includes(i) || pulseNodes.includes(j) ? 'stroke-green-400 stroke-[1.5px]' : ''
          }`}
        />
      ))}

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
              pulseNodes.includes(i) 
                ? 'fill-green-400' 
                : 'fill-blue-500'
            }`}
          />
        );
      })}
    </>
  );

  return (
    <div className={`relative w-[600px] h-[600px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
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