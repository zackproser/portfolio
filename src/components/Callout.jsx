import React from 'react';

const splitCompoundWord = (word) => {
  // Regular expression to find the point just before the second capital letter
  const regex = /(?=[A-Z][a-z])/;

  // Split the word at the point found by the regex
  const parts = word.split(regex);

  // If the word was split into two parts, return them; otherwise, return the original word
  return parts.length === 2 ? parts.join(' ') : word;
}

// Updated calloutStyles to include gradient backgrounds
const calloutStyles = {
  Focus: { bgGradient: 'bg-gradient-to-l from-blue-100 to-blue-600', emoji: '🔍', emojiSize: 'text-3xl' },
  Metaphor: { bgGradient: 'bg-gradient-to-l from-purple-100 to-purple-600', emoji: '🧞', emojiSize: 'text-3xl' },
  Visuals: { bgGradient: 'bg-gradient-to-l from-yellow-100 to-yellow-600', emoji: '🖼️', emojiSize: 'text-3xl' },
  GoDeeper: { bgGradient: 'bg-gradient-to-l from-pink-100 to-pink-600', emoji: '⛏️', emojiSize: 'text-3xl' },
  PracticalInsights: { bgGradient: 'bg-gradient-to-l from-blue-100 to-blue-600', emoji: '💡', emojiSize: 'text-3xl' },
  SpecialCallout: { bgGradient: 'bg-gradient-to-l from-yellow-100 to-yellow-600', emoji: '🌟', emojiSize: 'text-3xl' },
};

const Callout = ({ type, title, body }) => {
  const { bgGradient, emoji, emojiSize } = calloutStyles[type];
  const displayType = splitCompoundWord(type);

  return (
    <div className={`${bgGradient} p-4 rounded-md my-4`}>
      <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span className={`${emojiSize}`}>{emoji}</span>
        <span className="text-white">{displayType}: <span className="text-gray-900">{title}</span></span>
      </h4>
      <p className="mt-2 text-gray-700">{body}</p>
    </div>
  );

};

export default Callout;
