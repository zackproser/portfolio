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
import typescriptLogo from '@/images/languages/typescript.webp'
import goLogo from '@/images/languages/go.webp'
import phpLogo from '@/images/languages/php.webp'
import swiftLogo from '@/images/languages/swift.webp'
import csharpLogo from '@/images/languages/csharp.webp'
import warpLogo from '@/images/devtools/warp.webp'
import descriptLogo from '@/images/devtools/descript.webp'
import codeiumLogo from '@/images/devtools/codeium.webp'
import kapwingLogo from '@/images/devtools/kapwing.webp'
import aiderLogo from '@/images/devtools/aider.webp'
import codyLogo from '@/images/devtools/cody.webp'
import modsLogo from '@/images/devtools/mods.webp'
import cursorLogo from '@/images/devtools/cursor.webp'
import opusclipLogo from '@/images/devtools/opusclip.webp'
import tabnineLogo from '@/images/devtools/tabnine.webp'
import mutableLogo from '@/images/devtools/mutable.webp'
import codiumaiLogo from '@/images/devtools/codeiumai.webp'
import gritioLogo from '@/images/devtools/gritio.webp'
import adrenalineLogo from '@/images/devtools/adrenaline.webp'
import codewhispererLogo from '@/images/devtools/codewhisperer.webp'
import figstackLogo from '@/images/devtools/figstack.webp'

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
  ruby: rubyLogo,
  typescript: typescriptLogo,
  go: goLogo,
  php: phpLogo,
  swift: swiftLogo,
  csharp: csharpLogo,
  warp: warpLogo,
  descript: descriptLogo,
  codeium: codeiumLogo,
  kapwing: kapwingLogo,
  aider: aiderLogo,
  cody: codyLogo,
  mods: modsLogo,
  cursor: cursorLogo,
  opusclip: opusclipLogo,
  tabnine: tabnineLogo,
  mutableai: mutableLogo,
  codiumai: codiumaiLogo,
  gritio: gritioLogo,
  grit_io: gritioLogo,
  'grit.io': gritioLogo,
  adrenaline_ai: adrenalineLogo,
  amazon_codewhisperer: codewhispererLogo,
  figstack: figstackLogo
};

export function getLogoById(id) {
  const formattedId = id.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '');
  return logoMap[formattedId] || null;
}
