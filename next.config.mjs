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
    domains: ["localhost", "zackproser.com", "www.zackproser.com"],
  },
  transpilePackages: [
    "react-tweet",
  ],
  async redirects() {
    // Permanently redirect what was my old /about page to the homepage
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
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
      }
    ]
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
