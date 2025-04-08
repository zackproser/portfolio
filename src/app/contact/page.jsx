import { Container } from '@/components/Container'
import { generateOgUrl } from '@/utils/ogUrl'
import { ContactContent } from './ContactContent'

const data = {
  title: 'Contact me',
  description: 'Have a project in mind? Let\'s discuss how I can help.'
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  title: data.title,
  description: data.description,
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Modern Coding',
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
