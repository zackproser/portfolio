import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '../../../../auth'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  try {
    // Try to find the content in different content types
    const contentTypes = ['blog', 'courses', 'videos', 'demos']
    
    for (const type of contentTypes) {
      try {
        const mdxModule = await import(`../../../app/${type}/${slug}/page.mdx`)
        if (mdxModule.metadata) {
          return {
            title: `Checkout - ${mdxModule.metadata.title}`,
            description: `Purchase access to ${mdxModule.metadata.title}`
          }
        }
      } catch (error) {
        // Continue to the next content type
      }
    }
    
    return {
      title: 'Checkout',
      description: 'Purchase content'
    }
  } catch (error) {
    console.error(`Error loading metadata for checkout ${slug}:`, error)
    return {
      title: 'Checkout',
      description: 'Purchase content'
    }
  }
}

export default async function CheckoutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Check if user is logged in
  const session = await auth()
  if (!session?.user) {
    // Redirect to login page with return URL
    return redirect(`/login?returnUrl=/checkout/${slug}`)
  }
  
  // Try to find the content in different content types
  const contentTypes = ['blog', 'courses', 'videos', 'demos']
  let contentMetadata = null
  let contentType = ''
  
  for (const type of contentTypes) {
    try {
      const contentPath = path.join(process.cwd(), `src/app/${type}/${slug}`)
      if (fs.existsSync(contentPath)) {
        const mdxModule = await import(`../../../app/${type}/${slug}/page.mdx`)
        if (mdxModule.metadata) {
          contentMetadata = mdxModule.metadata
          contentType = type
          break
        }
      }
    } catch (error) {
      // Continue to the next content type
    }
  }
  
  if (!contentMetadata || !contentMetadata.commerce?.isPaid) {
    return notFound()
  }
  
  const { title, description, image, commerce } = contentMetadata
  
  // Redirect to the main checkout page with the product and type as query parameters
  return redirect(`/checkout?product=${slug}&type=${contentType}`)
} 