'use client'

import { useState, useEffect } from 'react';
import {
  TokenExplorer,
  TokenPricingCalculator,
  TokenizationQuiz
} from './components';

import Image from 'next/image';
import tokenizationDiagram from '@/images/tokenization-diagram.webp'

// New imports
import { FiInfo, FiBook, FiTool, FiDollarSign, FiCode, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { characterTokenize, wordTokenize, simpleBpeTokenize, tiktokenTokenize } from './utils';

export default function TokenizationDemoClient() {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [showAnalysis, setShowAnalysis] = useState(false);
  // New state for stepped learning experience
  const [currentSection, setCurrentSection] = useState(0);
  const [expandedSections, setExpandedSections] = useState([false, false, false, false, false]);
  // Add state for explanation panel
  const [showVocabExplanation, setShowVocabExplanation] = useState(false);
  const [tokenizationMethod, setTokenizationMethod] = useState('tiktoken'); // Default to tiktoken
  // Add state for debounced input text to improve performance
  const [debouncedText, setDebouncedText] = useState('');

  // Debounce text changes to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnalysis(!!inputText);
      setDebouncedText(inputText); // Update debounced text after delay
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText]);

  const handleExampleSelect = (text: string) => {
    setInputText(text);
    setDebouncedText(text); // Update debounced text immediately for examples
  };

  // Toggle section expansion
  const toggleSection = (index: number) => {
    const newExpandedSections = [...expandedSections];
    newExpandedSections[index] = !newExpandedSections[index];
    setExpandedSections(newExpandedSections);
  };

  // Define educational content sections
  const educationalSections = [
    {
      title: "What is Tokenization?",
      icon: <FiInfo className="text-blue-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Tokenization is the process of converting text into smaller units called tokens. These tokens are the basic units that language models process.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Why tokenization matters:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Determines context window limitations</li>
              <li>Affects pricing of API calls</li>
              <li>Impacts model performance on different types of text</li>
            </ul>
          </div>
          <div className="flex justify-center py-2">
            <Image 
              src={tokenizationDiagram}
              alt="Tokenization process diagram" 
              className="max-w-full h-auto rounded-lg shadow-md" 
            />
          </div>
        </div>
      )
    },
    {
      title: "Tokenization Algorithms",
      icon: <FiTool className="text-orange-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            Different algorithms break text into tokens in different ways, with significant implications for efficiency and accuracy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Character Tokenization</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Simplest approach where each character is a token. Inefficient for common words but handles any text.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Word Tokenization</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Words become individual tokens. Efficient for common words but struggles with rare words and variants.
              </p>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">Subword Tokenization (BPE)</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Balance between character and word methods. Handles common words as single tokens and breaks down rare words.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vocabulary & Token IDs",
      icon: <FiBook className="text-purple-500" size={24} />,
      content: (
        <div className="space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300">
            LLMs use a fixed vocabulary of tokens, each with a unique ID. This vocabulary is created during model training and determines how text is tokenized.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Key vocabulary concepts:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>A vocabulary typically contains 50,000-100,000 tokens</li>
              <li>Common words, subwords, and characters have their own tokens</li>
              <li>Special tokens exist for formatting (e.g., &lt;|endoftext|&gt;)</li>
              <li>Each token maps to a vector in the model&apos;s embedding space</li>
            </ul>
          </div>
          <div className="mt-3 p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h4 className="font-medium mb-1 text-blue-800 dark:text-blue-300">Developer Insight:</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Models from the same family (e.g., GPT-3.5, GPT-4) typically share the same tokenizer but may have different 
              context window sizes, which limits how many tokens can be processed in one API call.
            </p>
          </div>
        </div>
      )
    },
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

      {/* Input Area */}
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white resize-none"
              rows={2}
              placeholder="Type or paste any text to see instant tokenization..."
            />
            
            {/* Token count visualization - added here */}
            {debouncedText && (
              <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                {['tiktoken', 'bpe', 'word', 'character'].map((method) => {
                  const getTokenCount = (text: string, method: string) => {
                    switch (method) {
                      case 'character': return characterTokenize(text).length;
                      case 'word': return wordTokenize(text).length;
                      case 'bpe': return simpleBpeTokenize(text).length;
                      case 'tiktoken': return tiktokenTokenize(text).length;
                      default: return 0;
                    }
                  };
                  
                  const count = getTokenCount(debouncedText, method);
                  const maxCount = getTokenCount(debouncedText, 'character');
                  const percentage = Math.round((count / maxCount) * 100);
                  
                  return (
                    <div key={method} className="flex items-center space-x-2">
                      <span className="w-24 inline-block font-medium">{method === 'tiktoken' ? 'OpenAI' : method}:</span>
                      <span className="w-10 inline-block">{count}</span>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: method === 'tiktoken' ? '#10b981' : '#3b82f6',
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs mt-1 text-zinc-500 dark:text-zinc-500">
                  Shorter bars indicate more efficient tokenization (fewer tokens)
                </p>
              </div>
            )}
          </div>
          {showAnalysis && (
            <div className="flex-shrink-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-sm"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-32k">GPT-4 32K</option>
              </select>
            </div>
          )}
        </div>

        {/* Examples Section */}
        <div className="mt-2">
          {/* Description for example buttons */}
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
            Click on an example to see how different types of text are tokenized differently:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Common English Text", "Uncommon Words", "Numbers & Symbols", "Non-English Text", "Code Snippet"].map((title, index) => (
              <button
                key={index}
                className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md"
                onClick={() => {
                  const examples = {
                    "Common English Text": "The quick brown fox jumps over the lazy dog.",
                    "Uncommon Words": "Supercalifragilisticexpialidocious is antidisestablishmentarianism.",
                    "Numbers & Symbols": "Call me at +1 (555) 123-4567 or email john.doe@example.com!",
                    "Non-English Text": "こんにちは世界! Hola Mundo! Привет мир!",
                    "Code Snippet": "function addNumbers(a, b) { return a + b; } // Adds two numbers"
                  };
                  handleExampleSelect(examples[title as keyof typeof examples]);
                }}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tokenization Method Selection - Moved here for better visibility */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 mb-4">
        <div className="flex items-center mb-2">
          <FiTool className="text-orange-500 mr-2" size={20} />
          <h3 className="text-md font-semibold text-blue-700 dark:text-blue-300">Select Tokenization Method</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Different tokenization methods have varying trade-offs in efficiency and accuracy.
        </p>
        <div className="flex flex-wrap gap-2">
          {['tiktoken', 'character', 'wordpiece', 'bpe'].map((method) => (
            <button
              key={method}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                tokenizationMethod === method 
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 border-2 border-purple-500' 
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              }`}
              onClick={() => setTokenizationMethod(method)}
            >
              {method === 'tiktoken' && 'OpenAI Tiktoken'}
              {method === 'character' && 'Character Tokenization'}
              {method === 'wordpiece' && 'Word Tokenization'}
              {method === 'bpe' && 'BPE (Subword)'}
            </button>
          ))}
        </div>
      </div>

      {/* Tokenized Content Visualization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <FiCode className="text-purple-500 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">How do language models &quot;see&quot; text?</h3>
          </div>
          <button
            onClick={() => setShowVocabExplanation(!showVocabExplanation)}
            className="text-sm text-blue-600 dark:text-blue-400 flex items-center"
          >
            Learn about token vocabularies {showVocabExplanation ? <FiChevronDown className="ml-1" /> : <FiChevronRight className="ml-1" />}
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          See how your text is broken into tokens in real-time. Select different tokenization methods to understand their differences.
        </p>
        
        {/* Vocabulary Explanation Panel - Collapsed by default */}
        {showVocabExplanation && (
          <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">Understanding Token Vocabularies</h4>
            <div className="text-sm text-purple-700 dark:text-purple-400 space-y-2">
              <p>
                <span className="font-semibold">Tiktoken (OpenAI):</span> Used by GPT models, with ~100K tokens optimized for English and code.
                Efficiently handles common programming languages and common English patterns.
              </p>
              <p>
                <span className="font-semibold">Character Tokenization:</span> Treats each character as a separate token.
                Very inefficient (more tokens) but handles any text without unknown tokens.
              </p>
              <p>
                <span className="font-semibold">Word Tokenization:</span> Common in earlier NLP models. Treats words as single tokens,
                but struggles with rare words and needs special handling for punctuation.
              </p>
              <p>
                <span className="font-semibold">BPE (Byte-Pair Encoding):</span> The foundation of modern tokenizers like Tiktoken.
                Starts with characters and merges frequent pairs to form a vocabulary of subword units.
              </p>
            </div>
            <div className="mt-3 text-xs text-purple-600 dark:text-purple-400">
              <p>
                <span className="font-semibold">Developer Note:</span> When developing applications with LLMs,
                understanding tokenization helps you optimize prompts, estimate costs, and handle context window limitations more effectively.
              </p>
            </div>
          </div>
        )}
        
        <TokenExplorer 
          text={debouncedText || "Type something to see tokenization in action..."} 
          showExample={!debouncedText}
          tokenizationMethod={tokenizationMethod}
        />
      </div>

      {showAnalysis && (
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center mb-2">
            <FiDollarSign className="text-green-500 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Token Pricing Impact</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Understand how tokens affect your API costs across different models.
          </p>
          <TokenPricingCalculator text={debouncedText} model={selectedModel} />
        </div>
      )}
      
      {/* Quiz section to test understanding */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-3">
          <FiBook className="text-blue-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">Test Your Understanding</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Apply what you&apos;ve learned with these interactive challenges.
        </p>
        <TokenizationQuiz />
      </div>
    </div>
  );
}