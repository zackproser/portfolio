'use client'

import { useState } from 'react';
import { Book } from 'lucide-react';

const questions = [
  {
    question: "Which tokenization method splits text character by character?",
    options: ["Word tokenization", "Character tokenization", "BPE", "WordPiece"],
    correctIndex: 1
  },
  {
    question: "What's the main advantage of subword tokenization over word tokenization?",
    options: [
      "It's faster to implement", 
      "It generates more tokens", 
      "It handles rare and unseen words better", 
      "It preserves full words always"
    ],
    correctIndex: 2
  },
  {
    question: "Which model family uses the tiktoken tokenizer?",
    options: ["BERT", "T5", "GPT", "DALL-E"],
    correctIndex: 2
  },
  {
    question: "Why is tokenization important for AI language models?",
    options: [
      "It makes the models run faster", 
      "It converts text into numerical representations that models can process", 
      "It preserves grammar rules", 
      "It enables models to generate images"
    ],
    correctIndex: 1
  },
  {
    question: "Which of these would likely produce the most tokens with a BPE tokenizer?",
    options: [
      "A paragraph of common English words", 
      "A paragraph with many technical terms and rare words", 
      "A series of numbers", 
      "An email address"
    ],
    correctIndex: 1
  }
];

export function TokenizationQuiz() {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
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
  };
  
  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg mb-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-white">
        <Book size={20} className="text-blue-500" />
        Tokenization Quiz
      </h3>
      
      {questions.map((q, qIndex) => (
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
        </div>
      ))}
      
      <div className="flex justify-between items-center">
        {showResults ? (
          <>
            <div className="text-lg text-zinc-800 dark:text-white">
              Your score: <span className="font-bold">{score}/{questions.length}</span>
              <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
                ({Math.round((score / questions.length) * 100)}%)
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
              answers.some(a => a === -1)
                ? 'bg-zinc-400 dark:bg-zinc-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={answers.some(a => a === -1)}
            onClick={calculateScore}
          >
            Submit Answers
          </button>
        )}
      </div>
    </div>
  );
} 