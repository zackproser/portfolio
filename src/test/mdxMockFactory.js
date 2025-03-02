/**
 * Factory function to create mock MDX components with custom metadata
 * This allows for creating consistent mocks across tests
 */

// Import React for JSX support
const React = require('react');

/**
 * Creates a mock MDX component with the provided metadata
 * @param {Object} metadata - The metadata to attach to the component
 * @param {string} metadata.title - The title of the MDX content
 * @param {string} metadata.description - The description of the MDX content
 * @param {string} metadata.author - The author of the MDX content
 * @param {string} metadata.date - The publication date of the MDX content
 * @param {string} metadata.slug - The slug of the MDX content
 * @param {string} metadata.type - The type of the MDX content (blog, course, etc.)
 * @param {Array<string>} [metadata.tags] - Tags associated with the MDX content
 * @param {Object} [metadata.commerce] - Commerce data for paid content
 * @param {boolean} [metadata.commerce.isPaid] - Whether the content is paid
 * @param {number} [metadata.commerce.price] - The price of the content
 * @param {string} [metadata.commerce.stripe_price_id] - The Stripe price ID
 * @param {number} [metadata.commerce.previewLength] - The number of sections to show in preview
 * @param {string} [metadata.commerce.paywallHeader] - The header text for the paywall
 * @param {string} [metadata.commerce.paywallBody] - The body text for the paywall
 * @param {string} [metadata.commerce.buttonText] - The text for the purchase button
 * @param {Object} [metadata.landing] - Landing page data for content
 * @param {string} [metadata.landing.subtitle] - The subtitle for the landing page
 * @param {Array<Object>} [metadata.landing.features] - Features list for the landing page
 * @param {Array<Object>} [metadata.landing.testimonials] - Testimonials for the landing page
 * @returns {Function} A mock React component with attached metadata
 */
function createMockMdx(metadata) {
  // Ensure required fields are present
  const defaultMetadata = {
    title: 'Default Mock Title',
    description: 'Default mock description',
    author: 'Default Author',
    date: '2023-01-01',
    slug: 'default-mock',
    type: 'blog',
    tags: ['mock', 'test'],
  };
  
  // Merge provided metadata with defaults
  const mergedMetadata = { ...defaultMetadata, ...metadata };
  
  // Create a mock React component
  const MockComponent = () => {
    // In a real component, this would render MDX content
    return React.createElement('div', {}, `Mocked content for ${mergedMetadata.title}`);
  };
  
  // Attach metadata to the component
  MockComponent.metadata = mergedMetadata;
  
  return MockComponent;
}

module.exports = {
  createMockMdx,
}; 