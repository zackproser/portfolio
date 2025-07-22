const pineconeLogo = 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.webp';
const weaviateLogo = 'https://zackproser.b-cdn.net/images/logos/weaviate.webp'
const deeplakeLogo = 'https://zackproser.b-cdn.net/images/logos/deeplake.webp'
const vespaLogo = 'https://zackproser.b-cdn.net/images/logos/vespa.webp'
const milvusLogo = 'https://zackproser.b-cdn.net/images/logos/milvus_logo.svg'
const metaLogo = 'https://zackproser.b-cdn.net/images/logos/meta.webp'
const qdrantLogo = 'https://zackproser.b-cdn.net/images/logos/qdrant.webp'
const chromaLogo = 'https://zackproser.b-cdn.net/images/logos/chroma.webp'
const elasticsearchLogo = 'https://zackproser.b-cdn.net/images/logos/elasticsearch.svg'
const pgvectorLogo = 'https://zackproser.b-cdn.net/images/logos/pgvector.svg'
const redisLogo = 'https://zackproser.b-cdn.net/images/logos/redis.svg'
const githubCopilotLogo = 'https://zackproser.b-cdn.net/images/devtools/github-copilot-logo.webp'
const vscodeLogo = 'https://zackproser.b-cdn.net/images/devtools/vscode.webp'
const jetbrainsLogo = 'https://zackproser.b-cdn.net/images/devtools/jetbrains.webp'
const intellijLogo = 'https://zackproser.b-cdn.net/images/devtools/intellij.webp'
const neovimLogo = 'https://zackproser.b-cdn.net/images/devtools/neovim.webp'
const emacsLogo = 'https://zackproser.b-cdn.net/images/devtools/emacs.webp'
const vimLogo = 'https://zackproser.b-cdn.net/images/devtools/vim.webp'
const pythonLogo = 'https://zackproser.b-cdn.net/images/languages/python.webp'
const javascriptLogo = 'https://zackproser.b-cdn.net/images/languages/javascript.webp'
const javaLogo = 'https://zackproser.b-cdn.net/images/languages/java.webp'
const cppLogo = 'https://zackproser.b-cdn.net/images/languages/cpp.webp'
const rubyLogo = 'https://zackproser.b-cdn.net/images/languages/ruby.webp'
const typescriptLogo = 'https://zackproser.b-cdn.net/images/languages/typescript.webp'
const goLogo = 'https://zackproser.b-cdn.net/images/languages/go.webp'
const phpLogo = 'https://zackproser.b-cdn.net/images/languages/php.webp'
const swiftLogo = 'https://zackproser.b-cdn.net/images/languages/swift.webp'
const csharpLogo = 'https://zackproser.b-cdn.net/images/languages/csharp.webp'
const warpLogo = 'https://zackproser.b-cdn.net/images/devtools/warp.webp'
const descriptLogo = 'https://zackproser.b-cdn.net/images/devtools/descript.webp'
const codeiumLogo = 'https://zackproser.b-cdn.net/images/devtools/codeium.webp'
const kapwingLogo = 'https://zackproser.b-cdn.net/images/devtools/kapwing.webp'
const aiderLogo = 'https://zackproser.b-cdn.net/images/devtools/aider.webp'
const codyLogo = 'https://zackproser.b-cdn.net/images/devtools/cody.webp'
const modsLogo = 'https://zackproser.b-cdn.net/images/devtools/mods.webp'
const cursorLogo = 'https://zackproser.b-cdn.net/images/devtools/cursor.webp'
const opusclipLogo = 'https://zackproser.b-cdn.net/images/devtools/opusclip.webp'
const tabnineLogo = 'https://zackproser.b-cdn.net/images/devtools/tabnine.webp'
const mutableLogo = 'https://zackproser.b-cdn.net/images/devtools/mutable.webp'
const codiumaiLogo = 'https://zackproser.b-cdn.net/images/devtools/codeiumai.webp'
const gritioLogo = 'https://zackproser.b-cdn.net/images/devtools/gritio.webp'
const adrenalineLogo = 'https://zackproser.b-cdn.net/images/devtools/adrenaline.webp'
const codewhispererLogo = 'https://zackproser.b-cdn.net/images/devtools/codewhisperer.webp'
const figstackLogo = 'https://zackproser.b-cdn.net/images/devtools/figstack.webp'
const zedLogo = 'https://zackproser.b-cdn.net/images/devtools/zed.webp'

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
  figstack: figstackLogo,
  zed: zedLogo
};

export function getLogoById(id) {
  const formattedId = id.toLowerCase().replace(/\s+/g, '_').replace(/\./g, '');
  return logoMap[formattedId] || null;
}
