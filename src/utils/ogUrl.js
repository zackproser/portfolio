export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {}
} = {}) {
  // Create a bare URL with properly encoded components
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og/generate`;
  
  // Always start with a new URLSearchParams object for clean encoding
  const params = new URLSearchParams();
  
  // Add title and description
  if (title) {
    params.set('title', String(title));
  }
  
  if (description) {
    params.set('description', String(description));
  }
  
  // Extract image info - with extra debugging
  if (image) {
    console.log('[ogUrl] Processing image:', typeof image, 
      typeof image === 'object' ? Object.keys(image).join(',') : '');
      
    // For Next.js imported images with src property
    if (typeof image === 'object' && image !== null && 'src' in image) {
      console.log('[ogUrl] Using image src:', image.src);
      params.set('imageSrc', image.src);
    } 
    // For string references
    else if (typeof image === 'string') {
      console.log('[ogUrl] Using image string:', image);
      params.set('imageSrc', image);
    }
    // Special case - for imported images with default property
    else if (typeof image === 'object' && image !== null && 'default' in image && 
             typeof image.default === 'object' && image.default !== null && 'src' in image.default) {
      console.log('[ogUrl] Using image.default.src:', image.default.src);
      params.set('imageSrc', image.default.src);
    }
  }
  
  // Generate the URL with properly encoded parameters
  const url = `${baseUrl}?${params.toString()}`;
  console.log('[ogUrl] Generated URL:', url);
  
  return url;
}
