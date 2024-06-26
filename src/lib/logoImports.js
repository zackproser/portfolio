import pineconeLogo from '@/images/logos/pinecone-logo.webp';
// Import other logos as needed

const logoMap = {
  pinecone: pineconeLogo,
};

export function getLogoById(id) {
  return logoMap[id] || null;
}
