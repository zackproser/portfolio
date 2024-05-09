'use client';

import { useChat } from 'ai/react';
import { clsx } from 'clsx'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full mt-15 p-4 max-w-md mx-auto stretch overflow-y-scroll">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap font-bold">
          <span className={clsx({
            "text-blue-700": m.role === 'user',
            "text-green-700": m.role !== 'user'
          })}>{m.role === 'user' ? 'You: ' : 'The Ghost of Zachary Proser\'s Writing: '}</span>
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask the Ghost of Zachary Proser's Writing something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
