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

interface Props {
  content: Blog;
}

export function ProductLanding({ content }: Props) {
  console.log('ProductLanding received content:', content);
  
  if (!content) {
    console.log('Content is null or undefined');
    return null;
  }

  const {
    title,
    description,
    commerce,
    landing,
  } = content;

  console.log('Destructured values:', { title, description, commerce, landing });

  // If there's no commerce or landing data, don't render the product landing
  if (!commerce?.isPaid || !landing) {
    console.log('Missing required data:', { commerce, landing });
    return null;
  }

  const bio = `I'm a software engineer with over ${RenderNumYearsExperience()} years of experience building production systems.`

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
          title={title}
          description={description}
          testimonial={landing.testimonials?.[0]}
        />
        <Introduction 
          title={landing.subtitle || title}
          description={description}
          features={landing.features}
        />
        <NavBar />
        <TableOfContents />
        <FreeChapters 
          title={title}
        />
        <Pricing 
          price={commerce.price}
          title={title}
          description={commerce.paywallBody}
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