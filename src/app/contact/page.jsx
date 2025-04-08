import { Container } from '@/components/Container'
import { generateOgUrl } from '@/utils/ogUrl'
import { ContactContent } from './ContactContent'

const data = {
  title: 'Contact me',
  description:
    'Something on your mind? I am easy to find...'
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Zack Proser&apos;s portfolio',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <ContactContent />
    </Container>
  )
}
