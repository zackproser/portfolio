import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  images: {
    domains: ["localhost", "zackproser.com", "www.zackproser.com"],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@react-email/components",
      "@react-email/render",
      "@react-email/html",
    ],
  },
  transpilePackages: [
    "react-tweet",
    "@react-email/components",
    "@react-email/render",
    "@react-email/html",
  ],
  async redirects() {
    // Permanently redirect what was my old /about page to the homepage
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withMDX(nextConfig);
