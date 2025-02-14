import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { FreeChapters } from '@/components/FreeChapters'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { Resources } from '@/components/Resources'
import { TableOfContents } from '@/components/TableOfContents'
import { Testimonial } from '@/components/Testimonial'
import { Testimonials } from '@/components/Testimonials'
import { Blog } from '@/lib/shared-types'

interface Props {
  content: Blog;
}

export function ProductLanding({ content }: Props) {
  if (!content) return null;

  return (
    <>
      <Hero />
      <Introduction />
      <NavBar />
      <TableOfContents />
      <FreeChapters />
      <Pricing />
      <Author />
      <Footer />
    </>
  );
} 