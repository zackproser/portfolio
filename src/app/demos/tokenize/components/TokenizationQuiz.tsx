'use client'

import { useState } from 'react';
import { Book } from 'lucide-react';

const questions = [
  {
    question: "Which tokenization method processes text one character at a time?",
    options: ["Word tokenization", "Character tokenization", "BPE", "Tiktoken"],
    correctIndex: 1,
    explanation: "Character tokenization treats each individual character as a separate token."
  },
  {
    question: "What is the main advantage of subword tokenization methods like BPE?",
    options: [
      "They process text faster than other methods", 
      "They always use fewer tokens than word tokenization", 
      "They handle rare words by breaking them into subword units", 
      "They don't require a vocabulary"
    ],
    correctIndex: 2,
    explanation: "Subword methods like BPE can handle rare or unseen words by breaking them down into meaningful subword units."
  },
  {
    question: "Which tokenizer is used by OpenAI's GPT models?",
    options: ["WordPiece", "SentencePiece", "Tiktoken", "Byte-level BPE"],
    correctIndex: 2,
    explanation: "OpenAI's GPT models use Tiktoken, which is an implementation of byte-pair encoding (BPE) optimized for their models."
  },
  {
    question: "Why does tokenization matter for developers using LLMs?",
    options: [
      "It affects API costs and context window limitations", 
      "It determines how fast the model can generate text", 
      "It controls the temperature parameter", 
      "It enables model fine-tuning"
    ],
    correctIndex: 0,
    explanation: "Tokenization directly impacts how much text fits in a context window and how much API calls cost, as pricing is per token."
  },
  {
    question: "Which of these would typically require the most tokens when processed by a subword tokenizer?",
    options: [
      "Common English phrases", 
      "Technical terminology and rare words", 
      "Simple numeric sequences", 
      "Short code snippets"
    ],
    correctIndex: 1,
    explanation: "Technical terminology and rare words often get broken down into multiple subword tokens, resulting in higher token counts."
  },
  {
    question: "What is a vocabulary in the context of tokenization?",
    options: [
      "A dictionary of all English words", 
      "A fixed set of tokens that the model recognizes", 
      "The total number of unique words in the training data", 
      "A list of stopwords to ignore during processing"
    ],
    correctIndex: 1,
    explanation: "A tokenizer's vocabulary is the fixed set of tokens (words, subwords, or characters) that the model can recognize and process."
  },
  {
    question: "Approximately how many tokens are in a typical LLM vocabulary?",
    options: [
      "1,000-5,000 tokens", 
      "10,000-30,000 tokens", 
      "50,000-100,000 tokens", 
      "500,000-1,000,000 tokens"
    ],
    correctIndex: 2,
    explanation: "Modern LLMs typically have vocabularies containing 50,000-100,000 tokens, as mentioned in our educational content."
  }
];

export function TokenizationQuiz() {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };
  
  const calculateScore = () => {
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctIndex) {
        newScore++;
      }
    }
    setScore(newScore);
    setShowResults(true);
  };
  
  const resetQuiz = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
    setScore(0);
    setCurrentQuestionIndex(0);
  };

  // Only show 5 questions at a time to keep the quiz manageable
  const visibleQuestions = questions.slice(0, 5);
  
  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg mb-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-white">
        <Book size={20} className="text-blue-500" />
        Tokenization Quiz
      </h3>
      
      {visibleQuestions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6">
          <h4 className="font-medium mb-2 text-zinc-800 dark:text-white">
            {qIndex + 1}. {q.question}
          </h4>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <div 
                key={oIndex}
                className={`p-2 rounded-md cursor-pointer flex items-center ${
                  answers[qIndex] === oIndex
                    ? showResults 
                      ? q.correctIndex === oIndex 
                        ? 'bg-green-100 dark:bg-green-800/30 border border-green-200 dark:border-green-600'
                        : 'bg-red-100 dark:bg-red-800/30 border border-red-200 dark:border-red-600'
                      : 'bg-blue-100 dark:bg-blue-800/30 border border-blue-200 dark:border-blue-600'
                    : showResults && q.correctIndex === oIndex
                      ? 'bg-green-100 dark:bg-green-800/30 border border-green-200 dark:border-green-600'
                      : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 border border-zinc-200 dark:border-zinc-600'
                }`}
                onClick={() => !showResults && handleAnswer(qIndex, oIndex)}
              >
                <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center mr-2 text-zinc-800 dark:text-white">
                  {answers[qIndex] === oIndex ? '✓' : String.fromCharCode(65 + oIndex)}
                </div>
                <span className="text-zinc-800 dark:text-white">{option}</span>
                {showResults && q.correctIndex === oIndex && (
                  <span className="ml-auto text-green-600 dark:text-green-400">✓ Correct</span>
                )}
                {showResults && answers[qIndex] === oIndex && q.correctIndex !== oIndex && (
                  <span className="ml-auto text-red-600 dark:text-red-400">✗ Incorrect</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Display explanation when showing results */}
          {showResults && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
              <strong>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-between items-center">
        {showResults ? (
          <>
            <div className="text-lg text-zinc-800 dark:text-white">
              Your score: <span className="font-bold">{score}/{visibleQuestions.length}</span>
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                ({Math.round((score / visibleQuestions.length) * 100)}%)
              </span>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
              onClick={resetQuiz}
            >
              Try Again
            </button>
          </>
        ) : (
          <button
            className={`px-4 py-2 rounded-md text-white ${
              answers.slice(0, visibleQuestions.length).some(a => a === -1)
                ? 'bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={answers.slice(0, visibleQuestions.length).some(a => a === -1)}
            onClick={calculateScore}
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
} 