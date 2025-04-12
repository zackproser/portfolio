export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {}
} = {}) {
  // Create a bare URL string with properly encoded components
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;
  const params = new URLSearchParams();
  
  // Add parameters
  if (title) params.set('title', title);
  if (description) params.set('description', description);
  
  // Extract image filename
  if (image) {
    const imageSrc = typeof image === 'string' ? image : image?.src;
    if (imageSrc) {
      // Extract just the filename
      let filename;
      if (imageSrc.includes('/')) {
        const segments = imageSrc.split('/');
        filename = segments[segments.length - 1];
      } else {
        filename = imageSrc;
      }
      
      if (filename) {
        params.set('heroImage', filename);
      }
    }
  }
  
  // Return raw URL string without using toString() which could introduce encodings
  return `${baseUrl}?${params.toString()}`;
}
