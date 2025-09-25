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
import { WhatsIncluded } from '@/components/WhatsIncluded'
import { Content } from '@/types'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
import Image from 'next/image'
import { createMetadata } from '@/utils/createMetadata'
import { Metadata, ResolvingMetadata } from 'next'
import { getProductByDirectorySlug } from '@/lib/content-handlers'
import { getConversionTestimonials } from '@/data/testimonials'
import { DirectSupport } from '@/components/DirectSupport'
import { Container } from '@/components/Container'
import { Chapters } from '@/components/Chapters'

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
  const content = await getProductByDirectorySlug(resolvedParams.slug);
  
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
    metadataBase: new URL('https://zackproser.com'), 
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
    directorySlug = '',
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
    testimonials: [],
    whatsIncluded: [],
    credibilityBanner: undefined,
    experiencedEngineersSection: undefined
  };

  // Use provided landing data or fallback to default
  const landingData = landing || defaultLanding;
  const isSimpleLayout = (landingData as any)?.layout === 'simple';

  const bio = `I'm a software engineer with over ${RenderNumYearsExperience()} years of experience building production systems.`

  // Generate the checkout URL using directorySlug
  const checkoutUrl = `/checkout?product=${directorySlug}&type=${type}`;
  // Optional team/company license
  const teamPrice: number | undefined = (commerce as any)?.teamPrice;
  const teamCheckoutUrl = teamPrice ? `/checkout?product=${directorySlug}&type=${type}&license=team` : undefined;

  // Ensure all string values have defaults
  const safeDescription = String(description || '');
  const safeSubtitle = String(landingData.subtitle || description || '');
  const safePaywallBody = String(commerce.paywallBody || description || '');

  if (isSimpleLayout) {
    // Filter out any redundant items that are represented as dedicated sections
    const filteredIncluded = (landingData?.whatsIncluded || []).filter((item: any) => {
      const title = String(item?.title || '').toLowerCase();
      return title !== 'direct email support';
    });
    return (
      <>
        <div className="relative">
          {/* Simple, conversion-focused layout */}
          <Hero 
            title={title || safeDescription}
            heroTitle={landing?.heroTitle}
            description={safeDescription}
            problemSolved={landingData.problemSolved}
            benefitStatement={landingData.benefitStatement}
            testimonial={landingData.testimonials?.[0]}
            image={(landingData as any)?.showHeroImage === false ? undefined : content.image}
            simple
            ctaHref="#pricing"
            ctaLabel="Get instant access"
            secondaryCtaHref="#free-chapters"
            secondaryCtaLabel="Get the free version"
            supportLine="Includes direct support — ask me and I’ll help you ship"
          />
          {/* Chapters / major sections enumeration (above free version) */}
          {Array.isArray((landingData as any)?.contentSections) && (landingData as any).contentSections.length > 0 && (
            <Chapters sections={(landingData as any).contentSections} sectionTitle="Chapters & major sections" sectionSubtitle="A quick outline of what you'll learn and build" />
          )}

          {/* What you get (if applicable) — should follow chapters */}
          {filteredIncluded && filteredIncluded.length > 0 && (
            <WhatsIncluded 
              items={filteredIncluded}
              sectionTitle="What you get"
              sectionSubtitle="Everything you need to ship a production-ready solution"
              uniform
            />
          )}

          {/* Direct support should appear directly under What you get (or under Chapters if none) */}
          <DirectSupport />

          {/* Free version capture section for tagging and conversions */}
          <FreeChapters 
            title={title || safeDescription}
            productSlug={directorySlug}
          />

          {/* Optional sales video slot */}
          {Boolean((landingData as any)?.salesVideoUrl) && (
            <div className="mx-auto max-w-3xl px-6 -mt-6">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                <iframe
                  src={(landingData as any).salesVideoUrl}
                  title="Sales Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          <RealTestimonials 
            testimonials={getConversionTestimonials(3)}
            title="What developers say"
            subtitle={`Built by someone with ${RenderNumYearsExperience()} years shipping production software`}
          />

          <Pricing 
            price={commerce.price}
            title={title || safeDescription}
            description={safePaywallBody}
            checkoutUrl={checkoutUrl}
            productSlug={directorySlug}
            productType={type}
            {...(teamPrice ? { teamPrice, teamCheckoutUrl } : {})}
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
        {/* Credibility Banner */}
        {landingData.credibilityBanner && (
          <div className="bg-slate-900 text-white py-3 px-4 text-center text-sm">
            {landingData.credibilityBanner}
          </div>
        )}
        
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
        
        {/* What's Included Section - only render if whatsIncluded data exists */}
        {landingData?.whatsIncluded && landingData.whatsIncluded.length > 0 && (
          <WhatsIncluded 
            items={landingData.whatsIncluded}
            sectionTitle="What's Included"
            sectionSubtitle="Everything you need to build production-ready solutions"
          />
        )}
        
        <NavBar />
        <TableOfContents content={content} />
        <FreeChapters 
          title={safeDescription}
          productSlug={directorySlug}
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
                    href={`/checkout?product=${directorySlug}&type=${type}`}
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
        
        {/* For Experienced Engineers Section */}
        {landingData.experiencedEngineersSection && (
          <div className="py-16 mx-auto text-center max-w-4xl px-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl mb-8">
              {landingData.experiencedEngineersSection.title}
            </h2>
            <div className="text-lg text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {landingData.experiencedEngineersSection.content}
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
          productSlug={directorySlug}
          productType={type}
          teamPrice={450}
          teamCheckoutUrl={teamCheckoutUrl}
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