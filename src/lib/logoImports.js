import pineconeLogo from '@/images/logos/pinecone-logo.webp';
import weaviateLogo from '@/images/logos/weaviate.webp'
import deeplakeLogo from '@/images/logos/deeplake.webp'
import vespaLogo from '@/images/logos/vespa.webp'
import milvusLogo from '@/images/logos/milvus_logo.svg'
import metaLogo from '@/images/logos/meta.webp'
import qdrantLogo from '@/images/logos/qdrant.webp'
import chromaLogo from '@/images/logos/chroma.webp'
import elasticsearchLogo from '@/images/logos/elasticsearch.svg'
import pgvectorLogo from '@/images/logos/pgvector.svg'
import redisLogo from '@/images/logos/redis.svg'

const logoMap = {
  pinecone: pineconeLogo,
  weaviate: weaviateLogo,
  deeplake: deeplakeLogo,
  vespa: vespaLogo,
  milvus: milvusLogo,
  faiss: metaLogo,
  qdrant: qdrantLogo,
  chroma: chromaLogo,
  elasticsearch: elasticsearchLogo,
  pgvector: pgvectorLogo,
  redis: redisLogo
};

export function getLogoById(id) {
  return logoMap[id] || null;
}
