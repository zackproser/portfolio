export function generateOgUrl({
  title = "Modern Coding",
  description = "Zero Bullshit AI, tooling and projects. Just code that ships."
} = {}) {
  const ogBaseURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;

  const ogTitle = encodeURIComponent(title.replace(/'/g, ''));
  const ogDescription = description ? encodeURIComponent(description.replace(/'/g, '')) : '';

  const ogURLParts = [
    `title=${ogTitle}`,
    ...(ogDescription ? [`description=${ogDescription}`] : [])
  ];

  return `${ogBaseURL}?${ogURLParts.join('&')}`;
}
