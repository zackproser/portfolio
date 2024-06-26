import pineconeLogo from '@/images/logos/pinecone-logo.webp';
import weaviateLogo from '@/images/logos/weaviate.webp'
import deeplakeLogo from '@/images/logos/deeplake.webp'
import vespaLogo from '@/images/logos/vespa.webp'
import milvusLogo from '@/images/logos/milvus_logo.svg'
import metaLogo from '@/images/logos/meta.webp'
import qdrantLogo from '@/images/logos/qdrant.webp'
import chromaLogo from '@/images/logos/chroma.webp'

const logoMap = {
  pinecone: pineconeLogo,
  weaviate: weaviateLogo,
  deeplake: deeplakeLogo,
  vespa: vespaLogo,
  milvus: milvusLogo,
  faiss: metaLogo,
  qdrant: qdrantLogo,
  chroma: chromaLogo
};

export function getLogoById(id) {
  return logoMap[id] || null;
}
