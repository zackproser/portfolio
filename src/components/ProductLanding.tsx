import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { TableOfContents } from '@/components/TableOfContents'
import { CanvasPattern } from '@/components/CanvasPattern'
import { Content } from '@/lib/shared-types'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
import { createMetadata } from '@/utils/createMetadata'

interface Props {
  content: Content;
}

export const generateMetadata = ({ content }: Props) => {
  if (!content) return null;
  
  return createMetadata({
    description: content.description,
    author: content.author,
    type: 'course',
    commerce: content.commerce,
    landing: content.landing,
    slug: content.slug || '/products'
  });
};

export function ProductLanding({ content }: Props) {
  
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
          description={safeDescription}
          testimonial={landingData.testimonials?.[0]}
        />
        <Introduction 
          title={safeSubtitle}
          description={safeDescription}
          features={landingData.features}
        />
        <NavBar />
        <TableOfContents />
        <FreeChapters 
          title={safeDescription}
        />
        <Pricing 
          price={commerce.price}
          title={title || safeDescription}
          description={safePaywallBody}
          checkoutUrl={checkoutUrl}
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