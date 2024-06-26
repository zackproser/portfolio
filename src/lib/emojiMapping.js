const emojiMap = {
  'deployment': '🚀',
  'scalability': '📈',
  'data management': '💾',
  'vector similarity search': '🔍',
  'integration api': '🔌',
  'security': '🔒',
  'community & ecosystem': '🌐',
  'pricing': '💰',
  'additional features': '✨',
  'yes': '✅',
  'no': '❌',
  'true': '✅',
  'false': '❌',
};

export function getEmoji(key) {
  return emojiMap[key.toLowerCase()] || '';
}
