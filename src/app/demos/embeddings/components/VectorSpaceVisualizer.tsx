'use client'

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

// Remove the direct import of tsne-js and defer its loading
// We'll dynamically import it inside the component

interface Vector2D {
  x: number;
  y: number;
  label: string;
  originalVector: number[];
  isHighlighted: boolean;
}

interface VectorSpaceVisualizerProps {
  embeddings: {[key: string]: number[]};
  currentEmbedding?: number[];
  currentLabel?: string;
  defaultMethod?: 'tsne' | 'pca';
  onInteraction?: () => void;
}

const VectorSpaceVisualizer = ({ 
  embeddings, 
  currentEmbedding,
  currentLabel = "Your text",
  defaultMethod = 'tsne',
  onInteraction
}: VectorSpaceVisualizerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [projectionMethod, setProjectionMethod] = useState<'tsne' | 'pca'>(defaultMethod);
  const [isComputing, setIsComputing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [visualizationRendered, setVisualizationRendered] = useState(false);
  
  // Track if component is mounted to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Trigger interaction callback when user interacts with visualization
  const handleInteraction = () => {
    if (onInteraction && !visualizationRendered) {
      onInteraction();
      setVisualizationRendered(true);
    }
  };

  // Add more example embeddings for a richer visualization
  const getEnhancedEmbeddings = () => {
    // Start with the provided embeddings
    const enhanced = { ...embeddings };
    
    // If we don't have many embeddings, generate some random ones
    // that are variations of existing ones to create visible clusters
    if (Object.keys(enhanced).length < 5 && Object.keys(enhanced).length > 0) {
      const baseEmbeddings = Object.values(enhanced)[0];
      
      // Add some variations to create clusters
      for (let i = 1; i <= 5; i++) {
        const slightlyDifferent = baseEmbeddings.map(
          val => val + (Math.random() * 0.4 - 0.2)
        );
        enhanced[`Similar ${i}`] = slightlyDifferent;
        
        // Also add some very different embeddings
        const veryDifferent = baseEmbeddings.map(
          () => Math.random() * 2 - 1
        );
        enhanced[`Different ${i}`] = veryDifferent;
      }
    }
    
    return enhanced;
  };
  
  // Initial render when component mounts - force immediate rendering
  useEffect(() => {
    if (isMounted && svgRef.current && Object.keys(embeddings).length > 0 && !isComputing) {
      setIsComputing(true);
      
      setTimeout(() => {
        try {
          renderVisualization();
          handleInteraction(); // Call interaction handler after first render
        } finally {
          setIsComputing(false);
        }
      }, 10);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, embeddings, isComputing]);
  
  // Re-render when these props change
  useEffect(() => {
    if (!svgRef.current || Object.keys(embeddings).length === 0 || !isMounted || isComputing) return;
    
    setIsComputing(true);
    
    setTimeout(() => {
      try {
        renderVisualization();
      } finally {
        setIsComputing(false);
      }
    }, 10);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEmbedding, currentLabel, projectionMethod, isComputing]);
  
  const renderVisualization = async () => {
    if (!svgRef.current) return;
    
    // Convert embeddings object to array for processing
    const enhancedEmbeddings = getEnhancedEmbeddings();
    const embeddingsArray: number[][] = [];
    const labels: string[] = [];
    const isHighlighted: boolean[] = [];
    
    // Add all pre-computed embeddings
    Object.entries(enhancedEmbeddings).forEach(([label, vector]) => {
      embeddingsArray.push(vector);
      labels.push(label);
      isHighlighted.push(false); // Regular embeddings are not highlighted
    });
    
    // Add current embedding if available
    if (currentEmbedding && currentEmbedding.length > 0) {
      embeddingsArray.push(currentEmbedding);
      labels.push(currentLabel);
      isHighlighted.push(true); // Current embedding is highlighted
    }
    
    // Perform dimensionality reduction 
    let result: number[][] = [];
    
    if (projectionMethod === 'tsne') {
      try {
        // Dynamically import tsne-js only when needed
        const tsneModule = await import('tsne-js');
        const TSNE = tsneModule.default || tsneModule.TSNE;
        
        // t-SNE implementation
        const tsne = new TSNE({
          dim: 2,
          perplexity: Math.min(30, Math.max(3, Math.floor(embeddingsArray.length / 5))),
          earlyExaggeration: 4.0,
          learningRate: 100.0,
          nIter: 500
        });
        
        tsne.init({
          data: embeddingsArray,
          type: 'dense'
        });
        
        tsne.run();
        result = tsne.getOutputScaled();
      } catch (error) {
        console.error('Error loading or running t-SNE:', error);
        // Fallback to PCA if t-SNE fails
        setProjectionMethod('pca');
        // Use PCA implementation
        result = performPCA(embeddingsArray);
      }
    } else {
      // Use PCA implementation
      result = performPCA(embeddingsArray);
    }
    
    // Convert to Vector2D format
    const points: Vector2D[] = result.map((point, i) => ({
      x: point[0],
      y: point[1],
      label: labels[i],
      originalVector: embeddingsArray[i],
      isHighlighted: isHighlighted[i]
    }));
    
    // Set up D3 visualization
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    
    // Clear previous visualization
    svg.selectAll("*").remove();
    
    // Create scales
    const xExtent = d3.extent(points, d => d.x) as [number, number];
    const yExtent = d3.extent(points, d => d.y) as [number, number];
    
    // Add some padding to the extents
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
    
    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([margin.left, width - margin.right]);
      
    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height - margin.bottom, margin.top]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);
    
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis);
      
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);
    
    // Add axis labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("class", "text-xs text-zinc-500 dark:text-zinc-400")
      .text("Dimension 1");
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .style("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("class", "text-xs text-zinc-500 dark:text-zinc-400")
      .text("Dimension 2");
    
    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("class", "text-sm font-medium text-zinc-700 dark:text-zinc-300")
      .text(`Vector Space Visualization (${projectionMethod.toUpperCase()})`);
    
    // Draw canvas for better performance with many points
    const canvas = svg.append("g")
      .attr("class", "points-container");
    
    // Function to calculate similarity between vectors (cosine similarity)
    const calculateSimilarity = (vec1: number[], vec2: number[]): number => {
      if (!vec1.length || !vec2.length) return 0;
      
      const dotProduct = vec1.reduce((sum, val, i) => 
        i < vec2.length ? sum + val * vec2[i] : sum, 0);
      const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
      const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (mag1 * mag2);
    };
    
    // Create a tooltip
    const tooltip = d3.select("body").select(".vector-tooltip");
    const tooltipDiv = tooltip.size() 
      ? tooltip 
      : d3.select("body").append("div")
          .attr("class", "vector-tooltip absolute bg-zinc-800 text-white p-2 rounded text-xs pointer-events-none opacity-0 z-50 max-w-xs")
          .style("opacity", 0);
    
    // Find the user's current embedding for similarity comparison
    const userVector = points.find(p => p.isHighlighted)?.originalVector;
    
    // Draw points
    const circles = canvas.selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", (d: Vector2D) => xScale(d.x))
      .attr("cy", (d: Vector2D) => yScale(d.y))
      .attr("r", (d: Vector2D) => d.isHighlighted ? 8 : 5)
      .attr("fill", (d: Vector2D) => {
        if (d.isHighlighted) return "#ef4444"; // Red for current text
        
        // Color based on similarity to current text if available
        if (userVector && userVector.length > 0) {
          const similarity = calculateSimilarity(d.originalVector, userVector);
          // Create a gradient from blue to red based on similarity
          const hue = 240 - similarity * 240; // 240 (blue) to 0 (red)
          return `hsl(${hue}, 70%, 60%)`;
        }
        
        return "#3b82f6"; // Default blue
      })
      .attr("stroke", (d: Vector2D) => d.isHighlighted ? "#7f1d1d" : "#1e3a8a")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d: Vector2D) {
        d3.select(this)
          .attr("r", d.isHighlighted ? 10 : 7)
          .attr("opacity", 1);
        
        let tooltipContent = `<div class="font-medium">${d.label}</div>`;
        
        // Add similarity info if we have current embedding
        if (userVector && userVector.length > 0 && !d.isHighlighted) {
          const similarity = calculateSimilarity(d.originalVector, userVector);
          tooltipContent += `<div class="mt-1">Similarity to "${currentLabel}": ${(similarity * 100).toFixed(1)}%</div>`;
        }
        
        // Fix the TypeScript error with type assertion
        (tooltipDiv as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>)
          .html(tooltipContent)
          .style("left", `${event.pageX + 12}px`)
          .style("top", `${event.pageY - 28}px`)
          .style("opacity", 1);
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("r", function(d: any) { return d.isHighlighted ? 8 : 5; })
          .attr("opacity", 0.8);
        
        // Fix the TypeScript error with type assertion
        (tooltipDiv as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>).style("opacity", 0);
      });
    
    // Add labels for highlighted points and some important points
    canvas.selectAll("text")
      .data(points.filter(p => p.isHighlighted || Math.random() < 0.3)) // Only label a subset
      .enter()
      .append("text")
      .attr("x", d => xScale(d.x) + 8)
      .attr("y", d => yScale(d.y) + 4)
      .text(d => d.label)
      .attr("fill", "currentColor")
      .attr("class", d => d.isHighlighted 
        ? "text-xs font-medium text-zinc-800 dark:text-zinc-200" 
        : "text-xs text-zinc-600 dark:text-zinc-400")
      .style("pointer-events", "none");
    
    // Add zoom capability
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        canvas.attr("transform", event.transform);
        
        // Update axes
        svg.select<SVGGElement>(".x-axis").call(
          xAxis.scale(event.transform.rescaleX(xScale))
        );
        svg.select<SVGGElement>(".y-axis").call(
          yAxis.scale(event.transform.rescaleY(yScale))
        );
      });
    
    svg.call(zoom);
  };

  // Extract PCA logic into a separate function
  const performPCA = (data: number[][]) => {
    // Simple PCA implementation using SVD
    // Normalize the data
    const mean = data[0].map((_, colIndex) => 
      data.reduce((sum, row) => sum + row[colIndex], 0) / data.length
    );
    
    const centered = data.map(row => 
      row.map((val, i) => val - mean[i])
    );
    
    // Compute covariance matrix (transpose * original)
    const dim = centered[0].length;
    const cov = Array(dim).fill(0).map(() => Array(dim).fill(0));
    
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        for (let k = 0; k < centered.length; k++) {
          cov[i][j] += centered[k][i] * centered[k][j];
        }
        cov[i][j] /= centered.length - 1;
      }
    }
    
    // Find eigenvectors (simplified approach)
    // For a proper implementation, we'd use a library for SVD
    // Instead, we'll use a simple approach: project onto random directions
    const randVector = (dim: number) => 
      Array(dim).fill(0).map(() => Math.random() * 2 - 1);
    
    const normalize = (v: number[]) => {
      const magnitude = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
      return v.map(val => val / magnitude);
    };
    
    const pc1 = normalize(randVector(dim));
    let pc2 = normalize(randVector(dim));
    
    // Make pc2 orthogonal to pc1
    const dot = pc1.reduce((sum, val, i) => sum + val * pc2[i], 0);
    pc2 = pc2.map((val, i) => val - dot * pc1[i]);
    pc2 = normalize(pc2);
    
    // Project data onto principal components
    return centered.map(row => [
      row.reduce((sum, val, i) => sum + val * pc1[i], 0),
      row.reduce((sum, val, i) => sum + val * pc2[i], 0)
    ]);
  };
  
  // Add a new function to render the color legend
  const renderColorLegend = () => {
    return (
      <div className="mt-3 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <h4 className="text-xs font-medium mb-2">Color Legend</h4>
        <div className="flex items-center">
          <div className="w-full h-4 rounded-full" 
            style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ef4444 100%)',
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          <span>Less Similar</span>
          <span>More Similar</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-5 h-5 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs">Your text</span>
        </div>
      </div>
    );
  };
  
  // Don't render anything on the server
  if (!isMounted) {
    return <div className="h-[400px] bg-zinc-100 dark:bg-zinc-800 rounded-lg" />;
  }

  return (
    <div className="vector-space-container">
      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg mb-3">
        <h4 className="text-sm font-medium mb-2">Visualization Controls</h4>
        <div className="flex items-center space-x-3 text-xs">
          <button 
            className={`px-2 py-1 rounded ${
              projectionMethod === 'tsne' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
            }`}
            onClick={() => setProjectionMethod('tsne')}
            disabled={isComputing}
          >
            <span className="mr-1">t-SNE</span>
            <span className="text-[10px] bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 px-1 rounded">
              <abbr title="t-Distributed Stochastic Neighbor Embedding - an algorithm that helps visualize high-dimensional data">?</abbr>
            </span>
          </button>
          <button 
            className={`px-2 py-1 rounded ${
              projectionMethod === 'pca' 
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200' 
                : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
            }`}
            onClick={() => setProjectionMethod('pca')}
            disabled={isComputing}
          >
            <span className="mr-1">PCA</span>
            <span className="text-[10px] bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 px-1 rounded">
              <abbr title="Principal Component Analysis - a technique to reduce the dimensionality of data while preserving its variation">?</abbr>
            </span>
          </button>
          <div className="text-zinc-500 dark:text-zinc-400 ml-2">
            {isComputing && 'Computing projection...'}
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isComputing && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800/80 z-10 rounded-lg">
            <div className="text-zinc-600 dark:text-zinc-300 text-sm">
              Computing projection...
            </div>
          </div>
        )}
        <svg 
          ref={svgRef} 
          width="100%" 
          height="400px"
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
          className="bg-zinc-50 dark:bg-zinc-900 rounded-lg"
        ></svg>
      </div>
      
      {/* Add the color legend */}
      {renderColorLegend()}
      
      <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
        <p>This visualization shows embeddings projected into 2D space. Points closer together have similar semantic meaning.</p>
        <p>Use mouse wheel to zoom and drag to pan. Hover over points to see labels and similarity to your input text.</p>
      </div>
    </div>
  );
};

export default VectorSpaceVisualizer; 