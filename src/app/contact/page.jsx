import { generateOgUrl } from '@/utils/ogUrl'
import { ContactContent } from './ContactContent'

const data = {
  title: 'Contact Zachary Proser — AI Engineering & Consulting',
  description:
    'Have a project in mind? Get in touch to discuss AI engineering, RAG pipelines, consulting, workshops, or speaking — usually a same-week reply.'
};

const ogUrl = generateOgUrl(data);

export const metadata = {
  title: data.title,
  description: data.description,
  alternates: { canonical: "https://zackproser.com/contact" },
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
  return <ContactContent />
}
