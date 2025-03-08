import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypePrism from "@mapbox/rehype-prism";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  images: {
    domains: [
      "localhost", 
      "zackproser.com", 
      "www.zackproser.com",
      "img.youtube.com", 
      "placehold.co",
      "avatars.githubusercontent.com"
    ],
  },
  transpilePackages: [
    "react-tweet",
  ],
  async redirects() {
    return [
      {
        source: '/newsletter\.',
        destination: '/newsletter',
        permanent: true
      },
      {
        source: '/subscribe\.',
        destination: '/subscribe',
        permanent: true
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.zackproser.com' }],
        destination: 'https://zackproser.com/:path*',
        permanent: true
      },
      {
        source: '/software/teatutor-deepdive',
        destination: '/blog/teatutor-deepdive',
        permanent: true,
      },
      {
        source: '/blog/video-reviewing-github-prs-in-terminal',
        destination: '/videos/video-reviewing-github-prs-in-terminal',
        permanent: true,
      },
      {
        source: '/blog/modern-deployment',
        destination: '/blog/api-cicd-pulumi-github',
        permanent: true,
      },
      {
        source: '/blog/video-aws-vault-intro',
        destination: '/videos/video-aws-vault-intro',
        permanent: true,
      }, 
      {
        source: '/blog/weaviate-vs-chroma',
        destination: '/comparisons/weaviate-vs-chroma',
        permanent: true,
      },
      {
        source: '/blog/pinecone-vs-chroma',
        destination: '/comparisons/pinecone-vs-chroma',
        permanent: true,
      },
      {
        source: '/blog/weaviate-vs-milvus',
        destination: '/comparisons/weaviate-vs-milvus',
        permanent: true,
      },
      {
        source: '/blog/chroma-vs-milvus',
        destination: '/comparisons/chroma-vs-milvus',
        permanent: true
      },
      {
        source: '/blog/faiss-vs-chroma', 
        destination: '/comparisons/faiss-vs-chroma',
        permanent: true
      },
      {
        source: '/blog/faiss-vs-milvus',
        destination: '/comparisons/faiss-vs-milvus',
        permanent: true
      },
      {
        source: '/blog/pinecone-vs-faiss',
        destination: '/comparisons/pinecone-vs-faiss',
        permanent: true
      },
      {
        source: '/blog/pinecone-vs-milvus',
        destination: '/comparisons/pinecone-vs-weaviate',
        permanent: true
      },
      {
        source: '/blog/pinecone-vs-weaviate',
        destination: '/comparisons/pinecone-vs-weaviate',
        permanent: true
      },
      {
        source: '/blog/weaviate-vs-faiss',
        destination: '/comparisons/weaviate-vs-faiss',
        permanent: true
      },
      {
        source: '/blog/weaviate-vs-milvus',
        destination: '/comparisons/weaviate-vs-milvus',
        permanent: true
      },
      {
        source: '/blog/vector-databases-compared',
        destination: '/vectordatabases',
        permanent: true
      }
    ]
  },
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkToc],
    rehypePlugins: [rehypePrism, rehypeSlug, [
      rehypeAutolinkHeadings,
      {
        behaviour: 'append',
        properties: {
          ariaHidden: true,
          tabIndex: -1,
          className: 'hash-link'
        }
      }
    ]],
  },
});

export default withMDX(nextConfig);
