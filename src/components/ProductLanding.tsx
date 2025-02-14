import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { TableOfContents } from '@/components/TableOfContents'
import { Blog } from '@/lib/shared-types'

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

  return (
    <>
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
      />
      <Footer />
    </>
  );
} 