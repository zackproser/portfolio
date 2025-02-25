/**
 * Custom Jest transformer for MDX files
 * This transformer creates a mock React component with metadata
 */
module.exports = {
  process(sourceText, sourcePath) {
    // Extract filename from path
    const filename = sourcePath.split('/').pop();
    const filenameWithoutExt = filename.replace(/\.mdx$/, '');
    
    // Create metadata based on the filename
    const metadata = {
      title: 'Auto-Mocked MDX Title',
      description: 'This is an auto-mocked MDX file',
      author: 'Auto-Mocked Author',
      date: '2023-01-01',
      slug: filenameWithoutExt,
      type: 'blog',
      tags: ['test', 'mocked'],
    };
    
    // Create a mock React component
    const code = `
      const React = require('react');
      
      // Create a mock React component
      function MockComponent() {
        return React.createElement('div', {}, 'Mocked MDX Content');
      }
      
      // Attach metadata to the component
      MockComponent.metadata = ${JSON.stringify(metadata)};
      
      // Export the component as default and also export metadata
      module.exports = MockComponent;
      module.exports.metadata = ${JSON.stringify(metadata)};
    `;
    
    return { code };
  },
}; 