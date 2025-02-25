/**
 * Advanced Jest transformer for MDX files
 * This transformer extracts information from filenames to create more dynamic mocks
 */
const path = require('path');

module.exports = {
  process(sourceText, sourcePath) {
    // Extract filename and directory from path
    const filename = path.basename(sourcePath, '.mdx');
    const directory = path.dirname(sourcePath).split('/').pop();
    
    // Determine content type based on directory
    let contentType = 'blog';
    if (sourcePath.includes('/courses/')) {
      contentType = 'course';
    } else if (sourcePath.includes('/videos/')) {
      contentType = 'video';
    } else if (sourcePath.includes('/demos/')) {
      contentType = 'demo';
    }
    
    // Create metadata based on the filename and directory
    const metadata = {
      title: `${filename.charAt(0).toUpperCase() + filename.slice(1).replace(/-/g, ' ')}`,
      description: `This is a ${contentType} about ${filename.replace(/-/g, ' ')}`,
      author: 'Zachary Proser',
      date: '2023-01-01',
      slug: filename,
      type: contentType,
      tags: [contentType, 'test'],
    };
    
    // Create a table of contents for the mock
    const tableOfContents = {
      items: [
        { title: 'Introduction', url: '#introduction' },
        { title: 'Section 1', url: '#section-1' },
        { title: 'Section 2', url: '#section-2' },
        { title: 'Conclusion', url: '#conclusion' },
      ]
    };
    
    // Create a mock React component
    const code = `
      const React = require('react');
      
      // Create a mock React component
      function MockComponent() {
        return React.createElement('div', {}, 'Mocked MDX Content for ${filename}');
      }
      
      // Attach metadata to the component
      MockComponent.metadata = ${JSON.stringify(metadata)};
      MockComponent.tableOfContents = ${JSON.stringify(tableOfContents)};
      
      // Export the component as default and also export metadata
      module.exports = MockComponent;
      module.exports.metadata = ${JSON.stringify(metadata)};
      module.exports.tableOfContents = ${JSON.stringify(tableOfContents)};
    `;
    
    return { code };
  },
}; 