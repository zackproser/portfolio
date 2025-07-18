import { type MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/LinkButton'

export function useMDXComponents(components: MDXComponents) {
  return {
    // Add custom components that can be used in MDX
    Link: ({ href, children, ...props }: { href: any; children: React.ReactNode; [key: string]: any }) => (
      <Link href={href} {...props}>
        {children}
      </Link>
    ),
    Button: ({ href, variant, children, ...props }: { href: string; variant?: string; children: React.ReactNode; [key: string]: any }) => (
      <Button href={href} variant={variant} {...props}>
        {children}
      </Button>
    ),
    Image: ({ src, alt, width, height, ...props }: { src: string; alt: string; width?: number; height?: number; [key: string]: any }) => (
      <Image 
        src={src} 
        alt={alt} 
        width={width || 800} 
        height={height || 600} 
        {...props} 
      />
    ),
    // Allow other components to be passed in
    ...components,
  }
}
