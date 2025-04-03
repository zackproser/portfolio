'use client'

const applications = [
  {
    title: "Prompt Engineering",
    description: "Understanding tokenization helps craft efficient prompts that stay within context limits while conveying necessary information.",
    example: "Instead of 'Please provide a detailed explanation of why the sky appears blue during the day', use 'Why is the sky blue?' (13 tokens vs 5 tokens)"
  },
  {
    title: "Cost Optimization",
    description: "Token-aware text processing can significantly reduce API costs when working with large language models at scale.",
    example: "Processing 1M customer inquiries with optimized prompts could save thousands of dollars in API costs."
  },
  {
    title: "Context Window Management",
    description: "For complex applications, managing the token budget efficiently allows fitting more relevant information within the context window.",
    example: "A chatbot that needs to reference user history, product information, and company policies within a 4K token limit."
  },
  {
    title: "Multilingual Applications",
    description: "Different languages tokenize differently, affecting how much content fits in your context window across languages.",
    example: "Chinese and Japanese often use fewer tokens than English for the same content, while some European languages may use more."
  }
];

export function TokenApplications() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {applications.map((app, index) => (
        <div key={index} className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <h4 className="font-bold text-lg mb-2 text-zinc-800 dark:text-white">{app.title}</h4>
          <p className="mb-3 text-zinc-700 dark:text-zinc-300">{app.description}</p>
          <div className="text-sm bg-zinc-100 dark:bg-zinc-900 p-3 rounded border-l-4 border-green-500">
            <span className="block text-zinc-600 dark:text-zinc-400 mb-1">Example:</span>
            <span className="text-zinc-800 dark:text-zinc-200">{app.example}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 