export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {}
} = {}) {
  const ogBaseURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;

  const ogTitle = encodeURIComponent(title.replace(/'/g, ''));
  const ogDescription = description ? encodeURIComponent(description.replace(/'/g, '')) : '';
  // Fix me
  // Temporarily, intentionally omit images so that the fallback image can be rendered
  //const ogImage = image.src || '';
  const ogImage = '';

  const ogURLParts = [
    `title=${ogTitle}`,
    ...(ogDescription ? [`description=${ogDescription}`] : []),
    ...(ogImage ? [`image=${ogImage}`] : [])
  ];

  return `${ogBaseURL}?${ogURLParts.join('&')}`;
}
