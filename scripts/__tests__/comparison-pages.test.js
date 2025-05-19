const { generateCombinations, slugify } = require('../create-ai-assisted-dev-tools-comparison-pages.js');

describe('comparison page utils', () => {
  test('slugify converts to lowercase and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('generateCombinations creates pairwise combinations', () => {
    const input = [{ name: 'A' }, { name: 'B' }, { name: 'C' }];
    const combos = generateCombinations(input);
    const slugs = combos.map(([a, b]) => `${a.name}-${b.name}`);
    expect(slugs).toEqual(['A-B', 'A-C', 'B-C']);
  });
});
