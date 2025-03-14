import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { TableOfContents } from '@/components/TableOfContents'
import { CanvasPattern } from '@/components/CanvasPattern'
import { RealTestimonials } from '@/components/RealTestimonials'
import { Content } from '@/types'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
import Image from 'next/image'
import { createMetadata } from '@/utils/createMetadata'
import { Metadata, ResolvingMetadata } from 'next'
import { getProductBySlug } from '@/lib/content-handlers'
import { getConversionTestimonials } from '@/data/testimonials'

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch the content based on the slug
  const resolvedParams = await params;
  const content = await getProductBySlug(resolvedParams.slug);
  
  if (!content) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }
  
  // Get parent metadata to potentially extend it
  const previousImages = (await parent).openGraph?.images || [];
  
  // Create the metadata using our utility
  const metadata = createMetadata({
    title: content.title,
    description: content.description,
    author: content.author,
    type: content.type || 'course',
    commerce: content.commerce,
    landing: content.landing,
    slug: content.slug || resolvedParams.slug || '/products'
  });
  
  // Return the metadata in Next.js expected format
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [
        ...(Array.isArray(metadata.openGraph?.images) ? metadata.openGraph.images : []),
        ...previousImages
      ],
    }
  };
}

export function ProductLanding({ content }: { content: Content }) {
  
  if (!content) {
    console.log('Content is null or undefined');
    return null;
  }

  const {
    description = '',
    commerce,
    landing,
    slug = '',
    type = 'course',
    title = ''
  } = content;

  // If there's no commerce data or isPaid is false, don't render the product landing
  if (!commerce?.isPaid) {
    console.log('Missing required commerce data or isPaid is false');
    return null;
  }

  // Generate default landing data if not provided
  const defaultLanding = {
    subtitle: description || '',
    // Default problem statement and benefit
    problemSolved: 'Need a chatbot that understands your business data?',
    benefitStatement: 'Create a custom AI assistant that knows your business inside and out',
    features: [
      {
        title: 'Complete Tutorial',
        description: 'Step-by-step instructions to build a production-ready solution'
      },
      {
        title: 'Source Code',
        description: 'Full access to all source code and examples'
      },
      {
        title: 'Lifetime Access',
        description: 'One-time purchase with unlimited future access'
      }
    ],
    testimonials: []
  };

  // Use provided landing data or fallback to default
  const landingData = landing || defaultLanding;

  const bio = `I'm a software engineer with over ${RenderNumYearsExperience()} years of experience building production systems.`

  // Generate the checkout URL
  const checkoutUrl = `/checkout?product=${slug}&type=${type}`;

  // Ensure all string values have defaults
  const safeDescription = String(description || '');
  const safeSubtitle = String(landingData.subtitle || description || '');
  const safePaywallBody = String(commerce.paywallBody || description || '');

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <CanvasPattern 
            className="absolute inset-0 h-full w-full text-slate-900/[0.1] dark:text-white/[0.1]" 
            width={40} 
            height={40} 
          />
        </div>
        <Hero 
          title={title || safeDescription}
          heroTitle={landing?.heroTitle}
          description={safeDescription}
          problemSolved={landingData.problemSolved}
          benefitStatement={landingData.benefitStatement}
          testimonial={landingData.testimonials?.[0]}
          image={content.image}
        />
        <Introduction 
          title={safeSubtitle}
          description={safeDescription}
          features={landingData.features}
        />
        <NavBar />
        <TableOfContents content={content} />
        <FreeChapters 
          title={safeDescription}
          productSlug={slug}
        />
        
        {/* Add real testimonials section before pricing to enhance conversions */}
        {/* Profile Image Section (if available) */}
        {commerce.profileImage && (
          <div className="py-16 mx-auto text-center max-w-7xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-10 bg-slate-50 dark:bg-slate-800/60 rounded-2xl overflow-hidden">
              <div className="max-w-2xl text-left py-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Expert-crafted solution for real-world applications
                </h2>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                  This comprehensive package provides everything you need to build production-ready AI systems that understand and answer questions based on your proprietary data.
                </p>
                <div className="mt-8">
                  <a
                    href={`/checkout?product=${slug}&type=${type}`}
                    className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Get instant access
                  </a>
                </div>
              </div>
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden rounded-xl">
                <Image
                  src={commerce.profileImage}
                  alt={`${title} visualization`}
                  className="h-auto w-full object-cover"
                  width={600}
                  height={600}
                />
              </div>
            </div>
          </div>
        )}
        
        <RealTestimonials 
          testimonials={getConversionTestimonials(6)}
          title="What developers say about my work"
          subtitle={`Learn from someone with ${RenderNumYearsExperience()} years of real-world experience building professional software`}
        />
        
        <Pricing 
          price={commerce.price}
          title={title || safeDescription}
          description={safePaywallBody}
          checkoutUrl={checkoutUrl}
          productSlug={slug}
          productType={type}
        />
        <Author 
          name={content.author}
          bio={bio}
        />
        <Footer />
      </div>
    </>
  );
} 