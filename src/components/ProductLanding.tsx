import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { TableOfContents } from '@/components/TableOfContents'
import { CanvasPattern } from '@/components/CanvasPattern'
import { Blog } from '@/lib/shared-types'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
import { createMetadata } from '@/utils/createMetadata'

interface Props {
  content: Blog;
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
    type = 'course'
  } = content;

  // If there's no commerce or landing data, don't render the product landing
  if (!commerce?.isPaid || !landing) {
    console.log('Missing required data:', { commerce, landing });
    return null;
  }

  const bio = `I'm a software engineer with over ${RenderNumYearsExperience()} years of experience building production systems.`

  // Generate the checkout URL
  const checkoutUrl = `/checkout?product=${slug}&type=${type}`;

  // Ensure all string values have defaults
  const safeDescription = String(description || '');
  const safeSubtitle = String(landing.subtitle || description || '');
  const safePaywallBody = String(commerce.paywallBody || '');

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
          title={safeDescription}
          description={safeDescription}
          testimonial={landing.testimonials?.[0]}
        />
        <Introduction 
          title={safeSubtitle}
          description={safeDescription}
          features={landing.features}
        />
        <NavBar />
        <TableOfContents />
        <FreeChapters 
          title={safeDescription}
        />
        <Pricing 
          price={commerce.price}
          title={safeDescription}
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