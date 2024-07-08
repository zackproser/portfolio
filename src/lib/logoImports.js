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
import githubCopilotLogo from '@/images/devtools/github-copilot-logo.webp'
import vscodeLogo from '@/images/devtools/vscode.webp'
import jetbrainsLogo from '@/images/devtools/jetbrains.webp'
import intellijLogo from '@/images/devtools/intellij.webp'
import neovimLogo from '@/images/devtools/neovim.webp'
import emacsLogo from '@/images/devtools/emacs.webp'
import vimLogo from '@/images/devtools/vim.webp'
import pythonLogo from '@/images/languages/python.webp'
import javascriptLogo from '@/images/languages/javascript.webp'
import javaLogo from '@/images/languages/java.webp'
import cppLogo from '@/images/languages/cpp.webp'
import rubyLogo from '@/images/languages/ruby.webp'

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
  redis: redisLogo,
  github_copilot: githubCopilotLogo, 
  vs_code: vscodeLogo,
  jetbrains: jetbrainsLogo,
  visual_studio: vscodeLogo,
  intellij: intellijLogo,
  neovim: neovimLogo,
  emacs: emacsLogo,
  vim: vimLogo,
  python: pythonLogo,
  javascript: javascriptLogo,
  java: javaLogo,
  cpp: cppLogo,
  ruby: rubyLogo
};

export function getLogoById(id) {
  const formattedId = id.replace(/\s+/g, '_'); 
  return logoMap[formattedId] || null;
}
